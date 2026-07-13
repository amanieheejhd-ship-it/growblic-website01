import "dotenv/config";

import { prisma } from "../src/lib/prisma";
import {
  hashLoginIdentifier,
  normalizeAdminEmail,
} from "../src/server/auth/admin-auth.crypto";

const TEST_USER_AGENT = "Growblic-Admin-Auth-Integration-Test";
const RECENT_ATTEMPT_WINDOW_MS = 15 * 60 * 1_000;

class VerificationError extends Error {}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new VerificationError(message);
  }
}

async function main() {
  const testEmail = process.env.ADMIN_AUTH_TEST_EMAIL?.trim();

  if (!testEmail) {
    throw new VerificationError("ADMIN_AUTH_TEST_EMAIL is required.");
  }

  const emailHash = hashLoginIdentifier(
    `email:${normalizeAdminEmail(testEmail)}`,
  );
  const now = new Date();
  const recentSince = new Date(now.getTime() - RECENT_ATTEMPT_WINDOW_MS);

  const [
    adminUserCount,
    adminRoleCount,
    adminUserRoleCount,
    superAdminUserCount,
    activeSessionCount,
    revokedSessionCount,
    testRevokedSessionCount,
    recentFailedAttemptCount,
    recentSuccessfulAttemptCount,
    loginAuditCount,
    logoutAuditCount,
  ] = await Promise.all([
    prisma.adminUser.count(),
    prisma.adminRole.count(),
    prisma.adminUserRole.count(),
    prisma.adminUser.count({
      where: {
        roles: { some: { adminRole: { name: "SUPER_ADMIN" } } },
      },
    }),
    prisma.adminSession.count({
      where: { revokedAt: null, expiresAt: { gt: now } },
    }),
    prisma.adminSession.count({
      where: { revokedAt: { not: null } },
    }),
    prisma.adminSession.count({
      where: {
        userAgent: TEST_USER_AGENT,
        revokedAt: { not: null },
      },
    }),
    prisma.adminLoginAttempt.count({
      where: {
        emailHash,
        successful: false,
        createdAt: { gte: recentSince },
      },
    }),
    prisma.adminLoginAttempt.count({
      where: {
        emailHash,
        successful: true,
        createdAt: { gte: recentSince },
      },
    }),
    prisma.auditLog.count({
      where: {
        action: "ADMIN_LOGIN_SUCCESS",
        userAgent: TEST_USER_AGENT,
      },
    }),
    prisma.auditLog.count({
      where: {
        action: "ADMIN_LOGOUT",
        userAgent: TEST_USER_AGENT,
      },
    }),
  ]);

  assert(adminUserCount >= 1, "No administrator exists.");
  assert(adminRoleCount >= 1, "No administrator role exists.");
  assert(adminUserRoleCount >= 1, "No administrator role assignment exists.");
  assert(superAdminUserCount === 1, "Expected one SUPER_ADMIN user.");
  assert(testRevokedSessionCount >= 1, "No revoked integration-test session exists.");
  assert(recentFailedAttemptCount >= 1, "No recent failed test login attempt exists.");
  assert(recentSuccessfulAttemptCount >= 1, "No recent successful test login attempt exists.");
  assert(loginAuditCount >= 1, "No integration-test login audit event exists.");
  assert(logoutAuditCount >= 1, "No integration-test logout audit event exists.");

  console.log(`Admin users: ${adminUserCount}`);
  console.log(`Admin roles: ${adminRoleCount}`);
  console.log(`Admin user-role assignments: ${adminUserRoleCount}`);
  console.log(`SUPER_ADMIN users: ${superAdminUserCount}`);
  console.log(`Active admin sessions: ${activeSessionCount}`);
  console.log(`Revoked admin sessions: ${revokedSessionCount}`);
  console.log(`Revoked integration-test sessions: ${testRevokedSessionCount}`);
  console.log(`Recent failed test attempts: ${recentFailedAttemptCount}`);
  console.log(`Recent successful test attempts: ${recentSuccessfulAttemptCount}`);
  console.log(`Integration-test login audit events: ${loginAuditCount}`);
  console.log(`Integration-test logout audit events: ${logoutAuditCount}`);
  console.log("Admin authentication database verification passed.");
}

main()
  .catch((error) => {
    if (error instanceof VerificationError) {
      console.error("Admin authentication database verification failed:", error.message);
    } else {
      console.error("Admin authentication database verification failed.");
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
