import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd().endsWith("apps/services/internship-service")
  ? resolve(process.cwd(), "../../..")
  : process.cwd();

describe("internship certificate admin public reference", () => {
  it("keeps the public reference searchable and off the list table", async () => {
    const page = await readFile(resolve(
      root,
      "apps/admin/src/app/internship-certificates/page.tsx",
    ), "utf8");
    const repository = await readFile(resolve(
      root,
      "apps/services/admin-service/src/modules/admin/admin-internship-certificates.repository.ts",
    ), "utf8");
    const jobs = await readFile(resolve(
      root,
      "apps/services/notification-worker/src/modules/certificate-jobs/internship-certificate.jobs.ts",
    ), "utf8");
    const preview = await readFile(resolve(
      root,
      "apps/services/internship-service/src/modules/internship-payments/internship-certificate.internal.service.ts",
    ), "utf8");

    assert.doesNotMatch(page, /\{item\.applicationReference\}/);
    assert.doesNotMatch(page, /submissionKey/);
    assert.match(repository, /applicationReference: row\.publicReference/);
    assert.match(repository, /publicReference: \{ contains: query\.search/);
    assert.match(jobs, /verificationReference: current\.publicReference/);
    assert.match(preview, /verificationReference: certificate\.publicReference/);
  });
});
