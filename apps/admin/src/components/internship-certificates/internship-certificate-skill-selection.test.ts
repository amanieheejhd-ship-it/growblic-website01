import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { INTERNSHIP_CERTIFICATE_SKILL_CATALOG } from "@growblic/contracts";
import {
  certificateSkillsForSubmission,
  compatibleSkillsForRole,
  normalizeCustomSkill,
  partitionCertificateSkills,
} from "./internship-certificate-skill-selection";

describe("internship certificate skill selection", () => {
  it("shows only the selected domain catalog", () => {
    assert.ok(INTERNSHIP_CERTIFICATE_SKILL_CATALOG["Frontend Development"].includes("React.js"));
    assert.ok(!INTERNSHIP_CERTIFICATE_SKILL_CATALOG["Frontend Development"].includes("NestJS" as never));
    assert.ok(INTERNSHIP_CERTIFICATE_SKILL_CATALOG["Backend Development"].includes("NestJS"));
    assert.ok(!INTERNSHIP_CERTIFICATE_SKILL_CATALOG["Backend Development"].includes("React.js" as never));
  });

  it("clears incompatible catalog skills when the role changes", () => {
    assert.deepEqual(
      compatibleSkillsForRole("Backend Development", ["TypeScript", "React.js"]),
      { compatible: ["TypeScript"], incompatible: ["React.js"] },
    );
  });

  it("restores saved catalog and custom skills", () => {
    assert.deepEqual(
      partitionCertificateSkills(
        "Frontend Development",
        ["React.js", "Client-specific CMS"],
      ),
      {
        selectedSkills: ["React.js"],
        customSkills: ["Client-specific CMS"],
      },
    );
  });

  it("adds normalized custom skills and rejects duplicates", () => {
    assert.deepEqual(
      normalizeCustomSkill("  API   Documentation ", ["React.js"]),
      { skill: "API Documentation" },
    );
    assert.deepEqual(
      normalizeCustomSkill("react.JS", ["React.js"]),
      { error: "This skill has already been added." },
    );
  });

  it("persists selected and custom skills without unrelated catalog values", () => {
    assert.deepEqual(
      certificateSkillsForSubmission(
        "Frontend Development",
        ["React.js", "NestJS"],
        ["Client CMS"],
      ),
      ["React.js", "Client CMS"],
    );
  });

  it("requires a saved role and at least one skill before READY", async () => {
    const root = process.cwd().endsWith("apps/admin")
      ? resolve(process.cwd(), "../..")
      : process.cwd();
    const repository = await readFile(resolve(
      root,
      "apps/services/admin-service/src/modules/admin/admin-internship-certificates.repository.ts",
    ), "utf8");
    assert.match(repository, /isInternshipCertificateDomainRole\(current\.domainRole\)/);
    assert.match(repository, /if \(current\._count\.skills === 0\)/);
  });
});
