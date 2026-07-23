import type { AdminSafeUser } from "@growblic/contracts";
import { validateAdminLogin } from "@growblic/validation";
import {
  ADMIN_LOGIN_WINDOW_MS,
  ADMIN_MAX_FAILED_LOGIN_ATTEMPTS,
  ADMIN_PASSWORD_MIN_LENGTH,
  ADMIN_SESSION_DURATION_MS,
  ADMIN_SESSION_LAST_SEEN_UPDATE_MS,
} from "./admin-auth.constants";
import {
  generateSessionToken,
  hashLoginIdentifier,
  hashSessionToken,
  verifyPassword,
} from "./admin-auth.crypto";
import {
  countRecentFailedLoginAttempts,
  createSuccessfulLogin,
  findActiveAdminByEmail,
  findValidSessionByTokenHash,
  recordLoginAttempt,
  revokeAllUserSessionsWithAudit,
  revokeSessionWithAudit,
  updateSessionLastSeen,
} from "./admin-auth.repository";

const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$zPM/05TcoihZ66IvE3Ietg$YlMJq6EfEeyn+bKwGwLKeoA0jfz/F7eUv9oE116O+/M";

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password.";
const RATE_LIMIT_MESSAGE = "Too many login attempts. Please try again later.";

export type SafeAdminUser = AdminSafeUser;

export type SafeAdminSession = {
  sessionId: string;
  expiresAt: Date;
  user: SafeAdminUser;
};

export type LoginAdminResult =
  | {
      ok: true;
      token: string;
      expiresAt: Date;
      user: SafeAdminUser;
    }
  | {
      ok: false;
      reason: "INVALID_REQUEST" | "INVALID_CREDENTIALS" | "RATE_LIMITED";
      message: string;
    };

function uniqueRoleNames(
  roles: Array<{ adminRole: { name: string } }>,
) {
  return [...new Set(roles.map((assignment) => assignment.adminRole.name))].sort();
}

export async function loginAdmin(input: {
  email: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<LoginAdminResult> {
  const validation = validateAdminLogin(input, ADMIN_PASSWORD_MIN_LENGTH);

  if (!validation.success) {
    return {
      ok: false,
      reason: "INVALID_REQUEST",
      message: "Please submit a valid login request.",
    };
  }

  const { email } = validation.data;

  const emailHash = hashLoginIdentifier(`email:${email}`);
  const ipAddressHash = input.ipAddress
    ? hashLoginIdentifier(`ip:${input.ipAddress}`)
    : null;
  const now = new Date();
  const recentAttempts = await countRecentFailedLoginAttempts({
    emailHash,
    ipAddressHash,
    since: new Date(now.getTime() - ADMIN_LOGIN_WINDOW_MS),
  });

  if (
    recentAttempts.emailCount >= ADMIN_MAX_FAILED_LOGIN_ATTEMPTS ||
    recentAttempts.ipAddressCount >= ADMIN_MAX_FAILED_LOGIN_ATTEMPTS
  ) {
    return {
      ok: false,
      reason: "RATE_LIMITED",
      message: RATE_LIMIT_MESSAGE,
    };
  }

  const adminUser = await findActiveAdminByEmail(email);
  const passwordHash = adminUser?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const passwordMatches = await verifyPassword(passwordHash, input.password);

  if (!adminUser || !adminUser.passwordHash || !passwordMatches) {
    await recordLoginAttempt({
      emailHash,
      ipAddressHash,
      successful: false,
    });

    return {
      ok: false,
      reason: "INVALID_CREDENTIALS",
      message: INVALID_CREDENTIALS_MESSAGE,
    };
  }

  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(now.getTime() + ADMIN_SESSION_DURATION_MS);

  await createSuccessfulLogin({
    adminUserId: adminUser.id,
    tokenHash,
    expiresAt,
    emailHash,
    ipAddressHash,
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    occurredAt: now,
  });

  return {
    ok: true,
    token,
    expiresAt,
    user: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      roles: uniqueRoleNames(adminUser.roles),
    },
  };
}

export async function logoutAdmin(rawToken: string) {
  if (!rawToken || rawToken.length > 256) {
    return;
  }

  await revokeSessionWithAudit(hashSessionToken(rawToken), new Date());
}

export async function getAdminSession(
  rawToken: string,
): Promise<SafeAdminSession | null> {
  if (!rawToken || rawToken.length > 256) {
    return null;
  }

  const now = new Date();
  const session = await findValidSessionByTokenHash(
    hashSessionToken(rawToken),
    now,
  );

  if (!session) {
    return null;
  }

  if (
    !session.lastSeenAt ||
    now.getTime() - session.lastSeenAt.getTime() >=
      ADMIN_SESSION_LAST_SEEN_UPDATE_MS
  ) {
    await updateSessionLastSeen(session.id, now);
  }

  return {
    sessionId: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: session.adminUser.id,
      email: session.adminUser.email,
      name: session.adminUser.name,
      roles: uniqueRoleNames(session.adminUser.roles),
    },
  };
}

export async function revokeAllAdminSessions(
  adminUserId: string,
  actorAdminUserId: string,
) {
  return revokeAllUserSessionsWithAudit({
    adminUserId,
    actorAdminUserId,
    occurredAt: new Date(),
  });
}
