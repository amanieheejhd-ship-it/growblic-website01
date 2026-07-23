import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  assertReminderTestEnabled,
  reminderTestMinutes,
  scheduleCertificateReminderTest,
} from "./internship-certificate-reminder-test";

function testDatabase(paymentStatus = "PAID") {
  const certificate = {
    id: "certificate_fixture",
    completionDate: new Date("2026-08-30T00:00:00.000Z"),
    reminderSentAt: null,
    reminderStatus: "PENDING",
    payment: { status: paymentStatus },
    emailAttempts: [] as Array<{ id: string }>,
  };
  let updateData: Record<string, unknown> | null = null;
  let auditData: Record<string, unknown> | null = null;
  const transaction = {
    internshipCertificate: {
      findUnique: async () => certificate,
      updateMany: async ({ data }: { data: Record<string, unknown> }) => {
        updateData = data;
        return { count: 1 };
      },
    },
    auditLog: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        auditData = data;
      },
    },
  };
  return {
    database: {
      $transaction: async <T>(
        callback: (client: typeof transaction) => Promise<T>,
      ) => callback(transaction),
    },
    updateData: () => updateData,
    auditData: () => auditData,
  };
}

const enabledEnvironment = {
  NODE_ENV: "development",
  INTERNSHIP_CERTIFICATE_TEST_MODE: "true",
  INTERNSHIP_CERTIFICATE_JOBS_ENABLED: "true",
  INTERNSHIP_CERTIFICATE_TEST_REMINDER_MINUTES: "5",
};

describe("internship certificate reminder test scheduling", () => {
  it("rejects production and disabled test mode", () => {
    assert.throws(
      () => assertReminderTestEnabled({ ...enabledEnvironment, NODE_ENV: "production" }),
      /CERTIFICATE_TEST_PRODUCTION_FORBIDDEN/,
    );
    assert.throws(
      () => assertReminderTestEnabled({
        ...enabledEnvironment,
        INTERNSHIP_CERTIFICATE_TEST_MODE: "false",
      }),
      /CERTIFICATE_TEST_MODE_DISABLED/,
    );
  });

  it("validates the configured minute value", () => {
    assert.equal(reminderTestMinutes(enabledEnvironment), 5);
    for (const value of ["0", "61", "1.5", "invalid"]) {
      assert.throws(
        () => reminderTestMinutes({
          ...enabledEnvironment,
          INTERNSHIP_CERTIFICATE_TEST_REMINDER_MINUTES: value,
        }),
        /CERTIFICATE_TEST_MINUTES_INVALID/,
      );
    }
  });

  it("rejects an unpaid lifecycle", async () => {
    const fixture = testDatabase("PENDING");
    await assert.rejects(
      scheduleCertificateReminderTest(
        fixture.database,
        "certificate_fixture",
        "admin_fixture",
        new Date("2026-08-01T00:00:00.000Z"),
        enabledEnvironment,
      ),
      /CERTIFICATE_TEST_PAYMENT_REQUIRED/,
    );
  });

  it("schedules exactly five minutes from server time and writes an audit", async () => {
    const fixture = testDatabase();
    const now = new Date("2026-08-01T00:00:00.000Z");
    const result = await scheduleCertificateReminderTest(
      fixture.database,
      "certificate_fixture",
      "admin_fixture",
      now,
      enabledEnvironment,
    );
    assert.equal(
      result?.scheduledFor.toISOString(),
      "2026-08-01T00:05:00.000Z",
    );
    assert.equal(
      (fixture.updateData()?.reminderDueAt as Date).toISOString(),
      "2026-08-01T00:05:00.000Z",
    );
    assert.equal(fixture.updateData()?.reminderStatus, "PENDING");
    assert.equal(
      fixture.auditData()?.action,
      "INTERNSHIP_CERTIFICATE_REMINDER_TEST_SCHEDULED",
    );
  });

  it("keeps scheduling behind SUPER_ADMIN authorization", async () => {
    const root = process.cwd().endsWith("apps/services/admin-service")
      ? resolve(process.cwd(), "../../..")
      : process.cwd();
    const controller = await readFile(resolve(
      root,
      "apps/services/admin-service/src/modules/admin/admin-internship-certificates.controller.ts",
    ), "utf8");
    assert.ok(
      controller.indexOf("requireAdminRole(") <
      controller.indexOf("scheduleInternshipCertificateReminderTest("),
    );
    assert.match(controller, /requireAdminRole\(token, \["SUPER_ADMIN"\]\)/);
  });
});
