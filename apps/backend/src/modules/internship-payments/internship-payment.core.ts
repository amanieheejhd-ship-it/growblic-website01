import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const internshipPlanAmounts = Object.freeze({
  30: 300_000,
  45: 400_000,
  60: 500_000,
  90: 700_000,
  180: 1_200_000,
} as const);

const internshipPrograms: Readonly<Record<string, string>> = Object.freeze({
  "backend-developer": "Backend Developer",
  "digital-marketing": "Digital Marketing",
  "frontend-developer": "Frontend Developer",
  "ui-ux-design": "UI/UX Designer",
});

export function trustedPlan(duration: unknown) {
  if (typeof duration !== "number" || !Number.isInteger(duration)) return null;
  const amountPaise = internshipPlanAmounts[duration as keyof typeof internshipPlanAmounts];
  return amountPaise ? { duration, amountPaise, currency: "INR" as const } : null;
}

export function trustedProgram(slug: string) {
  return internshipPrograms[slug] ?? null;
}

export function paymentAccessToken() {
  return randomBytes(32).toString("base64url");
}

export function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex");
}

export function hmacSha256(value: string | Buffer, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function constantTimeEqual(expected: string, received: string) {
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(received, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyCheckoutSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}) {
  const expected = hmacSha256(`${input.orderId}|${input.paymentId}`, input.secret);
  return constantTimeEqual(expected, input.signature);
}

export function verifyWebhookSignature(rawBody: Buffer, signature: string, secret: string) {
  return constantTimeEqual(hmacSha256(rawBody, secret), signature);
}

export function asNonEmptyString(value: unknown, maximum = 256) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized && normalized.length <= maximum ? normalized : null;
}

export type RazorpayPaymentSnapshot = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
};

export function readRazorpayPayment(value: unknown): RazorpayPaymentSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const id = asNonEmptyString(candidate.id);
  const orderId = asNonEmptyString(candidate.order_id);
  const currency = asNonEmptyString(candidate.currency, 8);
  const status = asNonEmptyString(candidate.status, 32);
  const method = candidate.method == null ? null : asNonEmptyString(candidate.method, 32);
  if (!id || !orderId || !currency || !status || !Number.isSafeInteger(candidate.amount)) return null;
  return { id, orderId, amount: candidate.amount as number, currency, status, method };
}

export function webhookPayment(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const event = raw as Record<string, unknown>;
  const eventType = asNonEmptyString(event.event, 64);
  const payload = event.payload as Record<string, unknown> | undefined;
  const payment = payload?.payment as Record<string, unknown> | undefined;
  const entity = payment?.entity;
  const snapshot = readRazorpayPayment(entity);
  return eventType && snapshot ? { eventType, payment: snapshot } : null;
}
