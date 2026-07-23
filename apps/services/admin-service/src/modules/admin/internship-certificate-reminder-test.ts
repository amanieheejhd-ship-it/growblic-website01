export type ReminderTestEnvironment = {
  NODE_ENV?: string;
  INTERNSHIP_CERTIFICATE_JOBS_ENABLED?: string;
  INTERNSHIP_CERTIFICATE_TEST_MODE?: string;
  INTERNSHIP_CERTIFICATE_TEST_REMINDER_MINUTES?: string;
};

export type ReminderTestDatabase = {
  $transaction<T>(callback: (transaction: {
    internshipCertificate: {
      findUnique(args: unknown): Promise<{
        id: string;
        completionDate: Date | null;
        reminderSentAt: Date | null;
        reminderStatus: string;
        payment: { status: string };
        emailAttempts: Array<{ id: string }>;
      } | null>;
      updateMany(args: unknown): Promise<{ count: number }>;
    };
    auditLog: {
      create(args: unknown): Promise<unknown>;
    };
  }) => Promise<T>): Promise<T>;
};

export function reminderTestMinutes(
  environment: ReminderTestEnvironment,
) {
  const value = Number(
    environment.INTERNSHIP_CERTIFICATE_TEST_REMINDER_MINUTES ?? "1",
  );
  if (!Number.isInteger(value) || value < 1 || value > 60) {
    throw new Error("CERTIFICATE_TEST_MINUTES_INVALID");
  }
  return value;
}

export function assertReminderTestEnabled(
  environment: ReminderTestEnvironment,
) {
  if (environment.NODE_ENV === "production") {
    throw new Error("CERTIFICATE_TEST_PRODUCTION_FORBIDDEN");
  }
  if (environment.INTERNSHIP_CERTIFICATE_TEST_MODE !== "true") {
    throw new Error("CERTIFICATE_TEST_MODE_DISABLED");
  }
  if (environment.INTERNSHIP_CERTIFICATE_JOBS_ENABLED !== "true") {
    throw new Error("CERTIFICATE_TEST_JOBS_DISABLED");
  }
  return reminderTestMinutes(environment);
}

export async function scheduleCertificateReminderTest(
  database: ReminderTestDatabase,
  certificateId: string,
  adminUserId: string,
  now: Date,
  environment: ReminderTestEnvironment,
) {
  const minutes = assertReminderTestEnabled(environment);
  const scheduledFor = new Date(now.getTime() + minutes * 60 * 1000);

  return database.$transaction(async (transaction) => {
    const certificate = await transaction.internshipCertificate.findUnique({
      where: { id: certificateId },
      include: {
        payment: { select: { status: true } },
        emailAttempts: {
          where: { kind: "ADMIN_REMINDER", successful: true },
          select: { id: true },
          take: 1,
        },
      },
    });
    if (!certificate) return null;
    if (certificate.payment.status !== "PAID") {
      throw new Error("CERTIFICATE_TEST_PAYMENT_REQUIRED");
    }
    if (
      !certificate.completionDate ||
      certificate.completionDate <= scheduledFor
    ) {
      throw new Error("CERTIFICATE_TEST_ACTIVE_INTERNSHIP_REQUIRED");
    }
    if (
      certificate.reminderSentAt ||
      certificate.reminderStatus === "SENT" ||
      certificate.emailAttempts.length > 0
    ) {
      throw new Error("CERTIFICATE_TEST_REMINDER_ALREADY_SENT");
    }

    const updated = await transaction.internshipCertificate.updateMany({
      where: {
        id: certificateId,
        reminderSentAt: null,
        reminderStatus: { not: "SENT" },
      },
      data: {
        reminderDueAt: scheduledFor,
        reminderStatus: "PENDING",
        reminderLastError: null,
        reminderClaimToken: null,
        reminderClaimedAt: null,
      },
    });
    if (updated.count !== 1) {
      throw new Error("CERTIFICATE_TEST_REMINDER_ALREADY_SENT");
    }

    await transaction.auditLog.create({
      data: {
        adminUserId,
        action: "INTERNSHIP_CERTIFICATE_REMINDER_TEST_SCHEDULED",
        entityType: "internship-certificate",
        entityId: certificateId,
        metadata: {
          scheduledFor: scheduledFor.toISOString(),
          minutes,
        },
      },
    });
    return { scheduledFor };
  });
}
