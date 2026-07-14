import { ForbiddenException } from "@nestjs/common";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { StructuredLogger } from "../../common/logging/structured-logger.service";
import { sha256 } from "./internship-payment.core";
import { InternshipPaymentService } from "./internship-payment.service";

// Synthetic fixture data only. Runtime requests never use these values.
const accessToken = "synthetic_access_token";
const application = {
  id: "application_service_fixture",
  internshipSlug: "frontend-developer",
  candidateName: "Meera Fixture Applicant",
  email: "meera.fixture@growblic.test",
  phone: "+91 90000 00002",
};

function payment(status: "PENDING" | "PAID") {
  const paidAt = status === "PAID" ? new Date("2026-07-14T08:00:00.000Z") : null;
  return {
    id: "payment_service_fixture",
    internshipApplicationId: application.id,
    accessTokenHash: sha256(accessToken),
    gatewayOrderId: "order_service_fixture_01",
    gatewayPaymentId: status === "PAID" ? "pay_service_fixture_01" : null,
    selectedDuration: 30,
    internshipProgram: "Frontend Developer",
    amountPaise: 300_000,
    currency: "INR",
    status,
    customerName: application.candidateName,
    customerEmail: application.email,
    customerPhone: application.phone,
    paymentMethod: status === "PAID" ? "upi" : null,
    paidAt,
    internshipApplication: application,
    invoice: status === "PAID" ? {
      id: "invoice_service_fixture",
      invoiceNumber: "GB-INT-2026-SERVICE01",
      issuedAt: paidAt as Date,
      customerName: application.candidateName,
      customerEmail: application.email,
      customerPhone: application.phone,
      description: "Frontend Developer internship - 30 days",
      amountPaise: 300_000,
      totalPaise: 300_000,
      currency: "INR",
    } : null,
  };
}

function serviceWithDatabase(prisma: object) {
  const logger = { failure() {}, warning() {} } as unknown as StructuredLogger;
  const service = new InternshipPaymentService(logger);
  Object.defineProperty(service, "databaseModule", { value: { prisma }, writable: true });
  return service;
}

describe("internship payment service gate", () => {
  it("blocks invoice download and certificate eligibility before PAID", async () => {
    const pending = payment("PENDING");
    const service = serviceWithDatabase({
      internshipPayment: { findUnique: async () => pending },
    });
    const access = { paymentId: pending.id, accessToken };

    await assert.rejects(service.invoice(access), ForbiddenException);
    await assert.rejects(service.certificateEligibility(access), ForbiddenException);
  });

  it("returns persisted invoice identity only for a fully bound PAID record", async () => {
    const paid = payment("PAID");
    const service = serviceWithDatabase({
      internshipPayment: { findUnique: async () => paid },
    });
    const status = await service.status({ paymentId: paid.id, accessToken });
    const eligibility = await service.certificateEligibility({ paymentId: paid.id, accessToken });

    assert.equal(status.invoiceNumber, paid.invoice?.invoiceNumber);
    assert.equal(status.invoiceAvailable, true);
    assert.equal(status.certificateEligible, true);
    assert.equal(eligibility.invoiceNumber, paid.invoice?.invoiceNumber);
    assert.equal(eligibility.fullName, application.candidateName);
  });

  it("uses an idempotent invoice upsert so repeated settlement creates one invoice", async () => {
    let stored = payment("PENDING");
    let invoiceCreated = false;
    let invoiceCreateCount = 0;
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
      paymentWebhookEvent: { create: async () => undefined },
    };
    const service = serviceWithDatabase({
      $transaction: async (callback: (client: typeof transaction) => Promise<unknown>) => callback(transaction),
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
  });
});
