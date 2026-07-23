import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import {
  AUTH_WINDOW_MS,
  GENERIC_PASSWORD_RESET_MESSAGE,
  LAST_SEEN_UPDATE_MS,
  MAX_FAILED_ATTEMPTS,
  RESET_TOKEN_DURATION_MS,
  readCredentials,
  readEmailOnly,
  readProfileUpdate,
  readRegistration,
  readResetCredentials,
  type ProfileUpdate,
} from "./public-auth.core";
import {
  DUMMY_PASSWORD_HASH,
  generatePublicUserSessionToken,
  hashPublicUserLoginIdentifier,
  hashPublicUserPassword,
  hashPublicUserSessionToken,
  verifyPublicUserPassword,
} from "./public-auth.crypto";
import { publicUserSessionExpiry } from "./public-auth.cookies";
import {
  PUBLIC_USER_DATABASE,
  type PublicUserDatabase,
  type PublicUserDatabaseClient,
} from "./public-auth.database";
import { PublicAuthEmailProvider } from "./public-auth.email";

export type AuthContext = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type PublicUserAccount = {
  id: string;
  emailNormalized: string;
  emailDisplay: string;
  passwordHash: string;
  displayName: string | null;
  fullName: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  failedLoginCount: number;
  lastLoginAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class PublicAuthService {
  constructor(
    @Inject(PUBLIC_USER_DATABASE) private readonly db: PublicUserDatabase,
    private readonly email: PublicAuthEmailProvider,
  ) {}

  async register(body: unknown, context: AuthContext) {
    const input = readRegistration(body);
    await this.assertNotRateLimited(input.emailNormalized, "REGISTER", context);
    const database = await this.db.client();

    const existing = await database.publicUserAccount.findUnique({
      where: { emailNormalized: input.emailNormalized },
      select: { id: true },
    });
    if (existing) {
      await this.recordAttempt(input.emailNormalized, "REGISTER", false, context);
      throw new ConflictException(
        "An account already exists for this email. Please sign in.",
      );
    }

    const now = new Date();
    const passwordHash = await hashPublicUserPassword(input.password);
    const token = generatePublicUserSessionToken();
    const tokenHash = hashPublicUserSessionToken(token);
    const expiresAt = publicUserSessionExpiry(now);

    const account = await database.$transaction(
      async (transaction: PublicUserDatabaseClient) => {
        const created = await transaction.publicUserAccount.create({
          data: {
            emailNormalized: input.emailNormalized,
            emailDisplay: input.emailDisplay,
            passwordHash,
            displayName: input.displayName,
            lastLoginAt: now,
          },
        });
        await transaction.publicUserSession.create({
          data: {
            accountId: created.id,
            tokenHash,
            expiresAt,
            lastSeenAt: now,
            ipAddress: context.ipAddress ?? null,
            userAgent: context.userAgent ?? null,
          },
        });
        await transaction.publicUserAuthAttempt.create({
          data: {
            emailHash: this.emailHash(input.emailNormalized),
            ipAddressHash: this.ipHash(context.ipAddress),
            action: "REGISTER",
            successful: true,
          },
        });
        await this.writeAudit(transaction, "PUBLIC_USER_REGISTER", created.id, context);
        return created;
      },
    );

    return { token, expiresAt, account: this.safeAccount(account) };
  }

  async login(body: unknown, context: AuthContext) {
    const input = readCredentials(body);
    await this.assertNotRateLimited(input.emailNormalized, "LOGIN", context);
    const database = await this.db.client();

    const account = await database.publicUserAccount.findUnique({
      where: { emailNormalized: input.emailNormalized },
    });
    // Constant-time path: always run a verify, against a dummy hash when the
    // account is absent, so response timing cannot reveal account existence.
    const matches = await verifyPublicUserPassword(
      account?.passwordHash ?? DUMMY_PASSWORD_HASH,
      input.password,
    );

    if (account && account.status !== "ACTIVE") {
      await this.recordAttempt(input.emailNormalized, "LOGIN", false, context);
      throw new ForbiddenException("Your account has been disabled.");
    }
    if (!account || !matches) {
      await this.recordAttempt(input.emailNormalized, "LOGIN", false, context);
      if (account) {
        await database.publicUserAccount.update({
          where: { id: account.id },
          data: { failedLoginCount: { increment: 1 } },
        });
      }
      // Generic message — never distinguish "no such user" from "bad password".
      throw new UnauthorizedException("Invalid email or password.");
    }

    const now = new Date();
    const token = generatePublicUserSessionToken();
    const expiresAt = publicUserSessionExpiry(now);
    await database.$transaction([
      database.publicUserSession.create({
        data: {
          accountId: account.id,
          tokenHash: hashPublicUserSessionToken(token),
          expiresAt,
          lastSeenAt: now,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }),
      database.publicUserAccount.update({
        where: { id: account.id },
        data: { lastLoginAt: now, failedLoginCount: 0 },
      }),
      database.publicUserAuthAttempt.create({
        data: {
          emailHash: this.emailHash(input.emailNormalized),
          ipAddressHash: this.ipHash(context.ipAddress),
          action: "LOGIN",
          successful: true,
        },
      }),
    ]);

    return { token, expiresAt, account: this.safeAccount(account) };
  }

  async logout(rawToken: string) {
    if (!rawToken || rawToken.length > 256) return;
    const database = await this.db.client();
    await database.publicUserSession.updateMany({
      where: { tokenHash: hashPublicUserSessionToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async session(rawToken: string) {
    const account = await this.requireAccount(rawToken);
    return { account: this.safeAccount(account) };
  }

  async profile(rawToken: string) {
    const account = await this.requireAccount(rawToken);
    return { account: this.fullProfile(account) };
  }

  async updateProfile(rawToken: string, body: unknown, context: AuthContext) {
    const account = await this.requireAccount(rawToken);
    const update: ProfileUpdate = readProfileUpdate(body);
    const database = await this.db.client();
    const updated = await database.publicUserAccount.update({
      where: { id: account.id },
      data: update,
    });
    await this.writeAudit(database, "PUBLIC_USER_PROFILE_UPDATED", account.id, context);
    return { account: this.fullProfile(updated) };
  }

  async forgotPassword(body: unknown, context: AuthContext) {
    const emailNormalized = readEmailOnly(body);
    await this.assertNotRateLimited(emailNormalized, "PASSWORD_RESET", context);
    const database = await this.db.client();

    const account = await database.publicUserAccount.findUnique({
      where: { emailNormalized },
      select: { id: true, status: true, emailDisplay: true },
    });

    // Only mint + email when the account exists and is active — but the
    // response is IDENTICAL either way (no enumeration).
    if (account && account.status === "ACTIVE") {
      const now = new Date();
      const token = generatePublicUserSessionToken();
      await database.$transaction(async (transaction: PublicUserDatabaseClient) => {
        await transaction.publicUserPasswordResetToken.create({
          data: {
            accountId: account.id,
            tokenHash: hashPublicUserSessionToken(token),
            expiresAt: new Date(now.getTime() + RESET_TOKEN_DURATION_MS),
            ipAddress: context.ipAddress ?? null,
            userAgent: context.userAgent ?? null,
          },
        });
        await transaction.publicUserAuthAttempt.create({
          data: {
            emailHash: this.emailHash(emailNormalized),
            ipAddressHash: this.ipHash(context.ipAddress),
            action: "PASSWORD_RESET",
            successful: true,
          },
        });
        await this.writeAudit(
          transaction,
          "PUBLIC_USER_PASSWORD_RESET_REQUESTED",
          account.id,
          context,
        );
      });
      // Email delivery never throws and never affects the response.
      await this.email.sendPasswordReset(
        account.emailDisplay,
        this.resetUrl(token),
      );
    } else {
      await this.recordAttempt(emailNormalized, "PASSWORD_RESET", false, context);
    }

    return { success: true, message: GENERIC_PASSWORD_RESET_MESSAGE };
  }

  async resetPassword(body: unknown, context: AuthContext) {
    const input = readResetCredentials(body);
    const tokenHash = hashPublicUserSessionToken(input.token);
    const database = await this.db.client();
    const now = new Date();

    const reset = await database.publicUserPasswordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
    });
    const account = reset
      ? await database.publicUserAccount.findUnique({ where: { id: reset.accountId } })
      : null;
    if (!reset || !account || account.status !== "ACTIVE") {
      throw new BadRequestException("This password reset link is invalid or expired.");
    }

    const passwordHash = await hashPublicUserPassword(input.password);
    await database.$transaction(async (transaction: PublicUserDatabaseClient) => {
      await transaction.publicUserPasswordResetToken.update({
        where: { id: reset.id },
        data: { usedAt: now },
      });
      await transaction.publicUserAccount.update({
        where: { id: account.id },
        data: { passwordHash, failedLoginCount: 0 },
      });
      // Revoke ALL existing sessions — a reset invalidates everywhere.
      await transaction.publicUserSession.updateMany({
        where: { accountId: account.id, revokedAt: null },
        data: { revokedAt: now },
      });
      await this.writeAudit(
        transaction,
        "PUBLIC_USER_PASSWORD_RESET_COMPLETED",
        account.id,
        context,
      );
    });

    return { success: true, message: "Your password has been reset. Please sign in." };
  }

  private async requireAccount(rawToken: string): Promise<PublicUserAccount> {
    if (!rawToken || rawToken.length > 256) throw new UnauthorizedException();
    const now = new Date();
    const database = await this.db.client();
    const sessionRow = await database.publicUserSession.findFirst({
      where: {
        tokenHash: hashPublicUserSessionToken(rawToken),
        revokedAt: null,
        expiresAt: { gt: now },
      },
    });
    if (!sessionRow) throw new UnauthorizedException();
    const account = await database.publicUserAccount.findUnique({
      where: { id: sessionRow.accountId },
    });
    if (!account || account.status !== "ACTIVE") throw new UnauthorizedException();

    if (
      !sessionRow.lastSeenAt ||
      now.getTime() - new Date(sessionRow.lastSeenAt).getTime() >= LAST_SEEN_UPDATE_MS
    ) {
      await database.publicUserSession.updateMany({
        where: { id: sessionRow.id, revokedAt: null, expiresAt: { gt: now } },
        data: { lastSeenAt: now },
      });
    }
    return account;
  }

  private async assertNotRateLimited(
    email: string,
    action: string,
    context: AuthContext,
  ) {
    const database = await this.db.client();
    const since = new Date(Date.now() - AUTH_WINDOW_MS);
    const emailHash = this.emailHash(email);
    const ipAddressHash = this.ipHash(context.ipAddress);
    const [emailCount, ipCount] = await Promise.all([
      database.publicUserAuthAttempt.count({
        where: { emailHash, action, successful: false, createdAt: { gte: since } },
      }),
      ipAddressHash
        ? database.publicUserAuthAttempt.count({
            where: { ipAddressHash, action, successful: false, createdAt: { gte: since } },
          })
        : Promise.resolve(0),
    ]);
    if (emailCount >= MAX_FAILED_ATTEMPTS || ipCount >= MAX_FAILED_ATTEMPTS) {
      throw new ForbiddenException("Too many attempts. Please try again later.");
    }
  }

  private async recordAttempt(
    email: string,
    action: string,
    successful: boolean,
    context: AuthContext,
  ) {
    const database = await this.db.client();
    await database.publicUserAuthAttempt.create({
      data: {
        emailHash: this.emailHash(email),
        ipAddressHash: this.ipHash(context.ipAddress),
        action,
        successful,
      },
    });
  }

  private async writeAudit(
    database: PublicUserDatabaseClient,
    action: string,
    accountId: string,
    context: AuthContext,
  ) {
    await database.auditLog
      .create({
        data: {
          action,
          entityType: "PublicUserAccount",
          entityId: accountId,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      })
      .catch(() => undefined);
  }

  private emailHash(email: string) {
    return hashPublicUserLoginIdentifier(`public-user-email:${email}`);
  }

  private ipHash(ipAddress?: string | null) {
    return ipAddress
      ? hashPublicUserLoginIdentifier(`public-user-ip:${ipAddress}`)
      : null;
  }

  private resetUrl(token: string) {
    const base =
      process.env.FRONTEND_URL?.trim() ||
      process.env.PUBLIC_WEBSITE_URL?.trim() ||
      "http://localhost:3002";
    return `${base.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
  }

  private safeAccount(account: PublicUserAccount) {
    return {
      id: account.id,
      email: account.emailDisplay,
      displayName: account.displayName,
      status: account.status,
      lastLoginAt: account.lastLoginAt,
      createdAt: account.createdAt,
    };
  }

  private fullProfile(account: PublicUserAccount) {
    return {
      ...this.safeAccount(account),
      fullName: account.fullName,
      phone: account.phone,
      company: account.company,
    };
  }
}
