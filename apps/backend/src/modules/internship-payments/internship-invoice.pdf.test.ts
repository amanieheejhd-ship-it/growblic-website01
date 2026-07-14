import { PDFDocument } from "pdf-lib";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { inflateSync } from "node:zlib";

import {
  InvoiceStateError,
  trustedInvoicePdfData,
  trustedPaidPaymentSource,
} from "./internship-invoice.binding";
import { generateInternshipInvoicePdf } from "./internship-invoice.pdf";

// Synthetic fixture data only. These values never enter the runtime payment flow.
const syntheticApplication = {
  id: "application_fixture_01",
  internshipSlug: "backend-developer",
  candidateName: "Aarav Fixture Applicant",
  email: "aarav.fixture@growblic.test",
  phone: "+91 90000 00001",
};

const syntheticPayment = {
  internshipApplicationId: syntheticApplication.id,
  status: "PAID",
  selectedDuration: 60,
  internshipProgram: "Backend Developer",
  amountPaise: 500_000,
  currency: "INR",
  customerName: syntheticApplication.candidateName,
  customerEmail: syntheticApplication.email,
  customerPhone: syntheticApplication.phone,
  paidAt: new Date("2026-07-14T07:18:42.000Z"),
  gatewayOrderId: "order_fixture_Q7Yp3J9wK2LmN8",
  gatewayPaymentId: "pay_fixture_Q7Z4d6HxV1AbC9",
  paymentMethod: "upi",
};

const syntheticInvoice = {
  invoiceNumber: "GB-INT-2026-FIXTURE01",
  issuedAt: new Date("2026-07-14T07:18:43.000Z"),
  customerName: syntheticApplication.candidateName,
  customerEmail: syntheticApplication.email,
  customerPhone: syntheticApplication.phone,
  description: "Backend Developer internship - 60 days",
  amountPaise: 500_000,
  totalPaise: 500_000,
  currency: "INR",
};

function decodedPdfText(bytes: Uint8Array) {
  const source = Buffer.from(bytes).toString("binary");
  const text: string[] = [];
  for (const match of source.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    try {
      const decoded = inflateSync(Buffer.from(match[1], "binary")).toString("binary");
      for (const token of decoded.matchAll(/<([0-9A-Fa-f]+)>\s*Tj/g)) {
        text.push(Buffer.from(token[1], "hex").toString("latin1"));
      }
    } catch {
      // Image and metadata streams are not PDF text streams.
    }
  }
  return text.join(" ");
}

describe("trusted internship invoice binding", () => {
  it("binds persisted application, trusted plan, gateway, and invoice fields", async () => {
    const paid = trustedPaidPaymentSource(syntheticPayment, syntheticApplication);
    const invoice = trustedInvoicePdfData(paid, syntheticInvoice);
    const bytes = await generateInternshipInvoicePdf(invoice);
    const text = decodedPdfText(bytes);

    assert.match(text, /Aarav Fixture Applicant/);
    assert.match(text, /aarav\.fixture@growblic\.test/);
    assert.match(text, /\+91 90000 00001/);
    assert.match(text, /Backend Developer/);
    assert.match(text, /60 days/);
    assert.match(text, /5,000\.00/);
    assert.match(text, /order_fixture_Q7Yp3J9wK2LmN8/);
    assert.match(text, /pay_fixture_Q7Z4d6HxV1AbC9/);
    assert.match(text, /14 July 2026/);
    assert.match(text, /12:48:42 pm IST/i);
    assert.doesNotMatch(text, /Inderjot Singh|example\.com/i);

    const document = await PDFDocument.load(bytes);
    assert.equal(document.getPageCount(), 1);
    assert.ok(Math.abs(document.getPage(0).getWidth() - 419.5276) < 0.01);
    assert.ok(Math.abs(document.getPage(0).getHeight() - 595.2756) < 0.01);
  });

  it("blocks missing customer details and unpaid records", () => {
    assert.throws(
      () => trustedPaidPaymentSource(
        { ...syntheticPayment, customerName: "" },
        { ...syntheticApplication, candidateName: "" },
      ),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedPaidPaymentSource({ ...syntheticPayment, status: "PENDING" }, syntheticApplication),
      InvoiceStateError,
    );
  });

  it("rejects client-like fake amount, status, payment ID, and application mismatch", () => {
    assert.throws(
      () => trustedPaidPaymentSource({ ...syntheticPayment, amountPaise: 100 }, syntheticApplication),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedPaidPaymentSource({ ...syntheticPayment, gatewayPaymentId: null }, syntheticApplication),
      InvoiceStateError,
    );
    assert.throws(
      () => trustedPaidPaymentSource(syntheticPayment, { ...syntheticApplication, id: "other_application" }),
      InvoiceStateError,
    );
  });

  it("rejects a persisted invoice that does not match the trusted paid record", () => {
    const paid = trustedPaidPaymentSource(syntheticPayment, syntheticApplication);
    assert.throws(
      () => trustedInvoicePdfData(paid, { ...syntheticInvoice, amountPaise: 100 }),
      InvoiceStateError,
    );
  });
});
