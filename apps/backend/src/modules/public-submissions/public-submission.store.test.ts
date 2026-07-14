import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { preparePublicSubmission, type PreparedPublicSubmission } from "./public-submission.core";
import { persistPublicSubmission } from "./public-submission.store";

function recordingModel() {
  const records = new Map<string, Record<string, unknown>>();
  const calls: Array<Record<string, unknown>> = [];
  return {
    records,
    calls,
    async upsert(args: {
      where: Record<string, unknown>;
      create: Record<string, unknown>;
    }) {
      calls.push(args as unknown as Record<string, unknown>);
      const key = JSON.stringify(args.where);
      if (!records.has(key)) records.set(key, args.create);
      return { id: key };
    },
  };
}

async function prepared(kind: "contact" | "project-request" | "price-calculator") {
  const bodies = {
    contact: {
      submissionKey: "contact-idempotent-001",
      name: "Synthetic Contact",
      email: "contact@example.com",
      message: "Synthetic contact request",
    },
    "project-request": {
      submissionKey: "project-idempotent-001",
      name: "Synthetic Project",
      requirements: "Synthetic project request",
      source: "start-project-page",
    },
    "price-calculator": {
      submissionKey: "calculator-idempotent-001",
      name: "Synthetic Calculator",
      requirements: "Synthetic calculator request",
      calculatorData: { category: "Synthetic" },
      source: "client-controlled",
    },
  } as const;
  const result = await preparePublicSubmission(kind, bodies[kind]);
  assert.equal(result.honeypot, false);
  return (result as { honeypot: false; submission: PreparedPublicSubmission }).submission;
}

describe("Prisma public submission persistence", () => {
  it("uses stable upsert keys so duplicate contact and project submissions stay idempotent", async () => {
    const database = {
      contactEnquiry: recordingModel(),
      quoteRequest: recordingModel(),
    };
    const contact = await prepared("contact");
    const project = await prepared("project-request");

    await persistPublicSubmission(database, contact);
    await persistPublicSubmission(database, contact);
    await persistPublicSubmission(database, project);
    await persistPublicSubmission(database, project);

    assert.equal(database.contactEnquiry.records.size, 1);
    assert.equal(database.quoteRequest.records.size, 1);
    assert.deepEqual(
      (database.contactEnquiry.calls[0].where as Record<string, unknown>),
      { id: "contact_contact-idempotent-001" },
    );
    assert.deepEqual(
      (database.quoteRequest.calls[0].where as Record<string, unknown>),
      { submissionKey: "project-idempotent-001" },
    );
  });

  it("persists calculator records with the existing admin classification", async () => {
    const database = { quoteRequest: recordingModel() };
    await persistPublicSubmission(database, await prepared("price-calculator"));
    const create = database.quoteRequest.calls[0].create as Record<string, unknown>;

    assert.equal(create.source, "price-calculator");
    assert.deepEqual(create.calculatorData, { category: "Synthetic" });
  });
});
