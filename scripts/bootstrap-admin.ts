import "dotenv/config";

import { prisma } from "../apps/web/src/lib/prisma";
import { ADMIN_PASSWORD_MIN_LENGTH } from "../apps/admin/src/server/auth/admin-auth.constants";
import {
  hashPassword,
  normalizeAdminEmail,
} from "../apps/admin/src/server/auth/admin-auth.crypto";

const SUPER_ADMIN_ROLE = "SUPER_ADMIN";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class BootstrapInputError extends Error {}

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new BootstrapInputError(`${name} is required.`);
  }

  return value;
}

function readBootstrapInput() {
  const email = normalizeAdminEmail(
    requiredEnvironmentValue("ADMIN_BOOTSTRAP_EMAIL"),
  );
  const name = requiredEnvironmentValue("ADMIN_BOOTSTRAP_NAME");
  const password = requiredEnvironmentValue("ADMIN_BOOTSTRAP_PASSWORD");

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    throw new BootstrapInputError("ADMIN_BOOTSTRAP_EMAIL is invalid.");
  }

  if (name.length > 120) {
    throw new BootstrapInputError("ADMIN_BOOTSTRAP_NAME is too long.");
  }

  if (
    password.length < ADMIN_PASSWORD_MIN_LENGTH ||
    password.length > 1_024
  ) {
    throw new BootstrapInputError(
      `ADMIN_BOOTSTRAP_PASSWORD must be between ${ADMIN_PASSWORD_MIN_LENGTH} and 1024 characters.`,
    );
  }

  return { email, name, password };
}

function isApplyMode() {
  const argumentsAfterScript = process.argv.slice(2);

  if (argumentsAfterScript.some((argument) => argument !== "--apply")) {
    throw new BootstrapInputError("Only the --apply flag is supported.");
  }

  return argumentsAfterScript.includes("--apply");
}

async function dryRun(input: { email: string }) {
  const existingUser = await prisma.adminUser.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  console.log("Bootstrap dry run: no changes applied.");
  console.log(`Admin user ID: ${existingUser?.id ?? "new-on-apply"}`);
  console.log(`Admin email: ${input.email}`);
  console.log(`Admin role: ${SUPER_ADMIN_ROLE}`);
}

async function applyBootstrap(input: {
  email: string;
  name: string;
  password: string;
}) {
  const passwordHash = await hashPassword(input.password);

  const result = await prisma.$transaction(async (transaction) => {
    const adminUser = await transaction.adminUser.upsert({
      where: { email: input.email },
      create: {
        email: input.email,
        name: input.name,
        passwordHash,
        status: "ACTIVE",
      },
      update: {
        name: input.name,
        passwordHash,
        status: "ACTIVE",
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const adminRole = await transaction.adminRole.upsert({
      where: { name: SUPER_ADMIN_ROLE },
      create: {
        name: SUPER_ADMIN_ROLE,
        description: "Full administrative access.",
      },
      update: {},
      select: { id: true, name: true },
    });

    await transaction.adminUserRole.upsert({
      where: {
        adminUserId_adminRoleId: {
          adminUserId: adminUser.id,
          adminRoleId: adminRole.id,
        },
      },
      create: {
        adminUserId: adminUser.id,
        adminRoleId: adminRole.id,
      },
      update: {},
      select: { id: true },
    });

    await transaction.auditLog.create({
      data: {
        adminUserId: adminUser.id,
        action: "ADMIN_BOOTSTRAP",
        entityType: "AdminUser",
        entityId: adminUser.id,
        metadata: { role: adminRole.name },
      },
      select: { id: true },
    });

    return { adminUser, role: adminRole.name };
  });

  console.log(`Admin user ID: ${result.adminUser.id}`);
  console.log(`Admin email: ${result.adminUser.email}`);
  console.log(`Admin role: ${result.role}`);
}

async function main() {
  const apply = isApplyMode();
  const input = readBootstrapInput();

  if (!apply) {
    await dryRun(input);
    return;
  }

  await applyBootstrap(input);
}

main()
  .catch((error) => {
    if (error instanceof BootstrapInputError) {
      console.error(error.message);
    } else {
      console.error("Administrator bootstrap failed.");
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
