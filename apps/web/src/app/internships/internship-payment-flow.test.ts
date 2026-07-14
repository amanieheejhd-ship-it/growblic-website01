import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { canRevealPaidAssets, nextPaymentFlow } from "./internship-payment-flow";

describe("internship payment frontend gate", () => {
  it("keeps paid-only UI hidden throughout order creation and verification", () => {
    const states = [
      "idle",
      nextPaymentFlow("idle", { type: "order-started" }),
      nextPaymentFlow("creating-order", { type: "order-created" }),
      nextPaymentFlow("awaiting-payment", { type: "verification-started" }),
    ] as const;
    assert.deepEqual(states, ["idle", "creating-order", "awaiting-payment", "verifying-payment"]);
    assert.equal(states.some(canRevealPaidAssets), false);
  });

  it("unlocks only after the backend confirms PAID, invoice, and eligibility", () => {
    assert.equal(nextPaymentFlow("verifying-payment", {
      type: "server-status",
      status: "PAID",
      invoiceAvailable: false,
      certificateEligible: true,
    }), "awaiting-payment");
    assert.equal(nextPaymentFlow("verifying-payment", {
      type: "server-status",
      status: "PAID",
      invoiceAvailable: true,
      certificateEligible: true,
      invoiceNumber: "GB-INT-2026-FIXTURE",
    }), "paid");
  });

  it("restores a session as awaiting until fresh backend confirmation arrives", () => {
    const restored = nextPaymentFlow("idle", { type: "session-restored" });
    assert.equal(restored, "awaiting-payment");
    assert.equal(canRevealPaidAssets(restored), false);
    assert.equal(nextPaymentFlow(restored, {
      type: "server-status",
      status: "PAID",
      invoiceAvailable: true,
      certificateEligible: true,
      invoiceNumber: "GB-INT-2026-RESTORED",
    }), "paid");
  });

  it("clears paid access for a new application, plan, or failed verification", () => {
    assert.equal(nextPaymentFlow("paid", { type: "application-changed" }), "idle");
    assert.equal(nextPaymentFlow("paid", { type: "plan-selected" }), "idle");
    assert.equal(nextPaymentFlow("verifying-payment", { type: "request-failed" }), "failed");
  });
});
