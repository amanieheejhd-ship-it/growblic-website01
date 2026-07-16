import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canDownloadConfirmationLetter,
  canDownloadInvoice,
  canRevealCertificate,
  canRevealPaidAssets,
  initialSuccessOverlayState,
  isDemoPaymentGatewayEnabled,
  nextPaymentFlow,
  nextSuccessOverlay,
  scheduleSuccessOverlayDismiss,
  shouldRenderPaymentQr,
  shouldRenderRealPaymentQr,
  successOverlayDurationMs,
} from "./internship-payment-flow";

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

  it("never shows verified success for PENDING or FAILED backend states", () => {
    const pending = nextPaymentFlow("awaiting-payment", {
      type: "server-status",
      status: "PENDING",
      invoiceAvailable: false,
      certificateEligible: false,
    });
    const failed = nextPaymentFlow("awaiting-payment", {
      type: "server-status",
      status: "FAILED",
      invoiceAvailable: false,
      certificateEligible: false,
    });

    assert.equal(pending, "awaiting-payment");
    assert.equal(failed, "failed");
    assert.equal(canRevealPaidAssets(pending), false);
    assert.equal(canRevealPaidAssets(failed), false);
  });

  it("a local payment-link click never shows verified success", () => {
    const state = nextPaymentFlow("awaiting-payment", {
      type: "payment-link-opened",
    });

    assert.equal(state, "awaiting-payment");
    assert.equal(canRevealPaidAssets(state), false);
  });

  it("a demo button click alone never unlocks paid assets", () => {
    const state = nextPaymentFlow("awaiting-payment", {
      type: "demo-complete-requested",
    });

    assert.equal(state, "awaiting-payment");
    assert.equal(canRevealPaidAssets(state), false);
  });

  it("shows verified success only after the backend returns PAID", () => {
    const paid = nextPaymentFlow("awaiting-payment", {
      type: "server-status",
      status: "PAID",
      invoiceAvailable: false,
      certificateEligible: false,
    });

    assert.equal(paid, "paid");
    assert.equal(canRevealPaidAssets(paid), true);
  });

  it("restores a session as awaiting until fresh backend PAID confirmation arrives", () => {
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

  it("keeps certificate and invoice gated by their trusted backend responses", () => {
    assert.equal(canDownloadInvoice("awaiting-payment", {
      invoiceAvailable: true,
      invoiceNumber: "GB-INT-2026-UNVERIFIED",
    }), false);
    assert.equal(canDownloadInvoice("paid", null), false);
    assert.equal(canDownloadInvoice("paid", {
      invoiceAvailable: false,
    }), false);
    assert.equal(canDownloadInvoice("paid", {
      invoiceAvailable: true,
      invoiceNumber: "GB-INT-2026-VERIFIED",
    }), true);

    assert.equal(canRevealCertificate("awaiting-payment", { eligible: true }), false);
    assert.equal(canRevealCertificate("paid", null), false);
    assert.equal(canRevealCertificate("paid", { eligible: false }), false);
    assert.equal(canRevealCertificate("paid", { eligible: true }), true);
  });

  it("keeps the confirmation letter hidden before PAID and without eligibility", () => {
    const session = {
      paymentId: "payment-confirmation",
      accessToken: "authenticated-token",
    };

    assert.equal(
      canDownloadConfirmationLetter(
        "awaiting-payment",
        { eligible: true },
        session,
      ),
      false,
    );
    assert.equal(
      canDownloadConfirmationLetter(
        "failed",
        { eligible: true },
        session,
      ),
      false,
    );
    assert.equal(canDownloadConfirmationLetter("paid", null, session), false);
    assert.equal(
      canDownloadConfirmationLetter(
        "paid",
        { eligible: false },
        session,
      ),
      false,
    );
    assert.equal(
      canDownloadConfirmationLetter(
        "paid",
        { eligible: true },
        null,
      ),
      false,
    );
    assert.equal(
      canDownloadConfirmationLetter(
        "paid",
        { eligible: true },
        { paymentId: "payment-confirmation", accessToken: "" },
      ),
      false,
    );
    assert.equal(
      canDownloadConfirmationLetter(
        "paid",
        { eligible: true },
        session,
      ),
      true,
    );
  });

  it("clears paid access for a new application, plan, or failed verification", () => {
    assert.equal(nextPaymentFlow("paid", { type: "application-changed" }), "idle");
    assert.equal(nextPaymentFlow("paid", { type: "plan-selected" }), "idle");
    assert.equal(nextPaymentFlow("verifying-payment", { type: "request-failed" }), "failed");
  });

  it("keeps the QR visible after verified PAID", () => {
    assert.equal(shouldRenderPaymentQr("awaiting-payment"), true);
    assert.equal(shouldRenderPaymentQr("failed"), true);
    assert.equal(shouldRenderPaymentQr("paid"), true);
  });

  it("enables demo mode only for the exact public flag and hides the real QR", () => {
    assert.equal(isDemoPaymentGatewayEnabled("true"), true);
    assert.equal(isDemoPaymentGatewayEnabled("false"), false);
    assert.equal(isDemoPaymentGatewayEnabled(undefined), false);
    assert.equal(shouldRenderRealPaymentQr("awaiting-payment", true), false);
    assert.equal(shouldRenderRealPaymentQr("paid", true), false);
    assert.equal(shouldRenderRealPaymentQr("awaiting-payment", false), true);
  });

  it("opens the overlay only for an observed trusted non-PAID to PAID transition", () => {
    const initial = initialSuccessOverlayState();
    const initialPaid = nextSuccessOverlay(initial, {
      type: "trusted-status",
      previousStatus: null,
      currentStatus: "PAID",
      paymentId: "payment-initial-paid",
      amountPaise: 100,
    });
    const pending = nextSuccessOverlay(initial, {
      type: "trusted-status",
      previousStatus: null,
      currentStatus: "PENDING",
      paymentId: "payment-transition",
      amountPaise: 100,
    });
    const paid = nextSuccessOverlay(pending, {
      type: "trusted-status",
      previousStatus: "PENDING",
      currentStatus: "PAID",
      paymentId: "payment-transition",
      amountPaise: 100,
    });

    assert.equal(initialPaid.visible, false);
    assert.equal(pending.visible, false);
    assert.equal(paid.visible, true);
    assert.equal(paid.amountPaise, 100);
  });

  it("never opens the overlay for PENDING or FAILED", () => {
    const initial = initialSuccessOverlayState();
    const pending = nextSuccessOverlay(initial, {
      type: "trusted-status",
      previousStatus: "CREATED",
      currentStatus: "PENDING",
      paymentId: "payment-not-paid",
      amountPaise: 100,
    });
    const failed = nextSuccessOverlay(pending, {
      type: "trusted-status",
      previousStatus: "PENDING",
      currentStatus: "FAILED",
      paymentId: "payment-not-paid",
      amountPaise: 100,
    });

    assert.equal(pending.visible, false);
    assert.equal(failed.visible, false);
  });

  it("dismisses after the five-second window without clearing PAID or replaying", () => {
    const paidFlow = nextPaymentFlow("awaiting-payment", {
      type: "server-status",
      status: "PAID",
      invoiceAvailable: true,
      certificateEligible: true,
      invoiceNumber: "GB-INT-2026-OVERLAY",
    });
    const visible = nextSuccessOverlay(initialSuccessOverlayState(), {
      type: "trusted-status",
      previousStatus: "PENDING",
      currentStatus: "PAID",
      paymentId: "payment-overlay-once",
      amountPaise: 100,
    });
    let overlay = visible;
    let scheduledDelay = 0;
    let scheduledDismiss = () => {};
    scheduleSuccessOverlayDismiss(
      (callback, delay) => {
        scheduledDismiss = callback;
        scheduledDelay = delay;
      },
      () => {
        overlay = nextSuccessOverlay(overlay, { type: "dismiss" });
      },
    );
    assert.equal(overlay.visible, true);
    scheduledDismiss();
    const dismissed = overlay;
    const repeatedPaid = nextSuccessOverlay(dismissed, {
      type: "trusted-status",
      previousStatus: "PAID",
      currentStatus: "PAID",
      paymentId: "payment-overlay-once",
      amountPaise: 100,
    });

    assert.equal(successOverlayDurationMs, 5_000);
    assert.equal(scheduledDelay, 5_000);
    assert.equal(dismissed.visible, false);
    assert.equal(paidFlow, "paid");
    assert.equal(canRevealPaidAssets(paidFlow), true);
    assert.equal(repeatedPaid.visible, false);
  });
});
