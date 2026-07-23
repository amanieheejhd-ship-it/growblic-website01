import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { StructuredLogger } from "@growblic/nest-common";
import { sha256 } from "@growblic/internship-shared";
import { InternshipPaymentService } from "./internship-payment.service";

const accessToken = "synthetic_access_token";

function application(id = "application_service_fixture") {
  return {
    id,
    internshipSlug: "frontend-developer",
    candidateName: "Meera Fixture Applicant",
    email: "meera.fixture@growblic.test",
    phone: "+91 90000 00002",
    state: "Delhi",
    instituteEnrollment: "Yes",
    instituteName: "Fixture Engineering College",
    course: "B.Tech Computer Science",
    enrollmentNumber: "FIXTURE-02",
    highestQualification: "Higher Secondary",
    passingYear: "2026",
    createdAt: new Date("2026-07-13T08:00:00.000Z"),
  };
}

function payment(
  status: "PENDING" | "PAID",
  id = "payment_service_fixture",
) {
  const relatedApplication = application(`application_${id}`);
  const paidAt = status === "PAID"
    ? new Date("2026-07-14T08:00:00.000Z")
    : null;
  return {
    id,
    internshipApplicationId: relatedApplication.id,
    gateway: "RAZORPAY",
    accessTokenHash: sha256(accessToken),
    gatewayOrderId: `order_${id}`,
    gatewayPaymentId: status === "PAID" ? `pay_${id}` : null,
    selectedDuration: 30,
    internshipProgram: "Frontend Developer",
    amountPaise: 300_000,
    currency: "INR",
    status,
    customerName: relatedApplication.candidateName,
    customerEmail: relatedApplication.email,
    customerPhone: relatedApplication.phone,
    paymentMethod: status === "PAID" ? "upi" : null,
    paidAt,
    confirmationReference: null as string | null,
    confirmationSequence: null as number | null,
    confirmationYear: null as number | null,
    joiningDate: null as Date | null,
    confirmationIssuedAt: null as Date | null,
    internshipStartedAt: null as Date | null,
    expectedCompletionAt: null as Date | null,
    completedAt: null as Date | null,
    offerLetterGeneratedAt: null as Date | null,
    certificateAvailableAt: null as Date | null,
    internshipApplication: relatedApplication,
    invoice: status === "PAID"
      ? {
          id: `invoice_${id}`,
          invoiceNumber: `PAYMENT-INVOICE-${id}`,
          issuedAt: paidAt as Date,
          customerName: relatedApplication.candidateName,
          customerEmail: relatedApplication.email,
          customerPhone: relatedApplication.phone,
          description: "Frontend Developer internship - 30 days",
          amountPaise: 300_000,
          totalPaise: 300_000,
          currency: "INR",
        }
      : null,
  };
}

function serviceWithDatabase(prisma: object, now?: () => Date) {
  const logger = { failure() {}, warning() {} } as unknown as StructuredLogger;
  const service = new InternshipPaymentService(logger);
  Object.defineProperty(service, "databaseModule", {
    value: { prisma },
    writable: true,
  });
  if (now) {
    Object.defineProperty(service, "serverNow", { value: now });
  }
  return service;
}

function confirmationDatabase(initial: ReturnType<typeof payment>[]) {
  let storedPayments = new Map(
    initial.map((item) => [item.id, structuredClone(item)]),
  );
  let counters = new Map<number, number>();
  let tail = Promise.resolve();

  const transaction = {
    internshipPayment: {
      findUnique: async ({ where }: { where: { id: string } }) =>
        storedPayments.get(where.id) ?? null,
      findUniqueOrThrow: async ({ where }: { where: { id: string } }) => {
        const found = storedPayments.get(where.id);
        if (!found) throw new Error("Not found");
        return found;
      },
      updateMany: async ({
        where,
        data,
      }: {
        where: Record<string, unknown> & { id: string };
        data: Record<string, unknown>;
      }) => {
        const found = storedPayments.get(where.id);
        if (!found || found.status !== where.status) return { count: 0 };
        for (const key of [
          "confirmationReference",
          "confirmationSequence",
          "confirmationYear",
          "joiningDate",
          "confirmationIssuedAt",
        ] as const) {
          if (where[key] === null && found[key] !== null) return { count: 0 };
        }
        Object.assign(found, data);
        return { count: 1 };
      },
    },
    internshipConfirmationSequence: {
      upsert: async ({ where }: { where: { year: number } }) => {
        const lastValue = (counters.get(where.year) ?? 0) + 1;
        counters.set(where.year, lastValue);
        return { year: where.year, lastValue };
      },
    },
    internshipCertificate: {
      upsert: async () => undefined,
    },
  };

  const prisma = {
    internshipPayment: {
      findUnique: async ({ where }: { where: { id: string } }) =>
        storedPayments.get(where.id) ?? null,
    },
    $transaction: async <T>(
      callback: (client: typeof transaction) => Promise<T>,
    ) => {
      const previous = tail;
      let release: () => void = () => {};
      tail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      const paymentSnapshot = structuredClone(storedPayments);
      const counterSnapshot = structuredClone(counters);
      try {
        return await callback(transaction);
      } catch (error) {
        storedPayments = paymentSnapshot;
        counters = counterSnapshot;
        throw error;
      } finally {
        release();
      }
    },
  };

  return {
    prisma,
    getPayment(id: string) {
      return storedPayments.get(id);
    },
    counter(year: number) {
      return counters.get(year) ?? 0;
    },
  };
}

async function withDemoEnvironment<T>(
  environment: string,
  enabled: string | undefined,
  run: () => Promise<T>,
  legacyEnabled?: string | undefined,
) {
  const previousEnvironment = process.env.NODE_ENV;
  const previousEnabled = process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED;
  const previousLegacyEnabled = process.env.ENABLE_DEMO_PAYMENT;
  process.env.NODE_ENV = environment;
  if (enabled === undefined) delete process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED;
  else process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED = enabled;
  if (legacyEnabled === undefined) delete process.env.ENABLE_DEMO_PAYMENT;
  else process.env.ENABLE_DEMO_PAYMENT = legacyEnabled;
  try {
    return await run();
  } finally {
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
    if (previousEnabled === undefined) delete process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED;
    else process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED = previousEnabled;
    if (previousLegacyEnabled === undefined) delete process.env.ENABLE_DEMO_PAYMENT;
    else process.env.ENABLE_DEMO_PAYMENT = previousLegacyEnabled;
  }
}

function demoCompletionDatabase() {
  let stored = {
    ...payment("PENDING", "payment_demo_fixture"),
    gateway: "DEMO",
    gatewayOrderId: "demo_order_fixture",
    amountPaise: 100,
  };
  let invoiceCreateCount = 0;
  let certificateCreateCount = 0;
  const transaction = {
    internshipPayment: {
      findUnique: async () => stored,
      update: async ({ data }: { data: Record<string, unknown> }) => {
        stored = { ...stored, ...data } as typeof stored;
        return stored;
      },
    },
    invoice: {
      upsert: async ({ create }: { create: Record<string, unknown> }) => {
        if (!stored.invoice) {
          invoiceCreateCount += 1;
          stored = {
            ...stored,
            invoice: { id: "invoice_demo_fixture", ...create },
          } as typeof stored;
        }
      },
    },
    internshipCertificate: {
      upsert: async () => {
        if (certificateCreateCount === 0) certificateCreateCount += 1;
      },
    },
    paymentWebhookEvent: { create: async () => undefined },
  };
  return {
    prisma: {
      internshipPayment: { findUnique: async () => stored },
      $transaction: async <T>(
        callback: (client: typeof transaction) => Promise<T>,
      ) => callback(transaction),
    },
    payment: () => stored,
    invoiceCreateCount: () => invoiceCreateCount,
    certificateCreateCount: () => certificateCreateCount,
  };
}

describe("internship payment service gate", () => {
  it("hides the demo gateway in production and when the flag is disabled", async () => {
    const service = serviceWithDatabase({});
    await withDemoEnvironment("production", "true", async () => {
      await assert.rejects(service.createDemoSession({}), NotFoundException);
      await assert.rejects(
        service.completeDemoPayment({ paymentId: "payment", accessToken }),
        NotFoundException,
      );
    });
    await withDemoEnvironment("test", "false", async () => {
      await assert.rejects(service.createDemoSession({}), NotFoundException);
      await assert.rejects(
        service.completeDemoPayment({ paymentId: "payment", accessToken }),
        NotFoundException,
      );
    });
  });

  it("keeps the legacy demo flag as a non-production compatibility fallback", async () => {
    const relatedApplication = application("application_demo_legacy_flag");
    const service = serviceWithDatabase({
      internshipApplication: {
        findUnique: async () => relatedApplication,
      },
      internshipPayment: {
        create: async ({ data }: { data: Record<string, unknown> }) => ({
          id: "payment_demo_legacy_flag",
          ...data,
        }),
      },
    });

    await withDemoEnvironment("test", undefined, async () => {
      const session = await service.createDemoSession({
        applicationReference: "persisted-submission-reference",
        duration: 30,
      });
      assert.equal(session.status, "PENDING");
      assert.equal(session.amount, 100);
    }, "true");
  });

  it("creates a trusted ₹1 PENDING demo session for the persisted application", async () => {
    const relatedApplication = application("application_demo_session");
    let createdData: Record<string, unknown> | null = null;
    const service = serviceWithDatabase({
      internshipApplication: {
        findUnique: async () => relatedApplication,
      },
      internshipPayment: {
        create: async ({ data }: { data: Record<string, unknown> }) => {
          createdData = data;
          return {
            id: "payment_demo_session",
            ...data,
          };
        },
      },
    });

    await withDemoEnvironment("test", "true", async () => {
      const session = await service.createDemoSession({
        applicationReference: "persisted-submission-reference",
        duration: 30,
        amount: 999_999,
        currency: "USD",
      });
      assert.equal(session.amount, 100);
      assert.equal(session.status, "PENDING");
      assert.equal(createdData?.gateway, "DEMO");
      assert.equal(createdData?.amountPaise, 100);
      assert.equal(createdData?.internshipApplicationId, relatedApplication.id);
    });
  });

  it("authenticates and idempotently completes a demo payment with one invoice", async () => {
    const database = demoCompletionDatabase();
    const service = serviceWithDatabase(database.prisma);
    let postPaymentInvocations = 0;
    Object.defineProperty(service, "deliverInvoice", {
      value: async () => { postPaymentInvocations += 1; },
    });

    await withDemoEnvironment("test", "true", async () => {
      await assert.rejects(
        service.completeDemoPayment({
          paymentId: database.payment().id,
          accessToken: "invalid-token",
        }),
        NotFoundException,
      );

      const first = await service.completeDemoPayment({
        paymentId: database.payment().id,
        accessToken,
      });
      const repeated = await service.completeDemoPayment({
        paymentId: database.payment().id,
        accessToken,
      });

      assert.deepEqual(first, {
        success: true,
        status: "SUCCESS",
        paymentStatus: "PAID",
        amount: 1,
        amountPaise: 100,
        currency: "INR",
        paymentMethod: "DEMO",
        transactionId: "DEMO_FIXTURE",
      });
      assert.deepEqual(repeated, first);
      assert.equal(database.invoiceCreateCount(), 1);
      assert.equal(database.certificateCreateCount(), 1);
      assert.equal(postPaymentInvocations, 1);
      assert.equal(database.payment().paymentMethod, "DEMO");
      assert.equal(database.payment().amountPaise, 100);
      assert.equal(database.payment().confirmationReference, "GB-INT-2026-000001");
      assert.equal(
        database.payment().offerLetterGeneratedAt?.toISOString(),
        database.payment().paidAt?.toISOString(),
      );
      const eligibility = await service.certificateEligibility({
        paymentId: database.payment().id,
        accessToken,
      });
      assert.equal(eligibility.eligible, true);
      assert.deepEqual(eligibility.confirmation, { status: "PAID" });
    });
  });

  it("returns 404 for an unknown application reference", async () => {
    const service = serviceWithDatabase({
      internshipApplication: { findUnique: async () => null },
    });
    await withDemoEnvironment("test", "true", async () => {
      await assert.rejects(
        service.createDemoSession({
          applicationReference: "unknown-reference",
          duration: 30,
        }),
        NotFoundException,
      );
    });
  });

  it("settles simultaneous demo completion requests only once", async () => {
    const database = demoCompletionDatabase();
    const service = serviceWithDatabase(database.prisma);
    Object.defineProperty(service, "deliverInvoice", {
      value: async () => undefined,
    });

    await withDemoEnvironment("test", "true", async () => {
      const request = () => service.completeDemoPayment({
        paymentId: database.payment().id,
        accessToken,
      });
      const [first, second] = await Promise.all([request(), request()]);
      assert.deepEqual(second, first);
      assert.equal(first.status, "SUCCESS");
      assert.equal(first.amount, 1);
      assert.equal(database.invoiceCreateCount(), 1);
      assert.equal(database.certificateCreateCount(), 1);
    });
  });

  it("rejects a non-demo or mismatched payment from the demo completion path", async () => {
    const realPayment = payment("PENDING", "payment_real_fixture");
    const service = serviceWithDatabase({
      internshipPayment: { findUnique: async () => realPayment },
    });
    await withDemoEnvironment("test", "true", async () => {
      await assert.rejects(
        service.completeDemoPayment({
          paymentId: realPayment.id,
          accessToken,
        }),
        NotFoundException,
      );

      const mismatched = {
        ...payment("PENDING", "payment_demo_mismatched"),
        gateway: "DEMO",
        gatewayOrderId: "demo_order_mismatched",
        amountPaise: 100,
      };
      mismatched.internshipApplication = application("wrong_application");
      const mismatchedService = serviceWithDatabase({
        internshipPayment: { findUnique: async () => mismatched },
      });
      await assert.rejects(
        mismatchedService.completeDemoPayment({
          paymentId: mismatched.id,
          accessToken,
        }),
        NotFoundException,
      );
    });
  });

  it("does not complete a FAILED or REFUNDED demo payment", async () => {
    for (const status of ["FAILED", "REFUNDED"] as const) {
      const blocked = {
        ...payment("PENDING", `payment_demo_${status.toLowerCase()}`),
        gateway: "DEMO",
        gatewayOrderId: `demo_order_${status.toLowerCase()}`,
        amountPaise: 100,
        status,
      };
      const service = serviceWithDatabase({
        internshipPayment: { findUnique: async () => blocked },
      });
      await withDemoEnvironment("test", "true", async () => {
        await assert.rejects(
          service.completeDemoPayment({
            paymentId: blocked.id,
            accessToken,
          }),
          ConflictException,
        );
      });
    }
  });

  it("blocks invoice, eligibility, and confirmation downloads before PAID", async () => {
    const pending = payment("PENDING");
    const database = confirmationDatabase([pending]);
    const service = serviceWithDatabase(database.prisma);
    const access = { paymentId: pending.id, accessToken };

    await assert.rejects(service.invoice(access), ForbiddenException);
    await assert.rejects(service.certificateEligibility(access), ForbiddenException);
    await assert.rejects(
      service.confirmationLetter(access, { joiningDate: "2026-07-25" }),
      ForbiddenException,
    );
  });

  it("returns eligibility without allocating a confirmation reference", async () => {
    const paid = payment("PAID");
    const database = confirmationDatabase([paid]);
    const service = serviceWithDatabase(database.prisma);
    const access = { paymentId: paid.id, accessToken };
    const status = await service.status(access);
    const eligibility = await service.certificateEligibility(access);

    assert.equal(status.invoiceNumber, paid.invoice?.invoiceNumber);
    assert.equal(status.invoiceAvailable, true);
    assert.equal(eligibility.invoiceNumber, paid.invoice?.invoiceNumber);
    assert.equal(eligibility.fullName, paid.customerName);
    assert.deepEqual(eligibility.confirmation, { status: "PAID" });
    assert.equal(database.getPayment(paid.id)?.confirmationReference, null);
  });

  it("rejects missing dates, invalid tokens, and wrong payment/application associations", async () => {
    const paid = payment("PAID");
    const database = confirmationDatabase([paid]);
    const service = serviceWithDatabase(database.prisma);

    await assert.rejects(
      service.confirmationLetter(
        { paymentId: paid.id, accessToken },
        {},
      ),
      BadRequestException,
    );
    await assert.rejects(
      service.confirmationLetter(
        { paymentId: paid.id, accessToken: "wrong-access-token" },
        { joiningDate: "2026-07-25" },
      ),
      NotFoundException,
    );

    const mismatched = payment("PAID", "payment_mismatched");
    mismatched.internshipApplication = application("wrong_application");
    const mismatchDatabase = confirmationDatabase([mismatched]);
    const mismatchService = serviceWithDatabase(mismatchDatabase.prisma);
    await assert.rejects(
      mismatchService.confirmationLetter(
        { paymentId: mismatched.id, accessToken },
        { joiningDate: "2026-07-25" },
      ),
      ConflictException,
    );
  });

  it("allocates sequential references per year and restarts the next year", async () => {
    const first = payment("PAID", "payment_first");
    const second = payment("PAID", "payment_second");
    const nextYear = payment("PAID", "payment_next_year");
    const database = confirmationDatabase([first, second, nextYear]);
    let now = new Date("2026-07-15T08:00:00.000Z");
    const service = serviceWithDatabase(database.prisma, () => now);

    await service.confirmationLetter(
      { paymentId: first.id, accessToken },
      { joiningDate: "2026-07-25" },
    );
    await service.confirmationLetter(
      { paymentId: second.id, accessToken },
      { joiningDate: "2026-07-26" },
    );
    now = new Date("2027-01-02T08:00:00.000Z");
    await service.confirmationLetter(
      { paymentId: nextYear.id, accessToken },
      { joiningDate: "2027-01-15" },
    );

    assert.equal(
      database.getPayment(first.id)?.confirmationReference,
      "GB-INT-2026-000001",
    );
    assert.equal(
      database.getPayment(second.id)?.confirmationReference,
      "GB-INT-2026-000002",
    );
    assert.equal(
      database.getPayment(nextYear.id)?.confirmationReference,
      "GB-INT-2027-000001",
    );
  });

  it("gives concurrent requests different references", async () => {
    const first = payment("PAID", "payment_concurrent_first");
    const second = payment("PAID", "payment_concurrent_second");
    const database = confirmationDatabase([first, second]);
    const service = serviceWithDatabase(
      database.prisma,
      () => new Date("2026-07-15T08:00:00.000Z"),
    );

    await Promise.all([
      service.confirmationLetter(
        { paymentId: first.id, accessToken },
        { joiningDate: "2026-07-25" },
      ),
      service.confirmationLetter(
        { paymentId: second.id, accessToken },
        { joiningDate: "2026-07-25" },
      ),
    ]);

    const references = new Set([
      database.getPayment(first.id)?.confirmationReference,
      database.getPayment(second.id)?.confirmationReference,
    ]);
    assert.deepEqual(
      references,
      new Set(["GB-INT-2026-000001", "GB-INT-2026-000002"]),
    );
  });

  it("reuses one reference for concurrent retries of the same download", async () => {
    const paid = payment("PAID", "payment_concurrent_retry");
    const database = confirmationDatabase([paid]);
    const service = serviceWithDatabase(
      database.prisma,
      () => new Date("2026-07-15T08:00:00.000Z"),
    );
    const access = { paymentId: paid.id, accessToken };

    const [first, second] = await Promise.all([
      service.confirmationLetter(access, { joiningDate: "2026-07-25" }),
      service.confirmationLetter(access, { joiningDate: "2026-07-25" }),
    ]);

    assert.equal(first.filename, second.filename);
    assert.equal(
      database.getPayment(paid.id)?.confirmationReference,
      "GB-INT-2026-000001",
    );
    assert.equal(database.counter(2026), 1);
  });

  it("persists once, reuses the assignment, and rejects a later date change", async () => {
    const paid = payment("PAID");
    const database = confirmationDatabase([paid]);
    const issuedAt = new Date("2026-07-15T08:00:00.000Z");
    const service = serviceWithDatabase(database.prisma, () => issuedAt);
    const access = { paymentId: paid.id, accessToken };

    const first = await service.confirmationLetter(access, {
      joiningDate: "2026-07-25",
      referenceNumber: "FORGED-REFERENCE",
      program: "Forged Program",
      durationDays: 180,
    });
    const repeated = await service.confirmationLetter(access, {
      joiningDate: "2026-07-25",
    });
    const stored = database.getPayment(paid.id);

    assert.equal(stored?.joiningDate?.toISOString(), "2026-07-25T00:00:00.000Z");
    assert.equal(stored?.confirmationIssuedAt?.toISOString(), issuedAt.toISOString());
    assert.equal(stored?.confirmationReference, "GB-INT-2026-000001");
    assert.equal(database.counter(2026), 1);
    assert.equal(first.filename, repeated.filename);
    assert.match(first.filename, /gb-int-2026-000001\.pdf$/);
    assert.ok(first.bytes.byteLength > 1_000);

    await assert.rejects(
      service.confirmationLetter(access, { joiningDate: "2026-07-26" }),
      ConflictException,
    );
    assert.equal(
      database.getPayment(paid.id)?.joiningDate?.toISOString(),
      "2026-07-25T00:00:00.000Z",
    );
    assert.equal(database.counter(2026), 1);
  });

  it("uses an idempotent invoice upsert so repeated settlement creates one invoice", async () => {
    let stored = payment("PENDING");
    let invoiceCreated = false;
    let invoiceCreateCount = 0;
    let certificateCreateCount = 0;
    const transaction = {
      internshipPayment: {
        findUnique: async () => stored,
        update: async ({ data }: { data: Record<string, unknown> }) => {
          stored = { ...stored, ...data } as ReturnType<typeof payment>;
          return stored;
        },
      },
      invoice: {
        upsert: async () => {
          if (!invoiceCreated) {
            invoiceCreated = true;
            invoiceCreateCount += 1;
          }
        },
      },
      internshipCertificate: {
        upsert: async () => {
          if (certificateCreateCount === 0) certificateCreateCount += 1;
        },
      },
      paymentWebhookEvent: { create: async () => undefined },
    };
    const service = serviceWithDatabase({
      $transaction: async (
        callback: (client: typeof transaction) => Promise<unknown>,
      ) => callback(transaction),
    });
    const settle = (service as unknown as {
      settlePaid(id: string, gateway: object): Promise<unknown>;
    }).settlePaid.bind(service);
    const gateway = {
      id: "pay_service_fixture_01",
      orderId: stored.gatewayOrderId,
      amount: stored.amountPaise,
      currency: stored.currency,
      status: "captured",
      method: "upi",
    };

    await settle(stored.id, gateway);
    await settle(stored.id, gateway);
    assert.equal(invoiceCreateCount, 1);
    assert.equal(certificateCreateCount, 1);
  });

  it("retries a public-reference collision without accepting client reference data", async () => {
    let stored = payment("PENDING");
    let transactionAttempts = 0;
    const attemptedReferences: string[] = [];
    const transaction = {
      internshipPayment: {
        findUnique: async () => stored,
        update: async ({ data }: { data: Record<string, unknown> }) => {
          stored = { ...stored, ...data } as ReturnType<typeof payment>;
          return stored;
        },
      },
      invoice: { upsert: async () => undefined },
      internshipCertificate: {
        upsert: async ({ create }: { create: Record<string, unknown> }) => {
          attemptedReferences.push(String(create.publicReference));
          if (transactionAttempts === 1) {
            throw Object.assign(new Error("Unique conflict"), { code: "P2002" });
          }
        },
      },
      paymentWebhookEvent: { create: async () => undefined },
    };
    const service = serviceWithDatabase({
      internshipCertificate: {
        findUnique: async () => null,
      },
      $transaction: async (
        callback: (client: typeof transaction) => Promise<unknown>,
      ) => {
        transactionAttempts += 1;
        return callback(transaction);
      },
    });
    const settle = (service as unknown as {
      settlePaid(id: string, gateway: object): Promise<unknown>;
    }).settlePaid.bind(service);

    await settle(stored.id, {
      id: "pay_reference_retry_fixture",
      orderId: stored.gatewayOrderId,
      amount: stored.amountPaise,
      currency: stored.currency,
      status: "captured",
      method: "upi",
      publicReference: "GB26FORGED00",
    });

    assert.equal(transactionAttempts, 2);
    assert.equal(attemptedReferences.length, 2);
    attemptedReferences.forEach((reference) => {
      assert.match(reference, /^GB[0-9]{2}[A-Z0-9]{8}$/);
      assert.notEqual(reference, "GB26FORGED00");
    });
  });
});
