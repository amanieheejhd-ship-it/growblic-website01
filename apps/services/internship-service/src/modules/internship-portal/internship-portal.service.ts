import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash } from "node:crypto";
import { StreamableFile } from "@nestjs/common";
import {
  confirmationLetterFilename,
  trustedConfirmationLetterData,
} from "@growblic/internship-shared";
import { generateInternshipConfirmationPdf } from "@growblic/internship-shared";
import {
  certificateNumber,
  daysRemaining,
} from "@growblic/internship-shared";
import { generateInternshipCertificatePdf } from "@growblic/internship-shared";
import {
  asNonEmptyString,
  demoPaymentGatewayEnabled,
  paymentAccessToken,
  sha256,
  trustedPlan,
  trustedProgram,
} from "@growblic/internship-shared";
import {
  applicantSessionExpiry,
} from "./internship-portal.cookies";
import {
  generateApplicantSessionToken,
  hashApplicantLoginIdentifier,
  hashApplicantPassword,
  hashApplicantSessionToken,
  normalizeApplicantEmail,
  safePublicId,
  verifyApplicantPassword,
} from "./internship-portal.crypto";

type DatabaseClient = any;
type DatabaseModule = { prisma: DatabaseClient };

const passwordMinLength = 8;
const authWindowMs = 15 * 60 * 1000;
const maxFailedAttempts = 8;
const lastSeenUpdateMs = 5 * 60 * 1000;
const demoPaymentAmountPaise = 100;
const resetTokenDurationMs = 1000 * 60 * 30;
const verificationTokenDurationMs = 1000 * 60 * 60 * 24;
const pendingAuthFlowDurationMs = 1000 * 60 * 15;
const genericPasswordResetMessage =
  "If an account exists for this email, a password reset link has been sent.";
const oauthProviders = ["google", "github"] as const;
const demoCertificateSkills = [
  "Professional Communication",
  "Project Delivery",
  "Technical Fundamentals",
];

type AuthContext = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type OAuthProvider = typeof oauthProviders[number];

type ProviderIdentity = {
  provider: OAuthProvider;
  subject: string;
  email: string;
  emailVerified: boolean;
};

@Injectable()
export class InternshipPortalService {
  private databaseModule: DatabaseModule | null = null;

  async register(body: unknown, context: AuthContext) {
    const input = this.credentials(body);
    await this.assertNotRateLimited(input.emailNormalized, "REGISTER", context);
    const database = await this.database();
    const existing = await database.internshipApplicantAccount.findUnique({
      where: { emailNormalized: input.emailNormalized },
      select: { id: true },
    });
    if (existing) {
      await this.recordAttempt(input.emailNormalized, "REGISTER", false, context);
      throw new ConflictException("An account already exists for this email. Please sign in.");
    }
    const now = new Date();
    const passwordHash = await hashApplicantPassword(input.password);
    const token = generateApplicantSessionToken();
    const tokenHash = hashApplicantSessionToken(token);
    const expiresAt = applicantSessionExpiry(now);
    const result = await database.$transaction(async (transaction: DatabaseClient) => {
      const account = await transaction.internshipApplicantAccount.create({
        data: {
          emailNormalized: input.emailNormalized,
          emailDisplay: input.emailDisplay,
          passwordHash,
          lastLoginAt: now,
        },
      });
      const linkedApplications = await transaction.internshipApplication.updateMany({
        where: { email: { equals: input.emailNormalized, mode: "insensitive" } },
        data: { applicantAccountId: account.id },
      });
      const verificationToken = generateApplicantSessionToken();
      await transaction.internshipApplicantEmailVerificationToken.create({
        data: {
          accountId: account.id,
          tokenHash: hashApplicantSessionToken(verificationToken),
          expiresAt: new Date(now.getTime() + verificationTokenDurationMs),
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      });
      await transaction.internshipApplicantSession.create({
        data: {
          accountId: account.id,
          tokenHash,
          expiresAt,
          lastSeenAt: now,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      });
      await transaction.internshipApplicantAuthAttempt.create({
        data: {
          emailHash: this.emailHash(input.emailNormalized),
          ipAddressHash: this.ipHash(context.ipAddress),
          action: "REGISTER",
          successful: true,
        },
      });
      await transaction.auditLog.create({
        data: {
          action: "INTERNSHIP_APPLICANT_REGISTER",
          entityType: "InternshipApplicantAccount",
          entityId: account.id,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }).catch(() => undefined);
      return { account, linkedApplicationCount: linkedApplications.count, verificationToken };
    });
    await this.deliverDevelopmentToken("verification", input.emailNormalized, result.verificationToken);
    return {
      token,
      expiresAt,
      account: this.safeAccount(result.account),
      linkedApplicationCount: result.linkedApplicationCount,
    };
  }

  async login(body: unknown, context: AuthContext) {
    const input = this.credentials(body);
    await this.assertNotRateLimited(input.emailNormalized, "LOGIN", context);
    const database = await this.database();
    const account = await database.internshipApplicantAccount.findUnique({
      where: { emailNormalized: input.emailNormalized },
    });
    const matches = account
      ? await verifyApplicantPassword(account.passwordHash, input.password)
      : false;
    if (account && account.status !== "ACTIVE") {
      await this.recordAttempt(input.emailNormalized, "LOGIN", false, context);
      throw new ForbiddenException("Your account has been disabled.");
    }
    if (!account || !matches) {
      await this.recordAttempt(input.emailNormalized, "LOGIN", false, context);
      if (account) {
        await database.internshipApplicantAccount.update({
          where: { id: account.id },
          data: { failedLoginCount: { increment: 1 } },
        });
      }
      throw new UnauthorizedException("Invalid email or password.");
    }
    const now = new Date();
    const token = generateApplicantSessionToken();
    const expiresAt = applicantSessionExpiry(now);
    await database.$transaction([
      database.internshipApplicantSession.create({
        data: {
          accountId: account.id,
          tokenHash: hashApplicantSessionToken(token),
          expiresAt,
          lastSeenAt: now,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }),
      database.internshipApplicantAccount.update({
        where: { id: account.id },
        data: { lastLoginAt: now, failedLoginCount: 0 },
      }),
      database.internshipApplication.updateMany({
        where: { email: { equals: account.emailNormalized, mode: "insensitive" } },
        data: { applicantAccountId: account.id },
      }),
      database.internshipApplicantAuthAttempt.create({
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

  // SSO bridge from the PUBLIC accounts-service. The caller forwards the public
  // session token (from the growblic_user_session cookie); we validate it
  // THROUGH accounts-service (server-to-server) and derive the owner's verified
  // email SERVER-SIDE — never from client input. If an internship applicant
  // account already exists for that exact normalized email (and is ACTIVE), we
  // mint a NORMAL applicant session for it (identical to a password login). No
  // match ⇒ nothing is created and no session is minted (the portal then shows
  // its normal login). It is impossible to target any account other than the
  // one matching the session owner's own email.
  async ssoFromPublic(publicSessionToken: string, context: AuthContext) {
    const identity = await this.resolvePublicIdentity(publicSessionToken);
    if (!identity) {
      // Invalid/absent public session, or the bridge is not configured. Treat
      // as "no linked account" — never an error that leaks existence.
      return { linked: false as const };
    }
    const emailNormalized = normalizeApplicantEmail(identity.emailNormalized);
    await this.assertNotRateLimited(emailNormalized, "SSO_FROM_PUBLIC", context);
    const database = await this.database();
    const account = await database.internshipApplicantAccount.findUnique({
      where: { emailNormalized },
    });
    if (!account || account.status !== "ACTIVE") {
      await this.recordAttempt(emailNormalized, "SSO_FROM_PUBLIC", false, context);
      return { linked: false as const };
    }
    const now = new Date();
    const token = generateApplicantSessionToken();
    const expiresAt = applicantSessionExpiry(now);
    await database.$transaction([
      database.internshipApplicantSession.create({
        data: {
          accountId: account.id,
          tokenHash: hashApplicantSessionToken(token),
          expiresAt,
          lastSeenAt: now,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }),
      database.internshipApplicantAccount.update({
        where: { id: account.id },
        data: { lastLoginAt: now, failedLoginCount: 0 },
      }),
      database.internshipApplication.updateMany({
        where: { email: { equals: account.emailNormalized, mode: "insensitive" } },
        data: { applicantAccountId: account.id },
      }),
      database.internshipApplicantAuthAttempt.create({
        data: {
          emailHash: this.emailHash(emailNormalized),
          ipAddressHash: this.ipHash(context.ipAddress),
          action: "SSO_FROM_PUBLIC",
          successful: true,
        },
      }),
      database.auditLog.create({
        data: {
          action: "APPLICANT_SSO_FROM_PUBLIC",
          entityType: "InternshipApplicantAccount",
          entityId: account.id,
          metadata: { publicUserId: identity.id, via: "accounts-service" },
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }),
    ]);
    return {
      linked: true as const,
      token,
      expiresAt,
      account: this.safeAccount(account),
    };
  }

  // Ask accounts-service "who owns this public session?" over the token-guarded
  // internal endpoint. Returns null on ANY failure (unconfigured token, network
  // error, non-2xx, invalid session) so the bridge always fails safe to "no
  // linked account". The email is whatever accounts-service reports for the
  // validated session — the browser cannot influence it.
  private async resolvePublicIdentity(
    publicSessionToken: string,
  ): Promise<{ id: string; emailNormalized: string } | null> {
    if (!publicSessionToken) return null;
    const internalToken = process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN?.trim();
    if (!internalToken) return null;
    const baseUrl = (
      process.env.ACCOUNTS_SERVICE_INTERNAL_URL?.trim() || "http://localhost:4004"
    ).replace(/\/+$/, "");
    try {
      const response = await fetch(`${baseUrl}/internal/public-user-identity`, {
        method: "GET",
        headers: {
          "x-public-identity-internal-token": internalToken,
          "x-public-session-token": publicSessionToken,
          Accept: "application/json",
        },
      });
      if (!response.ok) return null;
      const data = (await response.json().catch(() => null)) as
        | { authenticated?: boolean; id?: unknown; emailNormalized?: unknown }
        | null;
      if (
        !data ||
        data.authenticated !== true ||
        typeof data.id !== "string" ||
        typeof data.emailNormalized !== "string" ||
        !data.emailNormalized
      ) {
        return null;
      }
      return { id: data.id, emailNormalized: data.emailNormalized };
    } catch {
      return null;
    }
  }

  async createPendingAuthFlow(body: unknown, context: AuthContext) {
    const input = this.pendingFlowInput(body);
    const database = await this.database();
    const now = new Date();
    const application = await database.internshipApplication.findUnique({
      where: { submissionKey: input.applicationReference },
      include: { payment: true },
    });
    if (!application) {
      throw new NotFoundException("Internship application was not found.");
    }
    if (application.payment?.status === "PAID") {
      throw new ConflictException("This internship application has already been paid.");
    }
    const program = trustedProgram(application.internshipSlug);
    if (!program) {
      throw new BadRequestException("This internship program is not available for payment.");
    }
    const flowToken = generateApplicantSessionToken();
    const flow = await database.$transaction(async (transaction: DatabaseClient) => {
      await transaction.internshipApplication.update({
        where: { id: application.id },
        data: {
          selectedPlanId: `${input.plan.duration}-days`,
          selectedPlanName: program,
          selectedPlanDuration: input.plan.duration,
          selectedPlanAmountPaise: input.plan.amountPaise,
          selectedPlanCurrency: input.plan.currency,
          planSelectedAt: now,
        },
      });
      return transaction.internshipApplicantAuthFlow.create({
        data: {
          tokenHash: hashApplicantSessionToken(flowToken),
          applicationId: application.id,
          selectedPlanId: `${input.plan.duration}-days`,
          selectedPlanName: program,
          selectedPlanDuration: input.plan.duration,
          selectedPlanAmountPaise: input.plan.amountPaise,
          selectedPlanCurrency: input.plan.currency,
          expiresAt: new Date(now.getTime() + pendingAuthFlowDurationMs),
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      });
    });
    return {
      flowToken,
      expiresAt: flow.expiresAt,
      applicationReference: application.submissionKey,
      selectedPlanId: flow.selectedPlanId,
      selectedPlanName: flow.selectedPlanName,
      durationDays: flow.selectedPlanDuration,
      amountPaise: flow.selectedPlanAmountPaise,
      currency: flow.selectedPlanCurrency,
    };
  }

  async startOAuth(provider: string, query: Record<string, unknown>, context: AuthContext) {
    const oauthProvider = this.oauthProvider(provider);
    const flowToken = asNonEmptyString(query.flowToken, 256);
    if (!flowToken) throw new BadRequestException("Authentication flow token is missing.");
    const database = await this.database();
    const now = new Date();
    const flow = await database.internshipApplicantAuthFlow.findFirst({
      where: {
        tokenHash: hashApplicantSessionToken(flowToken),
        consumedAt: null,
        expiresAt: { gt: now },
      },
      include: { application: true },
    });
    if (!flow) throw new BadRequestException("This authentication flow is invalid or expired.");
    const state = generateApplicantSessionToken();
    const codeVerifier = generateApplicantSessionToken();
    await database.internshipApplicantAuthFlow.update({
      where: { id: flow.id },
      data: {
        provider: oauthProvider,
        oauthStateHash: hashApplicantSessionToken(state),
        oauthCodeVerifier: codeVerifier,
        ipAddress: context.ipAddress ?? flow.ipAddress ?? null,
        userAgent: context.userAgent ?? flow.userAgent ?? null,
      },
    });
    return this.authorizationUrl(oauthProvider, state, codeVerifier);
  }

  async completeOAuth(provider: string, query: Record<string, unknown>, context: AuthContext) {
    const oauthProvider = this.oauthProvider(provider);
    const code = asNonEmptyString(query.code, 2048);
    const state = asNonEmptyString(query.state, 256);
    if (!code || !state) {
      throw new BadRequestException("OAuth callback is missing required data.");
    }
    const database = await this.database();
    const now = new Date();
    const flow = await database.internshipApplicantAuthFlow.findFirst({
      where: {
        provider: oauthProvider,
        oauthStateHash: hashApplicantSessionToken(state),
        consumedAt: null,
        expiresAt: { gt: now },
      },
      include: { application: true },
    });
    if (!flow?.oauthCodeVerifier) {
      throw new BadRequestException("This authentication flow is invalid or expired.");
    }
    const identity = await this.exchangeOAuthCode(oauthProvider, code, flow.oauthCodeVerifier);
    if (!identity.emailVerified) {
      throw new ForbiddenException("Your provider email must be verified before linking an internship application.");
    }
    const identityEmail = normalizeApplicantEmail(identity.email);
    const applicationEmail = normalizeApplicantEmail(flow.application.email);
    if (identityEmail !== applicationEmail) {
      throw new ForbiddenException("The signed-in email must match the internship application email.");
    }
    const sessionToken = generateApplicantSessionToken();
    const sessionExpiresAt = applicantSessionExpiry(now);
    const result = await database.$transaction(async (transaction: DatabaseClient) => {
      const existingIdentity = await transaction.internshipApplicantOAuthIdentity.findUnique({
        where: {
          provider_providerSubject: {
            provider: identity.provider,
            providerSubject: identity.subject,
          },
        },
        include: { account: true },
      });
      let account = existingIdentity?.account ?? await transaction.internshipApplicantAccount.findUnique({
        where: { emailNormalized: identityEmail },
        include: { oauthIdentities: true },
      });
      if (account && account.status !== "ACTIVE") {
        throw new ForbiddenException("Your account has been disabled.");
      }
      if (!account) {
        account = await transaction.internshipApplicantAccount.create({
          data: {
            emailNormalized: identityEmail,
            emailDisplay: identity.email,
            passwordHash: null,
            emailVerifiedAt: now,
            lastLoginAt: now,
          },
          include: { oauthIdentities: true },
        });
      } else {
        account = await transaction.internshipApplicantAccount.update({
          where: { id: account.id },
          data: {
            emailDisplay: account.emailDisplay || identity.email,
            emailVerifiedAt: account.emailVerifiedAt ?? now,
            lastLoginAt: now,
            failedLoginCount: 0,
          },
          include: { oauthIdentities: true },
        });
      }
      if (existingIdentity && existingIdentity.accountId !== account.id) {
        throw new ForbiddenException("This provider identity is already linked to another account.");
      }
      if (!existingIdentity) {
        await transaction.internshipApplicantOAuthIdentity.create({
          data: {
            accountId: account.id,
            provider: identity.provider,
            providerSubject: identity.subject,
            providerEmail: identity.email,
            providerEmailVerified: identity.emailVerified,
          },
        });
      }
      const application = await transaction.internshipApplication.findUnique({
        where: { id: flow.applicationId },
        select: { applicantAccountId: true },
      });
      if (!application || (application.applicantAccountId && application.applicantAccountId !== account.id)) {
        throw new ForbiddenException("This internship application is already linked to another account.");
      }
      await transaction.internshipApplication.update({
        where: { id: flow.applicationId },
        data: { applicantAccountId: account.id },
      });
      await transaction.internshipApplicantAuthFlow.update({
        where: { id: flow.id },
        data: { consumedAt: now },
      });
      await transaction.internshipApplicantSession.create({
        data: {
          accountId: account.id,
          tokenHash: hashApplicantSessionToken(sessionToken),
          expiresAt: sessionExpiresAt,
          lastSeenAt: now,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      });
      await transaction.internshipApplicantAuthAttempt.create({
        data: {
          emailHash: this.emailHash(identityEmail),
          ipAddressHash: this.ipHash(context.ipAddress),
          action: `OAUTH_${identity.provider.toUpperCase()}`,
          successful: true,
        },
      });
      await transaction.auditLog.create({
        data: {
          action: "INTERNSHIP_APPLICANT_OAUTH_LOGIN",
          entityType: "InternshipApplicantAccount",
          entityId: account.id,
          metadata: { provider: identity.provider, applicationId: flow.applicationId },
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }).catch(() => undefined);
      return account;
    });
    const redirect = new URL("/internship-portal", this.frontendUrl());
    redirect.searchParams.set("applicationReference", flow.application.submissionKey);
    redirect.searchParams.set("duration", String(flow.selectedPlanDuration));
    redirect.searchParams.set("auth", "success");
    return {
      token: sessionToken,
      expiresAt: sessionExpiresAt,
      account: this.safeAccount(result),
      redirectUrl: redirect.toString(),
    };
  }

  async logout(rawToken: string) {
    if (!rawToken || rawToken.length > 256) return;
    await (await this.database()).internshipApplicantSession.updateMany({
      where: { tokenHash: hashApplicantSessionToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async session(rawToken: string) {
    const account = await this.requireAccount(rawToken);
    return { account: this.safeAccount(account) };
  }

  async forgotPassword(body: unknown, context: AuthContext) {
    const emailNormalized = this.emailOnly(body);
    await this.assertNotRateLimited(emailNormalized, "PASSWORD_RESET", context);
    const database = await this.database();
    const account = await database.internshipApplicantAccount.findUnique({
      where: { emailNormalized },
      select: { id: true, status: true },
    });
    if (!account || account.status !== "ACTIVE") {
      await this.recordAttempt(emailNormalized, "PASSWORD_RESET", false, context);
      return { success: true, message: genericPasswordResetMessage };
    }
    const now = new Date();
    const token = generateApplicantSessionToken();
    await database.$transaction(async (transaction: DatabaseClient) => {
      await transaction.internshipApplicantPasswordResetToken.create({
        data: {
          accountId: account.id,
          tokenHash: hashApplicantSessionToken(token),
          expiresAt: new Date(now.getTime() + resetTokenDurationMs),
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      });
      await transaction.internshipApplicantAuthAttempt.create({
        data: {
          emailHash: this.emailHash(emailNormalized),
          ipAddressHash: this.ipHash(context.ipAddress),
          action: "PASSWORD_RESET",
          successful: true,
        },
      });
      await transaction.auditLog.create({
        data: {
          action: "INTERNSHIP_APPLICANT_PASSWORD_RESET_REQUESTED",
          entityType: "InternshipApplicantAccount",
          entityId: account.id,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }).catch(() => undefined);
    });
    const developmentUrl = await this.deliverDevelopmentToken("password-reset", emailNormalized, token);
    return {
      success: true,
      message: genericPasswordResetMessage,
      ...(developmentUrl ? { developmentResetUrl: developmentUrl } : {}),
    };
  }

  async resetPassword(body: unknown, context: AuthContext) {
    const input = this.resetCredentials(body);
    const tokenHash = hashApplicantSessionToken(input.token);
    const database = await this.database();
    const now = new Date();
    const reset = await database.internshipApplicantPasswordResetToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
      include: { account: true },
    });
    if (!reset || reset.account.status !== "ACTIVE") {
      throw new BadRequestException("This password reset link is invalid or expired.");
    }
    const passwordHash = await hashApplicantPassword(input.password);
    await database.$transaction(async (transaction: DatabaseClient) => {
      await transaction.internshipApplicantPasswordResetToken.update({
        where: { id: reset.id },
        data: { usedAt: now },
      });
      await transaction.internshipApplicantAccount.update({
        where: { id: reset.accountId },
        data: { passwordHash, failedLoginCount: 0 },
      });
      await transaction.internshipApplicantSession.updateMany({
        where: { accountId: reset.accountId, revokedAt: null },
        data: { revokedAt: now },
      });
      await transaction.auditLog.create({
        data: {
          action: "INTERNSHIP_APPLICANT_PASSWORD_RESET_COMPLETED",
          entityType: "InternshipApplicantAccount",
          entityId: reset.accountId,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }).catch(() => undefined);
    });
    return { success: true, message: "Your password has been reset. Please sign in again." };
  }

  async resendVerification(rawToken: string, context: AuthContext) {
    const account = await this.requireAccount(rawToken);
    if (account.emailVerifiedAt) {
      return { success: true, message: "Your email address is already verified." };
    }
    await this.assertNotRateLimited(account.emailNormalized, "EMAIL_VERIFICATION", context);
    const token = generateApplicantSessionToken();
    await (await this.database()).internshipApplicantEmailVerificationToken.create({
      data: {
        accountId: account.id,
        tokenHash: hashApplicantSessionToken(token),
        expiresAt: new Date(Date.now() + verificationTokenDurationMs),
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null,
      },
    });
    await this.recordAttempt(account.emailNormalized, "EMAIL_VERIFICATION", true, context);
    const developmentUrl = await this.deliverDevelopmentToken("verification", account.emailNormalized, token);
    return {
      success: true,
      message: "Verification email sent.",
      ...(developmentUrl ? { developmentVerificationUrl: developmentUrl } : {}),
    };
  }

  async verifyEmail(body: unknown, context: AuthContext) {
    const token = this.tokenOnly(body);
    const tokenHash = hashApplicantSessionToken(token);
    const database = await this.database();
    const now = new Date();
    const verification = await database.internshipApplicantEmailVerificationToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
      include: { account: true },
    });
    if (!verification) {
      throw new BadRequestException("This verification link is invalid or expired.");
    }
    await database.$transaction(async (transaction: DatabaseClient) => {
      await transaction.internshipApplicantEmailVerificationToken.update({
        where: { id: verification.id },
        data: { usedAt: now },
      });
      await transaction.internshipApplicantAccount.update({
        where: { id: verification.accountId },
        data: { emailVerifiedAt: verification.account.emailVerifiedAt ?? now },
      });
      await transaction.auditLog.create({
        data: {
          action: "INTERNSHIP_APPLICANT_EMAIL_VERIFIED",
          entityType: "InternshipApplicantAccount",
          entityId: verification.accountId,
          ipAddress: context.ipAddress ?? null,
          userAgent: context.userAgent ?? null,
        },
      }).catch(() => undefined);
    });
    return { success: true, message: "Your email address has been verified." };
  }

  async dashboard(rawToken: string, query: Record<string, unknown> = {}) {
    const account = await this.requireAccount(rawToken);
    const application = await this.findOwnedApplication(account, query);
    if (!application) {
      return {
        account: this.dashboardAccount(account),
        application: null,
        applicant: null,
        internship: null,
        payment: null,
        offerLetter: null,
        certificate: null,
        demoPayment: { enabled: demoPaymentGatewayEnabled() },
      };
    }
    const requestedDuration = Number(query.duration);
    const fallbackPlan = trustedPlan(Number.isFinite(requestedDuration) ? requestedDuration : undefined);
    const payment = application.payment;
    const durationDays =
      payment?.selectedDuration ??
      application.selectedPlanDuration ??
      fallbackPlan?.duration ??
      null;
    const now = new Date();
    const startedAt = payment?.internshipStartedAt ?? payment?.joiningDate ?? null;
    const expectedCompletionAt =
      payment?.expectedCompletionAt ??
      application.certificate?.completionDate ??
      null;
    const certificateReady = Boolean(
      expectedCompletionAt &&
      now.getTime() >= expectedCompletionAt.getTime() &&
      application.certificate?.pdfBytes &&
      ["READY", "GENERATED", "EMAILED"].includes(application.certificate.status),
    );
    const remainingDays = certificateReady
      ? 0
      : expectedCompletionAt
        ? daysRemaining(expectedCompletionAt, now)
        : null;
    const durationCompleted = certificateReady || Boolean(
      expectedCompletionAt && now.getTime() >= expectedCompletionAt.getTime(),
    );
    const elapsedDays = certificateReady && durationDays
      ? durationDays
      : startedAt
        ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 86_400_000))
        : null;
    const totalDays = durationDays;
    const progressPercentage = certificateReady
      ? 100
      : totalDays && elapsedDays !== null
        ? Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)))
        : null;
    const certificateEligible = durationCompleted;
    return {
      account: this.dashboardAccount(account),
      application: {
        id: application.id,
        reference: application.submissionKey,
        status: application.status,
        submittedAt: application.createdAt,
      },
      applicant: {
        name: application.candidateName,
        email: application.email,
        phone: application.phone,
        originalApplicationDetails: {
          reference: application.submissionKey,
          internshipSlug: application.internshipSlug,
          state: application.state,
          instituteEnrollment: application.instituteEnrollment,
          instituteName: application.instituteName,
          course: application.course,
          enrollmentNumber: application.enrollmentNumber,
          highestQualification: application.highestQualification,
          passingYear: application.passingYear,
          message: application.message,
          selectedPlan: application.selectedPlanName,
          selectedPlanDuration: application.selectedPlanDuration,
          selectedPlanAmountPaise: application.selectedPlanAmountPaise,
          selectedPlanCurrency: application.selectedPlanCurrency,
          submittedAt: application.createdAt,
        },
      },
      internship: {
        selectedPlan: payment?.internshipProgram ??
          application.selectedPlanName ??
          trustedProgram(application.internshipSlug) ??
          application.internshipSlug,
        durationDays,
        status: payment?.status === "PAID"
          ? certificateReady
            ? "COMPLETED"
            : certificateEligible
            ? "COMPLETED_AWAITING_CERTIFICATE_DETAILS"
            : "ACTIVE"
          : "NOT_STARTED",
        startedAt,
        expectedCompletionAt,
        totalDays,
        elapsedDays,
        remainingDays,
        progressPercentage,
      },
      payment: payment
        ? {
            paymentId: payment.id,
            status: payment.status,
            method: payment.paymentMethod ?? payment.gateway,
            paidAt: payment.paidAt,
            amountPaise: payment.amountPaise,
            currency: payment.currency,
            safeReference: payment.gatewayPaymentId ?? payment.gatewayOrderId,
          }
        : {
            paymentId: null,
            status: "NOT_CREATED",
            method: null,
            paidAt: null,
            safeReference: null,
            amountPaise: application.selectedPlanAmountPaise ?? fallbackPlan?.amountPaise ?? null,
            currency: application.selectedPlanCurrency ?? fallbackPlan?.currency ?? "INR",
          },
      offerLetter: {
        available: payment?.status === "PAID" && Boolean(payment.offerLetterGeneratedAt ?? payment.confirmationIssuedAt),
        generatedAt: payment?.offerLetterGeneratedAt ?? payment?.confirmationIssuedAt ?? null,
      },
      certificate: {
        eligible: certificateEligible,
        available: certificateReady,
        availableAt: expectedCompletionAt,
        status: application.certificate?.status ?? "NOT_STARTED",
        generatedAt: application.certificate?.generatedAt ?? null,
      },
      demoPayment: { enabled: demoPaymentGatewayEnabled() },
    };
  }

  async createDemoSession(rawToken: string, body: unknown) {
    this.requireDemoGateway();
    const account = await this.requireAccount(rawToken);
    const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const application = await this.ownedApplication(account, input);
    const requestedDuration = Number(input.duration);
    const duration = application.selectedPlanDuration ?? requestedDuration;
    if (application.selectedPlanDuration && requestedDuration && application.selectedPlanDuration !== requestedDuration) {
      throw new BadRequestException("Selected internship plan does not match this application.");
    }
    const plan = trustedPlan(duration);
    if (!plan) throw new BadRequestException();
    if (application.payment) {
      if (application.payment.status === "PAID") {
        return {
          paymentId: application.payment.id,
          accessToken: null,
          durationDays: application.payment.selectedDuration,
          status: application.payment.status,
          amount: application.payment.amountPaise,
          currency: application.payment.currency,
        };
      }
      throw new ConflictException("A payment session already exists for this application.");
    }
    const program = trustedProgram(application.internshipSlug);
    if (!program) throw new BadRequestException();
    const accessToken = paymentAccessToken();
    const payment = await (await this.database()).internshipPayment.create({
      data: {
        internshipApplicationId: application.id,
        accessTokenHash: sha256(accessToken),
        gateway: "DEMO",
        gatewayOrderId: `demo_order_${Date.now()}_${paymentAccessToken().slice(0, 16)}`,
        selectedDuration: plan.duration,
        internshipProgram: program,
        amountPaise: demoPaymentAmountPaise,
        currency: plan.currency,
        status: "PENDING",
        customerName: application.candidateName,
        customerEmail: application.email,
        customerPhone: application.phone,
      },
    });
    return {
      paymentId: payment.id,
      accessToken,
      durationDays: payment.selectedDuration,
      status: payment.status,
      amount: payment.amountPaise,
      currency: payment.currency,
    };
  }

  async offerLetter(rawToken: string, download: boolean) {
    const account = await this.requireAccount(rawToken);
    const application = await this.ownedApplication(account, {});
    const payment = application.payment;
    if (!payment || payment.status !== "PAID" || !payment.invoice) throw new ForbiddenException();
    const ready = trustedConfirmationLetterData(payment, application, payment.invoice);
    const bytes = await generateInternshipConfirmationPdf(ready);
    if (download) {
      await this.recordApplicantDocumentDownload(
        account.id,
        "INTERNSHIP_LETTER",
        payment.id,
      );
    }
    return new StreamableFile(Buffer.from(bytes), {
      type: "application/pdf",
      disposition: `${download ? "attachment" : "inline"}; filename="${confirmationLetterFilename(ready)}"`,
    });
  }

  async certificateStatus(rawToken: string) {
    const dashboard = await this.dashboard(rawToken);
    return dashboard.certificate;
  }

  async completeDemoInternship(rawToken: string, body: unknown) {
    this.requireDemoGateway();
    const account = await this.requireAccount(rawToken);
    const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const application = await this.ownedApplication(account, input);
    const payment = application.payment;
    const certificate = application.certificate;
    if (
      !payment ||
      !certificate ||
      payment.status !== "PAID" ||
      (payment.paymentMethod ?? payment.gateway) !== "DEMO" ||
      payment.amountPaise !== demoPaymentAmountPaise ||
      payment.internshipApplicationId !== application.id
    ) {
      throw new NotFoundException();
    }
    const now = new Date();
    const startedAt = payment.internshipStartedAt ?? payment.joiningDate ?? payment.paidAt ?? now;
    const completedAt = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    ));
    const year = now.getUTCFullYear();
    const database = await this.database();

    await database.$transaction(async (transaction: DatabaseClient) => {
      const current = await transaction.internshipCertificate.findUniqueOrThrow({
        where: { id: certificate.id },
        include: {
          application: true,
          payment: true,
          skills: { orderBy: { position: "asc" } },
        },
      });
      if (
        current.applicationId !== application.id ||
        current.paymentId !== payment.id ||
        current.payment.status !== "PAID" ||
        (current.payment.paymentMethod ?? current.payment.gateway) !== "DEMO" ||
        current.payment.amountPaise !== demoPaymentAmountPaise
      ) {
        throw new NotFoundException();
      }
      const existingSkills = current.skills.map((skill: { name: string }) => skill.name);
      const skills: string[] = existingSkills.length ? existingSkills : demoCertificateSkills;
      let sequence = current.certificateSequence;
      let certificateYear = current.certificateYear;
      let number = current.certificateNumber;
      if (!number || !sequence || !certificateYear) {
        certificateYear = year;
        const allocated = await transaction.internshipCertificateSequence.upsert({
          where: { year: certificateYear },
          create: { year: certificateYear, lastValue: 1 },
          update: { lastValue: { increment: 1 } },
        });
        sequence = allocated.lastValue;
        number = certificateNumber(certificateYear, sequence);
      }
      if (!existingSkills.length) {
        await transaction.internshipCertificateSkill.createMany({
          data: skills.map((name: string, position: number) => ({
            certificateId: current.id,
            name,
            position,
          })),
        });
      }
      const designation = current.designation ?? current.payment.internshipProgram;
      const projectWork = current.projectWork ??
        "Completed a controlled local demo internship workflow for payment, confirmation letter, timer, and certificate verification.";
      const performanceSummary = current.performanceSummary ??
        "Demonstrated consistent participation and successful completion in the local demo verification flow.";
      const bytes = await generateInternshipCertificatePdf({
        certificateNumber: number,
        issueDate: now,
        candidateName: current.application.candidateName,
        program: current.payment.internshipProgram,
        designation,
        durationDays: current.durationDays,
        joiningDate: startedAt,
        completionDate: completedAt,
        skills,
        projectWork,
        performanceSummary,
        verificationReference: current.publicReference,
      });
      await transaction.internshipPayment.update({
        where: { id: payment.id },
        data: {
          internshipStartedAt: startedAt,
          expectedCompletionAt: completedAt,
          certificateAvailableAt: completedAt,
        },
      });
      await transaction.internshipCertificate.update({
        where: { id: current.id },
        data: {
          joiningDate: startedAt,
          completionDate: completedAt,
          reminderDueAt: completedAt,
          domainRole: current.domainRole ?? this.demoCertificateDomain(application.internshipSlug),
          designation,
          projectWork,
          performanceSummary,
          certificateNumber: number,
          certificateSequence: sequence,
          certificateYear,
          issuedAt: now,
          generatedAt: current.generatedAt ?? now,
          pdfBytes: Buffer.from(bytes),
          pdfSha256: createHash("sha256").update(bytes).digest("hex"),
          status: "GENERATED",
          emailStatus: "PENDING",
          nextEmailAttemptAt: null,
        },
      });
      await transaction.auditLog.create({
        data: {
          action: "INTERNSHIP_DEMO_COMPLETED_BY_APPLICANT",
          entityType: "internship-certificate",
          entityId: current.id,
          metadata: {
            applicationReference: application.submissionKey,
            paymentId: payment.id,
            demo: true,
          },
        },
      }).catch(() => undefined);
    }, { isolationLevel: "Serializable" });

    return {
      success: true,
      message: "Demo internship completed.",
      certificate: await this.certificateStatus(rawToken),
    };
  }

  async certificate(rawToken: string, download: boolean) {
    const account = await this.requireAccount(rawToken);
    const application = await this.ownedApplication(account, {});
    const certificate = application.certificate;
    if (!application.payment || application.payment.status !== "PAID" || !certificate) {
      throw new ForbiddenException();
    }
    const now = new Date();
    if (!application.payment.expectedCompletionAt || now < application.payment.expectedCompletionAt) {
      throw new ForbiddenException();
    }
    if (!certificate.pdfBytes || !["READY", "GENERATED", "EMAILED"].includes(certificate.status)) {
      throw new ConflictException("Certificate is not ready yet.");
    }
    if (download) {
      await this.recordApplicantDocumentDownload(
        account.id,
        "CERTIFICATE",
        certificate.id,
      );
    }
    return new StreamableFile(Buffer.from(certificate.pdfBytes), {
      type: "application/pdf",
      disposition: `${download ? "attachment" : "inline"}; filename="Growblic-Internship-Certificate-${certificate.certificateNumber ?? certificate.publicReference}.pdf"`,
    });
  }

  private async recordApplicantDocumentDownload(
    accountId: string,
    documentType: "INTERNSHIP_LETTER" | "CERTIFICATE",
    documentId: string,
  ) {
    await (await this.database()).internshipApplicantDocumentAccess.create({
      data: {
        accountId,
        documentType,
        documentId,
        actorType: "APPLICANT",
        action: "DOWNLOAD",
      },
    });
  }

  private async requireAccount(rawToken: string) {
    if (!rawToken || rawToken.length > 256) throw new UnauthorizedException();
    const now = new Date();
    const database = await this.database();
    const session = await database.internshipApplicantSession.findFirst({
      where: {
        tokenHash: hashApplicantSessionToken(rawToken),
        revokedAt: null,
        expiresAt: { gt: now },
        account: { status: "ACTIVE" },
      },
      include: { account: { include: { oauthIdentities: true } } },
    });
    if (!session) throw new UnauthorizedException();
    if (!session.lastSeenAt || now.getTime() - session.lastSeenAt.getTime() >= lastSeenUpdateMs) {
      await database.internshipApplicantSession.updateMany({
        where: { id: session.id, revokedAt: null, expiresAt: { gt: now } },
        data: { lastSeenAt: now },
      });
    }
    return session.account;
  }

  private async ownedApplication(account: DatabaseClient, query: Record<string, unknown>) {
    const application = await this.findOwnedApplication(account, query);
    if (!application) throw new NotFoundException("No internship application is linked to this account yet.");
    return application;
  }

  private async findOwnedApplication(account: DatabaseClient, query: Record<string, unknown>) {
    const reference = asNonEmptyString(query.applicationReference, 128) ??
      asNonEmptyString(query.reference, 128);
    const where = {
      OR: [
        { applicantAccountId: account.id },
        { email: { equals: account.emailNormalized, mode: "insensitive" } },
      ],
      ...(reference ? { submissionKey: safePublicId(reference) } : {}),
    };
    const application = await (await this.database()).internshipApplication.findFirst({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        payment: { include: { invoice: true } },
        certificate: { include: { skills: { orderBy: { position: "asc" } } } },
      },
    });
    return application;
  }

  private credentials(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestException("Please submit a valid request.");
    }
    const input = body as Record<string, unknown>;
    const email = typeof input.email === "string" ? input.email.trim() : "";
    const password = typeof input.password === "string" ? input.password : "";
    const emailNormalized = normalizeApplicantEmail(email);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailNormalized)) {
      throw new BadRequestException("Enter a valid email address.");
    }
    if (password.length < passwordMinLength) {
      throw new BadRequestException("Password must be at least 8 characters.");
    }
    return { emailDisplay: email, emailNormalized, password };
  }

  private async assertNotRateLimited(email: string, action: string, context: AuthContext) {
    const database = await this.database();
    const since = new Date(Date.now() - authWindowMs);
    const emailHash = this.emailHash(email);
    const ipAddressHash = this.ipHash(context.ipAddress);
    const [emailCount, ipCount] = await Promise.all([
      database.internshipApplicantAuthAttempt.count({
        where: { emailHash, action, successful: false, createdAt: { gte: since } },
      }),
      ipAddressHash
        ? database.internshipApplicantAuthAttempt.count({
            where: { ipAddressHash, action, successful: false, createdAt: { gte: since } },
          })
        : Promise.resolve(0),
    ]);
    if (emailCount >= maxFailedAttempts || ipCount >= maxFailedAttempts) {
      throw new ForbiddenException("Too many attempts. Please try again later.");
    }
  }

  private async recordAttempt(email: string, action: string, successful: boolean, context: AuthContext) {
    await (await this.database()).internshipApplicantAuthAttempt.create({
      data: {
        emailHash: this.emailHash(email),
        ipAddressHash: this.ipHash(context.ipAddress),
        action,
        successful,
      },
    });
  }

  private safeAccount(account: DatabaseClient) {
    return {
      id: account.id,
      email: account.emailDisplay,
      status: account.status,
      emailVerifiedAt: account.emailVerifiedAt,
      emailVerified: Boolean(account.emailVerifiedAt),
      lastLoginAt: account.lastLoginAt,
      createdAt: account.createdAt,
      failedLoginCount: account.failedLoginCount ?? 0,
      provider: account.oauthIdentities?.[0]?.provider ?? null,
      providers: account.oauthIdentities?.map((identity: DatabaseClient) => identity.provider) ?? [],
    };
  }

  private dashboardAccount(account: DatabaseClient) {
    return {
      email: account.emailDisplay,
      lastLoginAt: account.lastLoginAt,
      status: account.status,
      emailVerifiedAt: account.emailVerifiedAt,
      emailVerified: Boolean(account.emailVerifiedAt),
      createdAt: account.createdAt,
      failedLoginCount: account.failedLoginCount ?? 0,
      provider: account.oauthIdentities?.[0]?.provider ?? null,
      providers: account.oauthIdentities?.map((identity: DatabaseClient) => identity.provider) ?? [],
    };
  }

  private pendingFlowInput(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestException("Please submit a valid request.");
    }
    const input = body as Record<string, unknown>;
    const applicationReference = safePublicId(asNonEmptyString(input.applicationReference, 128) ?? "");
    const duration = Number(input.duration);
    const plan = trustedPlan(duration);
    if (!applicationReference || !plan) {
      throw new BadRequestException("Select a valid internship plan.");
    }
    return { applicationReference, plan };
  }

  private oauthProvider(provider: string): OAuthProvider {
    if ((oauthProviders as readonly string[]).includes(provider)) {
      return provider as OAuthProvider;
    }
    throw new NotFoundException();
  }

  private authorizationUrl(provider: OAuthProvider, state: string, codeVerifier: string) {
    if (provider === "google") {
      const clientId = this.requiredEnv("GOOGLE_CLIENT_ID");
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      url.searchParams.set("client_id", clientId);
      url.searchParams.set("redirect_uri", this.oauthCallbackUrl("google"));
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", "openid email profile");
      url.searchParams.set("state", state);
      url.searchParams.set("code_challenge", this.pkceChallenge(codeVerifier));
      url.searchParams.set("code_challenge_method", "S256");
      url.searchParams.set("access_type", "offline");
      url.searchParams.set("prompt", "select_account");
      return url.toString();
    }
    const clientId = this.requiredEnv("GITHUB_CLIENT_ID");
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", this.oauthCallbackUrl("github"));
    url.searchParams.set("scope", "read:user user:email");
    url.searchParams.set("state", state);
    return url.toString();
  }

  private async exchangeOAuthCode(provider: OAuthProvider, code: string, codeVerifier: string): Promise<ProviderIdentity> {
    return provider === "google"
      ? this.exchangeGoogleCode(code, codeVerifier)
      : this.exchangeGitHubCode(code);
  }

  private async exchangeGoogleCode(code: string, codeVerifier: string): Promise<ProviderIdentity> {
    const token = await this.fetchJson("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        client_id: this.requiredEnv("GOOGLE_CLIENT_ID"),
        client_secret: this.requiredEnv("GOOGLE_CLIENT_SECRET"),
        redirect_uri: this.oauthCallbackUrl("google"),
        grant_type: "authorization_code",
        code,
        code_verifier: codeVerifier,
      }),
    }) as Record<string, unknown>;
    const accessToken = asNonEmptyString(token.access_token, 2048);
    if (!accessToken) throw new UnauthorizedException("Google login failed.");
    const profile = await this.fetchJson("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    }) as Record<string, unknown>;
    const subject = asNonEmptyString(profile.sub, 256);
    const email = asNonEmptyString(profile.email, 320);
    if (!subject || !email) throw new UnauthorizedException("Google login did not return an email address.");
    return {
      provider: "google",
      subject,
      email,
      emailVerified: profile.email_verified === true || profile.email_verified === "true",
    };
  }

  private async exchangeGitHubCode(code: string): Promise<ProviderIdentity> {
    const token = await this.fetchJson("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "content-type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: this.requiredEnv("GITHUB_CLIENT_ID"),
        client_secret: this.requiredEnv("GITHUB_CLIENT_SECRET"),
        redirect_uri: this.oauthCallbackUrl("github"),
        code,
      }),
    }) as Record<string, unknown>;
    const accessToken = asNonEmptyString(token.access_token, 2048);
    if (!accessToken) throw new UnauthorizedException("GitHub login failed.");
    const profile = await this.fetchJson("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Growblic-Applicant-Portal",
      },
    }) as Record<string, unknown>;
    const emails = await this.fetchJson("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Growblic-Applicant-Portal",
      },
    }) as Array<Record<string, unknown>>;
    const subject = profile.id == null ? null : String(profile.id);
    const verifiedEmail = Array.isArray(emails)
      ? emails.find((item) => item.verified === true && typeof item.email === "string" && item.primary === true) ??
        emails.find((item) => item.verified === true && typeof item.email === "string")
      : null;
    const email = asNonEmptyString(verifiedEmail?.email, 320);
    if (!subject || !email) throw new UnauthorizedException("GitHub login did not return a verified email address.");
    return { provider: "github", subject, email, emailVerified: true };
  }

  private async fetchJson(url: string, init: RequestInit = {}) {
    const response = await fetch(url, init);
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      throw new UnauthorizedException("Social login could not be completed.");
    }
    return data;
  }

  private oauthCallbackUrl(provider: OAuthProvider) {
    const specific = provider === "google"
      ? process.env.GOOGLE_CALLBACK_URL
      : process.env.GITHUB_CALLBACK_URL;
    return specific ?? `${this.backendUrl()}/internship-portal/auth/oauth/${provider}/callback`;
  }

  private frontendUrl() {
    return process.env.FRONTEND_URL ?? process.env.PUBLIC_WEBSITE_URL ?? "http://localhost:3002";
  }

  private backendUrl() {
    return process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  }

  private requiredEnv(name: string) {
    const value = process.env[name]?.trim();
    if (!value) {
      throw new ServiceUnavailableException(`${name} is required for applicant social login.`);
    }
    return value;
  }

  private pkceChallenge(verifier: string) {
    return createHash("sha256").update(verifier).digest("base64url");
  }

  private emailOnly(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestException("Please submit a valid request.");
    }
    const input = body as Record<string, unknown>;
    const email = typeof input.email === "string" ? input.email.trim() : "";
    const emailNormalized = normalizeApplicantEmail(email);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailNormalized)) {
      throw new BadRequestException("Please enter a valid email address.");
    }
    return emailNormalized;
  }

  private resetCredentials(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestException("Please submit a valid request.");
    }
    const input = body as Record<string, unknown>;
    const token = typeof input.token === "string" ? input.token.trim() : "";
    const password = typeof input.password === "string" ? input.password : "";
    if (!token || token.length > 256) {
      throw new BadRequestException("This password reset link is invalid or expired.");
    }
    if (password.length < passwordMinLength) {
      throw new BadRequestException("Password must be at least 8 characters.");
    }
    return { token, password };
  }

  private tokenOnly(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestException("Please submit a valid request.");
    }
    const token = typeof (body as Record<string, unknown>).token === "string"
      ? ((body as Record<string, unknown>).token as string).trim()
      : "";
    if (!token || token.length > 256) {
      throw new BadRequestException("This verification link is invalid or expired.");
    }
    return token;
  }

  private async deliverDevelopmentToken(kind: "password-reset" | "verification", email: string, token: string) {
    if (process.env.NODE_ENV === "production") return null;
    const base = process.env.PUBLIC_WEBSITE_URL ?? "http://localhost:3002";
    const path = kind === "password-reset"
      ? `/internship-portal?resetToken=${encodeURIComponent(token)}`
      : `/internship-portal?verifyToken=${encodeURIComponent(token)}`;
    const url = `${base}${path}`;
    // Development-only token exposure for local SMTP-free testing.
    console.info(`[internship-portal:${kind}] ${email} ${url}`);
    return url;
  }

  private emailHash(email: string) {
    return hashApplicantLoginIdentifier(`internship-applicant-email:${email}`);
  }

  private ipHash(ipAddress?: string | null) {
    return ipAddress ? hashApplicantLoginIdentifier(`internship-applicant-ip:${ipAddress}`) : null;
  }

  private requireDemoGateway() {
    if (!demoPaymentGatewayEnabled()) {
      throw new NotFoundException();
    }
  }

  private demoCertificateDomain(slug: string) {
    if (slug === "backend-developer") return "Backend Development";
    if (slug === "ui-ux-design") return "UI/UX Design";
    if (slug === "digital-marketing") return "Digital Marketing";
    return "Frontend Development";
  }

  private async database() {
    this.databaseModule ??= require("@growblic/database/client") as DatabaseModule;
    return this.databaseModule.prisma;
  }
}
