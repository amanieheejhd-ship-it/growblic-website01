import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd().endsWith("apps/services/internship-service")
  ? resolve(process.cwd(), "../../..")
  : process.cwd();

describe("internship certificate persistence", () => {
  it("enforces lifecycle idempotency and transaction-safe numbering", async () => {
    const schema = await readFile(resolve(root, "packages/database/prisma/schema.prisma"), "utf8");
    const migration = await readFile(resolve(
      root,
      "packages/database/prisma/migrations/20260716123000_add_internship_certificate_lifecycle/migration.sql",
    ), "utf8");
    const publicReferenceMigration = await readFile(resolve(
      root,
      "packages/database/prisma/migrations/20260716183000_add_internship_certificate_public_reference/migration.sql",
    ), "utf8");
    const domainRoleMigration = await readFile(resolve(
      root,
      "packages/database/prisma/migrations/20260716203000_add_certificate_domain_role/migration.sql",
    ), "utf8");
    const publicReferenceRepairMigration = await readFile(resolve(
      root,
      "packages/database/prisma/migrations/20260716220000_repair_internship_certificate_public_reference/migration.sql",
    ), "utf8");
    assert.match(schema, /applicationId\s+String\s+@unique/);
    assert.match(schema, /paymentId\s+String\s+@unique/);
    assert.match(schema, /publicReference\s+String\s+@unique/);
    assert.match(schema, /certificateNumber\s+String\?\s+@unique/);
    assert.match(schema, /@@unique\(\[certificateYear, certificateSequence\]\)/);
    assert.match(migration, /ON CONFLICT \("payment_id"\) DO NOTHING/);
    assert.match(migration, /internship_certificates_dates_complete_check/);
    assert.match(migration, /internship_certificate_email_attempts_idempotency_key_key/);
    assert.match(publicReferenceMigration, /ADD COLUMN "public_reference" TEXT/);
    assert.match(publicReferenceMigration, /row_number\(\) OVER/);
    assert.match(publicReferenceMigration, /ALTER COLUMN "public_reference" SET NOT NULL/);
    assert.match(publicReferenceMigration, /\^GB\[0-9\]\{2\}\[A-Z0-9\]\{8\}\$/);
    assert.match(publicReferenceMigration, /CREATE UNIQUE INDEX "internship_certificates_public_reference_key"/);
    assert.match(publicReferenceRepairMigration, /ADD COLUMN IF NOT EXISTS "public_reference" TEXT/);
    assert.match(publicReferenceRepairMigration, /gen_random_bytes\(16\)/);
    assert.match(publicReferenceRepairMigration, /WHEN unique_violation THEN/);
    assert.match(publicReferenceRepairMigration, /ALTER COLUMN "public_reference" SET NOT NULL/);
    assert.match(publicReferenceRepairMigration, /CREATE UNIQUE INDEX IF NOT EXISTS "internship_certificates_public_reference_key"/);
    assert.match(publicReferenceRepairMigration, /CREATE TRIGGER "internship_certificates_assign_public_reference"/);
    assert.match(schema, /domainRole\s+String\?\s+@map\("domain_role"\)/);
    assert.match(domainRoleMigration, /ADD COLUMN "domain_role" TEXT/);
    assert.match(domainRoleMigration, /CHECK \("position" BETWEEN 0 AND 24\)/);
  });
});
