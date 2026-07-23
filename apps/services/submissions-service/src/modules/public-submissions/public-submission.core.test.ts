import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  preparePublicSubmission,
  PublicSubmissionValidationError,
  type PublicSubmissionKind,
} from "./public-submission.core";

const validBodies: Record<PublicSubmissionKind, Record<string, unknown>> = {
  contact: {
    submissionKey: "contact-test-001",
    name: "Synthetic Contact",
    email: "contact@example.com",
    message: "Synthetic contact request",
  },
  "project-request": {
    submissionKey: "project-test-001",
    name: "Synthetic Project",
    requirements: "Synthetic project request",
    source: "start-project-page",
  },
  "price-calculator": {
    submissionKey: "calculator-test-001",
    name: "Synthetic Calculator",
    requirements: "Synthetic calculator request",
    calculatorData: { category: "Synthetic" },
    source: "untrusted-source",
  },
  meetup: {
    submissionKey: "meetup-test-001",
    name: "Synthetic Meetup",
    message: "Synthetic meetup request",
    source: "meetup-page",
  },
  "career-application": {
    submissionKey: "career-test-001",
    fullName: "Synthetic Candidate",
    email: "career@example.com",
    phone: "9000000000",
    role: "Frontend Developer",
    experience: "1-3 years",
    workLinks: ["https://example.com/portfolio"],
    message: "Synthetic career application",
  },
  "internship-application": {
    submissionKey: "internship-test-001",
    internshipSlug: "frontend-developer",
    fullName: "Synthetic Intern",
    email: "intern@example.com",
    phone: "9000000000",
    state: "Delhi",
    instituteEnrollment: "Yes",
    instituteName: "Synthetic Institute",
    course: "BCA",
    enrollmentNumber: "SYNTHETIC-001",
    message: "Synthetic internship application",
  },
};

describe("public submission preparation", () => {
  it("accepts all six public submission types with the shared validators", async () => {
    for (const [kind, body] of Object.entries(validBodies)) {
      const prepared = await preparePublicSubmission(kind as PublicSubmissionKind, body);
      assert.equal(prepared.honeypot, false, kind);
      if (!prepared.honeypot) assert.equal(prepared.submission.kind, kind);
    }
  });

  it("returns generic success preparation for a filled honeypot without validating PII", async () => {
    assert.deepEqual(
      await preparePublicSubmission("contact", { website: "bot-filled" }),
      { honeypot: true },
    );
  });

  it("preserves contact field validation errors", async () => {
    await assert.rejects(
      preparePublicSubmission("contact", {
        submissionKey: "contact-test-002",
        name: "A",
        email: "invalid",
        message: "short",
      }),
      (error) => error instanceof PublicSubmissionValidationError &&
        Boolean(error.fieldErrors?.email),
    );
  });

  it("keeps project and calculator admin classification server-controlled", async () => {
    const project = await preparePublicSubmission("project-request", validBodies["project-request"]);
    const calculator = await preparePublicSubmission("price-calculator", validBodies["price-calculator"]);

    assert.equal(project.honeypot, false);
    assert.equal(calculator.honeypot, false);
    if (!project.honeypot && project.submission.kind === "project-request") {
      assert.equal(project.submission.data.calculatorData, null);
      assert.equal(project.submission.data.source, "start-project-page");
    }
    if (!calculator.honeypot && calculator.submission.kind === "price-calculator") {
      assert.deepEqual(calculator.submission.data.calculatorData, { category: "Synthetic" });
      assert.equal(calculator.submission.data.source, "price-calculator");
    }
  });

  it("rejects calculator data on the project endpoint and requires it on the calculator endpoint", async () => {
    await assert.rejects(
      preparePublicSubmission("project-request", validBodies["price-calculator"]),
      PublicSubmissionValidationError,
    );
    await assert.rejects(
      preparePublicSubmission("price-calculator", validBodies["project-request"]),
      PublicSubmissionValidationError,
    );
  });
});
