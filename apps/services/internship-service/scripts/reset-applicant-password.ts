import {
  hashApplicantPassword,
  normalizeApplicantEmail,
} from "../src/modules/internship-portal/internship-portal.crypto";

type Arguments = {
  email: string;
  password: string;
};

let disconnectDatabase: (() => Promise<void>) | null = null;

function readArguments(argv: string[]): Arguments {
  const values = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--") continue;
    if (!current.startsWith("--")) continue;

    const inlineValueIndex = current.indexOf("=");
    if (inlineValueIndex > 2) {
      values.set(current.slice(2, inlineValueIndex), current.slice(inlineValueIndex + 1));
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`Missing value for ${current}.`);
    }
    values.set(current.slice(2), next);
    index += 1;
  }

  const email = values.get("email")?.trim();
  const password = values.get("password");

  if (!email) throw new Error("Usage: pnpm --filter @growblic/internship-service applicant:password:reset -- --email user@example.com --password <new-password>");
  if (!password) throw new Error("The --password argument is required.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  return { email, password };
}

async function main() {
  process.loadEnvFile(new URL("../.env", import.meta.url));
  const { prisma } = await import("@growblic/database/client");
  disconnectDatabase = () => prisma.$disconnect();
  const input = readArguments(process.argv.slice(2));
  const emailNormalized = normalizeApplicantEmail(input.email);

  const existing = await prisma.internshipApplicantAccount.findUnique({
    where: { emailNormalized },
    select: { id: true, emailNormalized: true },
  });

  if (!existing) {
    throw new Error(`No applicant account exists for ${emailNormalized}.`);
  }

  const passwordHash = await hashApplicantPassword(input.password);
  const now = new Date();

  const result = await prisma.$transaction(async (transaction) => {
    const account = await transaction.internshipApplicantAccount.update({
      where: { emailNormalized },
      data: {
        passwordHash,
        status: "ACTIVE",
        failedLoginCount: 0,
      },
      select: {
        id: true,
        emailNormalized: true,
        status: true,
        failedLoginCount: true,
      },
    });

    const revokedSessions = await transaction.internshipApplicantSession.updateMany({
      where: {
        accountId: account.id,
        revokedAt: null,
      },
      data: { revokedAt: now },
    });

    await transaction.auditLog.create({
      data: {
        action: "INTERNSHIP_APPLICANT_PASSWORD_RESET_BY_SCRIPT",
        entityType: "InternshipApplicantAccount",
        entityId: account.id,
        metadata: {
          emailNormalized: account.emailNormalized,
          revokedSessionCount: revokedSessions.count,
          script: "apps/services/internship-service/scripts/reset-applicant-password.ts",
        },
      },
    });

    return { account, revokedSessionCount: revokedSessions.count };
  });

  console.log(
    JSON.stringify({
      success: true,
      accountId: result.account.id,
      emailNormalized: result.account.emailNormalized,
      status: result.account.status,
      failedLoginCount: result.account.failedLoginCount,
      revokedSessionCount: result.revokedSessionCount,
      message: "Applicant password reset safely. Password and hash were not printed.",
    }),
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Applicant password reset failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase?.();
  });
