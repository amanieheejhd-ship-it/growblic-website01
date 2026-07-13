import "dotenv/config";

import { prisma } from "@growblic/database/client";

const RETENTION_DAYS = 30;

function isApplyMode() {
  const argumentsAfterScript = process.argv.slice(2);

  if (argumentsAfterScript.some((argument) => argument !== "--apply")) {
    throw new Error("Only the --apply flag is supported.");
  }

  return argumentsAfterScript.includes("--apply");
}

async function main() {
  const apply = isApplyMode();
  const cutoff = new Date(
    Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1_000,
  );
  const where = {
    expiresAt: { lt: cutoff },
  };
  const count = await prisma.adminSession.count({ where });

  if (!apply) {
    console.log(`Expired admin sessions eligible for cleanup: ${count}`);
    console.log("Cleanup dry run: no changes applied.");
    return;
  }

  const result = await prisma.adminSession.deleteMany({ where });
  console.log(`Expired admin sessions deleted: ${result.count}`);
}

main()
  .catch(() => {
    console.error("Admin session cleanup failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
