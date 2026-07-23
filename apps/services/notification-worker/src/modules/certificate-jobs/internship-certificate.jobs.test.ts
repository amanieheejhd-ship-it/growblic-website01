import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StructuredLogger } from "@growblic/nest-common";
import type { InternshipCertificateEmailProvider } from "@growblic/internship-shared";
import {
  certificateJobIntervalMs,
  InternshipCertificateJobs,
} from "./internship-certificate.jobs";

describe("internship certificate job claims", () => {
  it("uses a safe configurable polling interval", () => {
    // The default argument reads process.env, which task runners (nx) may seed
    // from local .env files; clear it so the default-interval branch is tested.
    const previous = process.env.INTERNSHIP_CERTIFICATE_JOB_INTERVAL_SECONDS;
    delete process.env.INTERNSHIP_CERTIFICATE_JOB_INTERVAL_SECONDS;
    try {
      assert.equal(certificateJobIntervalMs(undefined), 60 * 60 * 1000);
      assert.equal(certificateJobIntervalMs("30"), 30 * 1000);
      for (const value of ["0", "14", "1.5", "invalid"]) {
        assert.throws(() => certificateJobIntervalMs(value));
      }
    } finally {
      if (previous !== undefined) {
        process.env.INTERNSHIP_CERTIFICATE_JOB_INTERVAL_SECONDS = previous;
      }
    }
  });

  it("allows only one successful reminder across concurrent workers", async () => {
    const now = new Date("2026-08-18T00:00:00.000Z");
    const record = {
      id: "certificate_fixture",
      reminderStatus: "PENDING",
      reminderSentAt: null as Date | null,
      reminderClaimToken: null as string | null,
      reminderClaimedAt: null as Date | null,
      reminderAttemptCount: 0,
      reminderDueAt: now,
      joiningDate: new Date("2026-07-25T00:00:00.000Z"),
      completionDate: new Date("2026-08-23T00:00:00.000Z"),
      publicReference: "GB26ABCDEFGH",
      status: "PENDING_SKILLS",
      durationDays: 30,
      skills: [] as Array<{ name: string }>,
      application: {
        candidateName: "Fixture Candidate",
        email: "candidate@example.test",
        phone: "9000000000",
        submissionKey: "fixture-reference",
      },
      payment: { internshipProgram: "Frontend Developer" },
    };
    let sends = 0;
    let reminderHtml = "";
    let successfulAttempt: Record<string, unknown> | null = null;
    const successfulAttemptData = () => successfulAttempt;
    const database = {
      internshipCertificate: {
        findMany: async ({ where }: { where: {
          reminderDueAt?: { lte: Date };
        } }) =>
          where.reminderDueAt &&
          record.reminderDueAt <= where.reminderDueAt.lte &&
          !record.reminderSentAt
            ? [{ id: record.id }]
            : [],
        updateMany: async ({ data }: { data: Record<string, unknown> }) => {
          if (data.reminderStatus === "PROCESSING") {
            if (record.reminderStatus !== "PENDING" || record.reminderSentAt) return { count: 0 };
            record.reminderStatus = "PROCESSING";
            record.reminderClaimToken = String(data.reminderClaimToken);
            record.reminderClaimedAt = data.reminderClaimedAt as Date;
            record.reminderAttemptCount += 1;
            return { count: 1 };
          }
          if (data.reminderStatus === "SENT") {
            record.reminderStatus = "SENT";
            record.reminderSentAt = data.reminderSentAt as Date;
          }
          return { count: 1 };
        },
        findFirst: async ({ where }: { where: { reminderClaimToken: string } }) =>
          record.reminderClaimToken === where.reminderClaimToken ? record : null,
      },
      internshipCertificateEmailAttempt: {
        create: async ({ data }: { data: Record<string, unknown> }) => {
          successfulAttempt = data;
          return { id: "attempt" };
        },
      },
      $transaction: async (operations: Array<Promise<unknown>>) => Promise.all(operations),
    };
    const email = {
      send: async (sent: { html: string }) => {
        sends += 1;
        reminderHtml = sent.html;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return { providerId: "provider_fixture" };
      },
    } as unknown as InternshipCertificateEmailProvider;
    const logger = { failure() {} } as unknown as StructuredLogger;
    const workers = [
      new InternshipCertificateJobs(email, logger),
      new InternshipCertificateJobs(email, logger),
    ];
    for (const worker of workers) {
      Object.defineProperty(worker, "databaseModule", {
        value: { prisma: database },
        writable: true,
      });
    }
    const previousEmail = process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL;
    const previousUrl = process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL;
    process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL = "admin@example.test";
    process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL = "https://admin.example.test";
    try {
      await workers[0].runDueJobs(new Date(now.getTime() - 1));
      assert.equal(sends, 0);
      await Promise.all(workers.map((worker) => worker.runDueJobs(now)));
      assert.equal(sends, 1);
      assert.equal(record.reminderAttemptCount, 1);
      assert.equal(record.reminderStatus, "SENT");
      assert.equal(record.reminderSentAt?.toISOString(), now.toISOString());
      assert.equal(successfulAttemptData()?.providerId, "provider_fixture");
      assert.equal(successfulAttemptData()?.successful, true);
      for (const expected of [
        "Fixture Candidate",
        "candidate@example.test",
        "9000000000",
        "30 days",
        "25 July 2026",
        "23 August 2026",
        "Remaining time: 5 days",
        "Skills status: Pending",
        "Please open the Growblic Admin panel and add the candidate’s verified internship skills and completion details.",
        "https://admin.example.test/internship-certificates/?search=GB26ABCDEFGH",
      ]) {
        assert.match(reminderHtml, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      }
    } finally {
      if (previousEmail === undefined) delete process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL;
      else process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL = previousEmail;
      if (previousUrl === undefined) delete process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL;
      else process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL = previousUrl;
    }
  });

  it("records a safe FAILED reminder when the provider rejects delivery", async () => {
    const now = new Date("2026-08-18T00:00:00.000Z");
    const record = {
      id: "certificate_failed_fixture",
      reminderStatus: "PENDING",
      reminderSentAt: null as Date | null,
      reminderClaimToken: null as string | null,
      reminderClaimedAt: null as Date | null,
      reminderAttemptCount: 0,
      reminderDueAt: now,
      joiningDate: new Date("2026-07-25T00:00:00.000Z"),
      completionDate: new Date("2026-08-23T00:00:00.000Z"),
      publicReference: "GB26FAILTEST",
      status: "PENDING_SKILLS",
      durationDays: 30,
      skills: [] as Array<{ name: string }>,
      application: {
        candidateName: "Fixture Candidate",
        email: "candidate@example.test",
        phone: "9000000000",
      },
      payment: { internshipProgram: "Frontend Developer" },
      reminderLastError: null as string | null,
    };
    let failedAttempt: Record<string, unknown> | null = null;
    const failedAttemptData = () => failedAttempt;
    const database = {
      internshipCertificate: {
        findMany: async ({ where }: { where: {
          reminderDueAt?: { lte: Date };
        } }) =>
          where.reminderDueAt &&
          record.reminderDueAt <= where.reminderDueAt.lte
            ? [{ id: record.id }]
            : [],
        updateMany: async ({ data }: { data: Record<string, unknown> }) => {
          if (data.reminderStatus === "PROCESSING") {
            record.reminderStatus = "PROCESSING";
            record.reminderClaimToken = String(data.reminderClaimToken);
            record.reminderAttemptCount += 1;
          }
          if (data.reminderStatus === "FAILED") {
            record.reminderStatus = "FAILED";
            record.reminderLastError = String(data.reminderLastError);
          }
          return { count: 1 };
        },
        findFirst: async () => record,
      },
      internshipCertificateEmailAttempt: {
        create: async ({ data }: { data: Record<string, unknown> }) => {
          failedAttempt = data;
          return { id: "failed_attempt" };
        },
      },
      $transaction: async (operations: Array<Promise<unknown>>) =>
        Promise.all(operations),
    };
    const email = {
      send: async () => {
        throw new Error("Provider secret detail\nshould be sanitized");
      },
    } as unknown as InternshipCertificateEmailProvider;
    const worker = new InternshipCertificateJobs(
      email,
      { failure() {} } as unknown as StructuredLogger,
    );
    Object.defineProperty(worker, "databaseModule", {
      value: { prisma: database },
      writable: true,
    });
    const previousEmail = process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL;
    const previousUrl = process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL;
    process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL = "admin@example.test";
    process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL = "https://admin.example.test";
    try {
      await worker.runDueJobs(now);
      assert.equal(record.reminderStatus, "FAILED");
      assert.equal(
        record.reminderLastError,
        "Provider secret detail should be sanitized",
      );
      assert.equal(failedAttemptData()?.successful, false);
      assert.equal(
        failedAttemptData()?.safeError,
        "Provider secret detail should be sanitized",
      );
    } finally {
      if (previousEmail === undefined) {
        delete process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL;
      } else {
        process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL = previousEmail;
      }
      if (previousUrl === undefined) {
        delete process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL;
      } else {
        process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL = previousUrl;
      }
    }
  });

  it("sends a generated certificate once across repeated concurrent job runs", async () => {
    const now = new Date("2026-08-23T00:00:00.000Z");
    const record = {
      id: "certificate_generated_fixture",
      applicationId: "application_fixture",
      durationDays: 30,
      completionDate: now,
      joiningDate: new Date("2026-07-25T00:00:00.000Z"),
      status: "GENERATED",
      emailStatus: "PENDING",
      emailAttemptCount: 0,
      emailedAt: null as Date | null,
      emailClaimToken: null as string | null,
      emailClaimedAt: null as Date | null,
      generatedAt: now,
      certificateNumber: "GB-CERT-2026-000001",
      pdfBytes: Buffer.from("immutable certificate"),
      skills: [{ name: "TypeScript" }],
      application: {
        candidateName: "Fixture Candidate",
        email: "candidate@example.test",
      },
      payment: {
        status: "PAID",
        internshipApplicationId: "application_fixture",
        internshipProgram: "Frontend Developer",
      },
    };
    let sends = 0;
    const database = {
      internshipCertificate: {
        findMany: async ({ where }: { where: Record<string, unknown> }) =>
          "completionDate" in where && !record.emailedAt ? [{ id: record.id }] : [],
        updateMany: async ({ data }: { data: Record<string, unknown> }) => {
          if (data.emailStatus === "PROCESSING") {
            if (record.emailStatus !== "PENDING" || record.emailedAt) return { count: 0 };
            record.emailStatus = "PROCESSING";
            record.emailClaimToken = String(data.emailClaimToken);
            record.emailClaimedAt = data.emailClaimedAt as Date;
            return { count: 1 };
          }
          if ("emailAttemptCount" in data) record.emailAttemptCount += 1;
          if (data.emailStatus === "SENT") {
            record.emailStatus = "SENT";
            record.status = "EMAILED";
            record.emailedAt = data.emailedAt as Date;
          }
          return { count: 1 };
        },
        findFirst: async ({ where }: { where: { emailClaimToken: string } }) =>
          record.emailClaimToken === where.emailClaimToken ? record : null,
      },
      internshipCertificateEmailAttempt: { create: async () => ({ id: "attempt" }) },
      $transaction: async (operations: Array<Promise<unknown>>) => Promise.all(operations),
    };
    const email = {
      send: async () => {
        sends += 1;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return { providerId: "provider_fixture" };
      },
    } as unknown as InternshipCertificateEmailProvider;
    const logger = { failure() {} } as unknown as StructuredLogger;
    const workers = [
      new InternshipCertificateJobs(email, logger),
      new InternshipCertificateJobs(email, logger),
    ];
    for (const worker of workers) {
      Object.defineProperty(worker, "databaseModule", {
        value: { prisma: database },
        writable: true,
      });
    }
    await Promise.all(workers.map((worker) => worker.runDueJobs(now)));
    await workers[0].runDueJobs(now);
    assert.equal(sends, 1);
    assert.equal(record.emailAttemptCount, 1);
    assert.equal(record.status, "EMAILED");
    assert.equal(record.emailStatus, "SENT");
    assert.equal(record.emailedAt?.toISOString(), now.toISOString());
  });
});
