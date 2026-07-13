import "server-only";

import { prisma } from "@growblic/database";

const safeAdminUserSelect = {
  id: true,
  email: true,
  name: true,
  passwordHash: true,
  status: true,
  deletedAt: true,
  roles: {
    select: {
      adminRole: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

export async function findActiveAdminByEmail(email: string) {
  return prisma.adminUser.findFirst({
    where: {
      email,
      status: "ACTIVE",
      deletedAt: null,
    },
    select: safeAdminUserSelect,
  });
}

export async function loadAdminRoles(adminUserId: string) {
  const assignments = await prisma.adminUserRole.findMany({
    where: { adminUserId },
    select: {
      adminRole: {
        select: { name: true },
      },
    },
    orderBy: {
      adminRole: { name: "asc" },
    },
  });

  return assignments.map((assignment) => assignment.adminRole.name);
}

export async function countRecentFailedLoginAttempts(input: {
  emailHash: string;
  ipAddressHash: string | null;
  since: Date;
}) {
  const [emailCount, ipAddressCount] = await Promise.all([
    prisma.adminLoginAttempt.count({
      where: {
        emailHash: input.emailHash,
        successful: false,
        createdAt: { gte: input.since },
      },
    }),
    input.ipAddressHash
      ? prisma.adminLoginAttempt.count({
          where: {
            ipAddressHash: input.ipAddressHash,
            successful: false,
            createdAt: { gte: input.since },
          },
        })
      : Promise.resolve(0),
  ]);

  return { emailCount, ipAddressCount };
}

export async function recordLoginAttempt(input: {
  emailHash: string;
  ipAddressHash: string | null;
  successful: boolean;
}) {
  await prisma.adminLoginAttempt.create({
    data: input,
    select: { id: true },
  });
}

export async function createSuccessfulLogin(input: {
  adminUserId: string;
  tokenHash: string;
  expiresAt: Date;
  emailHash: string;
  ipAddressHash: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  occurredAt: Date;
}) {
  const [session] = await prisma.$transaction([
    prisma.adminSession.create({
      data: {
        adminUserId: input.adminUserId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        lastSeenAt: input.occurredAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
      select: {
        id: true,
        expiresAt: true,
      },
    }),
    prisma.adminLoginAttempt.create({
      data: {
        emailHash: input.emailHash,
        ipAddressHash: input.ipAddressHash,
        successful: true,
      },
      select: { id: true },
    }),
    prisma.adminUser.update({
      where: { id: input.adminUserId },
      data: { lastLoginAt: input.occurredAt },
      select: { id: true },
    }),
    prisma.auditLog.create({
      data: {
        adminUserId: input.adminUserId,
        action: "ADMIN_LOGIN_SUCCESS",
        entityType: "AdminSession",
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
      select: { id: true },
    }),
  ]);

  return session;
}

export async function findValidSessionByTokenHash(
  tokenHash: string,
  now: Date,
) {
  return prisma.adminSession.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: now },
      adminUser: {
        status: "ACTIVE",
        deletedAt: null,
      },
    },
    select: {
      id: true,
      expiresAt: true,
      lastSeenAt: true,
      adminUser: {
        select: {
          id: true,
          email: true,
          name: true,
          roles: {
            select: {
              adminRole: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function updateSessionLastSeen(
  sessionId: string,
  seenAt: Date,
) {
  await prisma.adminSession.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
      expiresAt: { gt: seenAt },
    },
    data: { lastSeenAt: seenAt },
  });
}

export async function revokeSessionWithAudit(
  tokenHash: string,
  occurredAt: Date,
) {
  return prisma.$transaction(async (transaction) => {
    const session = await transaction.adminSession.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
      },
      select: {
        id: true,
        adminUserId: true,
        ipAddress: true,
        userAgent: true,
      },
    });

    if (!session) {
      return null;
    }

    await transaction.adminSession.update({
      where: { id: session.id },
      data: { revokedAt: occurredAt },
      select: { id: true },
    });

    await transaction.auditLog.create({
      data: {
        adminUserId: session.adminUserId,
        action: "ADMIN_LOGOUT",
        entityType: "AdminSession",
        entityId: session.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      },
      select: { id: true },
    });

    return { sessionId: session.id, adminUserId: session.adminUserId };
  });
}

export async function revokeAllUserSessionsWithAudit(input: {
  adminUserId: string;
  actorAdminUserId: string;
  occurredAt: Date;
}) {
  return prisma.$transaction(async (transaction) => {
    const result = await transaction.adminSession.updateMany({
      where: {
        adminUserId: input.adminUserId,
        revokedAt: null,
        expiresAt: { gt: input.occurredAt },
      },
      data: { revokedAt: input.occurredAt },
    });

    await transaction.auditLog.create({
      data: {
        adminUserId: input.actorAdminUserId,
        action: "ADMIN_SESSIONS_REVOKED",
        entityType: "AdminUser",
        entityId: input.adminUserId,
        metadata: { revokedSessionCount: result.count },
      },
      select: { id: true },
    });

    return result.count;
  });
}
