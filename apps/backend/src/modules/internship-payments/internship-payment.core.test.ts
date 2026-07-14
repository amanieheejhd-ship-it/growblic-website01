import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  hmacSha256,
  internshipPlanAmounts,
  readRazorpayPayment,
  trustedPlan,
  trustedProgram,
  verifyCheckoutSignature,
  verifyWebhookSignature,
  webhookPayment,
} from "./internship-payment.core";

describe("internship payment security primitives", () => {
  it("maps only the trusted durations to exact paise amounts", () => {
    assert.deepEqual(trustedPlan(30), { duration: 30, amountPaise: 300_000, currency: "INR" });
    assert.equal(trustedPlan(31), null);
    assert.equal(trustedPlan("30"), null);
    assert.equal(internshipPlanAmounts[180], 1_200_000);
  });

  it("maps only known internship slugs", () => {
    assert.equal(trustedProgram("backend-developer"), "Backend Developer");
    assert.equal(trustedProgram("unknown"), null);
  });

  it("verifies checkout HMAC over the stored order and payment IDs", () => {
    const secret = "test_secret";
    const signature = hmacSha256("order_test|pay_test", secret);
    assert.equal(verifyCheckoutSignature({ orderId: "order_test", paymentId: "pay_test", signature, secret }), true);
    assert.equal(verifyCheckoutSignature({ orderId: "order_other", paymentId: "pay_test", signature, secret }), false);
  });

  it("verifies webhook HMAC over the untouched raw bytes", () => {
    const raw = Buffer.from('{"event":"payment.captured"}');
    const signature = hmacSha256(raw, "webhook_secret");
    assert.equal(verifyWebhookSignature(raw, signature, "webhook_secret"), true);
    assert.equal(verifyWebhookSignature(Buffer.from(`${raw.toString()} `), signature, "webhook_secret"), false);
  });

  it("parses only complete Razorpay payment entities", () => {
    const entity = { id: "pay_1", order_id: "order_1", amount: 300_000, currency: "INR", status: "captured", method: "upi" };
    assert.deepEqual(readRazorpayPayment(entity), { id: "pay_1", orderId: "order_1", amount: 300_000, currency: "INR", status: "captured", method: "upi" });
    assert.deepEqual(webhookPayment({ event: "payment.captured", payload: { payment: { entity } } }), { eventType: "payment.captured", payment: readRazorpayPayment(entity) });
    assert.equal(readRazorpayPayment({ id: "pay_1" }), null);
  });
});
