import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PDFDocument } from "pdf-lib";
import {
  CERTIFICATE_A4_LANDSCAPE,
  generateInternshipCertificatePdf,
} from "./internship-certificate.pdf";

describe("internship certificate PDF", () => {
  it("renders exactly one A4 page from trusted certificate data", async () => {
    const bytes = await generateInternshipCertificatePdf({
      certificateNumber: "GB-CERT-2026-000001",
      issueDate: new Date("2026-08-23T00:00:00.000Z"),
      candidateName: "Aarav Fixture Applicant",
      program: "Frontend Developer",
      designation: "Frontend Developer",
      durationDays: 30,
      joiningDate: new Date("2026-07-25T00:00:00.000Z"),
      completionDate: new Date("2026-08-23T00:00:00.000Z"),
      skills: ["React", "TypeScript", "Responsive UI"],
      projectWork: "Built a production-ready internship project.",
      performanceSummary: "Demonstrated consistent delivery and teamwork.",
      verificationReference: "fixture-application-reference",
    });
    const document = await PDFDocument.load(bytes);
    const page = document.getPage(0);
    assert.equal(document.getPageCount(), 1);
    assert.ok(Math.abs(page.getWidth() - CERTIFICATE_A4_LANDSCAPE[0]) < 0.01);
    assert.ok(Math.abs(page.getHeight() - CERTIFICATE_A4_LANDSCAPE[1]) < 0.01);
    assert.ok(bytes.byteLength > 5_000);
  });
});
