export type PaymentFlowState =
  | "idle"
  | "creating-order"
  | "awaiting-payment"
  | "verifying-payment"
  | "paid"
  | "failed";

export type PaymentFlowEvent =
  | { type: "application-changed" }
  | { type: "plan-selected" }
  | { type: "order-started" }
  | { type: "order-created" }
  | { type: "session-restored" }
  | { type: "payment-link-opened" }
  | { type: "demo-complete-requested" }
  | { type: "verification-started" }
  | {
      type: "server-status";
      status: string;
      invoiceAvailable: boolean;
      certificateEligible: boolean;
      invoiceNumber?: string;
    }
  | { type: "request-failed" };

export type SuccessOverlayState = {
  visible: boolean;
  shownForPaymentId: string | null;
  amountPaise: number | null;
};

export type SuccessOverlayEvent =
  | {
      type: "trusted-status";
      previousStatus: string | null;
      currentStatus: string;
      paymentId: string;
      amountPaise: number;
    }
  | { type: "dismiss" }
  | { type: "reset" };

export const successOverlayDurationMs = 5_000;

export function scheduleSuccessOverlayDismiss<T>(
  schedule: (callback: () => void, delay: number) => T,
  dismiss: () => void,
) {
  return schedule(dismiss, successOverlayDurationMs);
}

export function initialSuccessOverlayState(): SuccessOverlayState {
  return {
    visible: false,
    shownForPaymentId: null,
    amountPaise: null,
  };
}

export function nextSuccessOverlay(
  current: SuccessOverlayState,
  event: SuccessOverlayEvent,
): SuccessOverlayState {
  if (event.type === "reset") return initialSuccessOverlayState();
  if (event.type === "dismiss") return { ...current, visible: false };

  if (
    event.previousStatus !== null &&
    event.previousStatus !== "PAID" &&
    event.currentStatus === "PAID" &&
    current.shownForPaymentId !== event.paymentId
  ) {
    return {
      visible: true,
      shownForPaymentId: event.paymentId,
      amountPaise: event.amountPaise,
    };
  }

  return current;
}

export function nextPaymentFlow(
  _current: PaymentFlowState,
  event: PaymentFlowEvent,
): PaymentFlowState {
  switch (event.type) {
    case "application-changed":
    case "plan-selected":
      return "idle";
    case "order-started":
      return "creating-order";
    case "order-created":
    case "session-restored":
      return "awaiting-payment";
    case "payment-link-opened":
    case "demo-complete-requested":
      return _current;
    case "verification-started":
      return "verifying-payment";
    case "request-failed":
      return "failed";
    case "server-status":
      if (event.status === "PAID") return "paid";
      if (event.status === "FAILED" || event.status === "REFUNDED") return "failed";
      return "awaiting-payment";
  }
}

export function canRevealPaidAssets(state: PaymentFlowState) {
  return state === "paid";
}

export function canDownloadInvoice(
  state: PaymentFlowState,
  status: Pick<
    Extract<PaymentFlowEvent, { type: "server-status" }>,
    "invoiceAvailable" | "invoiceNumber"
  > | null,
) {
  return state === "paid" && Boolean(status?.invoiceAvailable && status.invoiceNumber);
}

export function canRevealCertificate(
  state: PaymentFlowState,
  eligibility: { eligible: boolean } | null,
) {
  return state === "paid" && eligibility?.eligible === true;
}

export function canDownloadConfirmationLetter(
  state: PaymentFlowState,
  eligibility: { eligible: boolean } | null,
  session: { paymentId?: string; accessToken?: string } | null,
) {
  return (
    canRevealCertificate(state, eligibility) &&
    Boolean(
      session?.paymentId?.trim() &&
        session.accessToken?.trim(),
    )
  );
}

export function shouldRenderPaymentQr(state: PaymentFlowState) {
  void state;
  return true;
}

export function isDemoPaymentGatewayEnabled(value: string | undefined) {
  return value === "true";
}

export function shouldRenderRealPaymentQr(
  state: PaymentFlowState,
  demoMode: boolean,
) {
  return !demoMode && shouldRenderPaymentQr(state);
}
