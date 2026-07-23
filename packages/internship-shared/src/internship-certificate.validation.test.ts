import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertCertificateReady,
  readInternshipCertificateDraft,
} from "@growblic/validation";

describe("internship certificate admin validation", () => {
  it("normalizes structured skills and rejects empty or duplicate skills", () => {
    const draft = readInternshipCertificateDraft({
      domainRole: "Frontend Development",
      skills: ["  React.js  ", "TypeScript"],
      designation: " Frontend Developer ",
    });
    assert.deepEqual(draft.skills, ["React.js", "TypeScript"]);
    assert.equal(draft.domainRole, "Frontend Development");
    assert.equal(draft.designation, "Frontend Developer");
    assert.doesNotThrow(() => assertCertificateReady(draft));
    assert.throws(() => readInternshipCertificateDraft({
      domainRole: "Frontend Development",
      skills: [""],
    }));
    assert.throws(() => readInternshipCertificateDraft({
      domainRole: "Frontend Development",
      skills: ["React.js", "react.JS"],
    }));
    assert.throws(() => readInternshipCertificateDraft({
      domainRole: "",
      skills: ["React.js"],
    }));
    assert.throws(() => assertCertificateReady(readInternshipCertificateDraft({
      domainRole: "Frontend Development",
      skills: [],
    })));
  });

  it("ignores forged ownership and payment fields", () => {
    const draft = readInternshipCertificateDraft({
      domainRole: "Backend Development",
      skills: ["Node.js"],
      candidateName: "Forged",
      paymentStatus: "PAID",
      durationDays: 180,
      publicReference: "GB26FORGED00",
    });
    assert.deepEqual(Object.keys(draft).sort(), [
      "conductNote", "designation", "domainRole", "performanceSummary",
      "projectWork", "remarks", "skills",
    ]);
  });

  it("limits custom skills independently from the selected catalog", () => {
    assert.throws(() => readInternshipCertificateDraft({
      domainRole: "Frontend Development",
      skills: Array.from({ length: 11 }, (_, index) => `Custom Skill ${index}`),
    }));
    assert.doesNotThrow(() => readInternshipCertificateDraft({
      domainRole: "Frontend Development",
      skills: ["React.js", "TypeScript", "Client CMS"],
    }));
  });
});
