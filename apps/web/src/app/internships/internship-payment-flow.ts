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
  | { type: "verification-started" }
  | {
      type: "server-status";
      status: string;
      invoiceAvailable: boolean;
      certificateEligible: boolean;
      invoiceNumber?: string;
    }
  | { type: "request-failed" };

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
    case "verification-started":
      return "verifying-payment";
    case "request-failed":
      return "failed";
    case "server-status":
      if (
        event.status === "PAID" &&
        event.invoiceAvailable &&
        event.certificateEligible &&
        event.invoiceNumber
      ) return "paid";
      if (event.status === "FAILED" || event.status === "REFUNDED") return "failed";
      return "awaiting-payment";
  }
}

export function canRevealPaidAssets(state: PaymentFlowState) {
  return state === "paid";
}
