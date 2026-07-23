import { randomBytes } from "node:crypto";

const DAY_MS = 86_400_000;
const PUBLIC_REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const CERTIFICATE_DURATIONS = [30, 45, 60, 90, 180] as const;
export const CERTIFICATE_MAX_EMAIL_ATTEMPTS = 5;

export function certificatePublicReference(
  year: number,
  entropy: Uint8Array = randomBytes(8),
) {
  if (!Number.isInteger(year) || year < 2000 || year > 9999 || entropy.length < 8) {
    throw new Error("Invalid certificate public reference input.");
  }
  let suffix = "";
  for (let index = 0; index < 8; index += 1) {
    suffix += PUBLIC_REFERENCE_ALPHABET[entropy[index] & 31];
  }
  return `GB${String(year % 100).padStart(2, "0")}${suffix}`;
}

export function certificateDates(
  joiningDate: Date,
  durationDays: number,
  reminderDays: number,
) {
  if (
    !Number.isInteger(durationDays) ||
    !CERTIFICATE_DURATIONS.includes(
      durationDays as (typeof CERTIFICATE_DURATIONS)[number],
    ) ||
    !Number.isInteger(reminderDays) ||
    reminderDays < 1 ||
    reminderDays > 30
  ) {
    throw new Error("Invalid certificate dates.");
  }
  const start = Date.UTC(
    joiningDate.getUTCFullYear(),
    joiningDate.getUTCMonth(),
    joiningDate.getUTCDate(),
  );
  return {
    joiningDate: new Date(start),
    completionDate: new Date(start + (durationDays - 1) * DAY_MS),
    reminderDueAt: new Date(start + (durationDays - 1 - reminderDays) * DAY_MS),
  };
}

export function certificateNumber(year: number, sequence: number) {
  if (
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 9999 ||
    !Number.isInteger(sequence) ||
    sequence < 1 ||
    sequence > 999_999
  ) {
    throw new Error("Invalid certificate sequence.");
  }
  return `GB-CERT-${year}-${String(sequence).padStart(6, "0")}`;
}

export function daysRemaining(completionDate: Date | null, now: Date) {
  if (!completionDate) return null;
  const completionDay = Date.UTC(
    completionDate.getUTCFullYear(),
    completionDate.getUTCMonth(),
    completionDate.getUTCDate(),
  );
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.ceil((completionDay - today) / DAY_MS));
}

export function certificateCanGenerate(input: {
  paymentStatus: string;
  applicationMatches: boolean;
  joiningDate: Date | null;
  completionDate: Date | null;
  status: string;
  skillCount: number;
  emailedAt: Date | null;
  now: Date;
}) {
  return (
    input.paymentStatus === "PAID" &&
    input.applicationMatches &&
    Boolean(input.joiningDate) &&
    Boolean(input.completionDate && input.completionDate <= input.now) &&
    input.status === "READY" &&
    input.skillCount > 0 &&
    !input.emailedAt
  );
}

export function safeDeliveryError(error: unknown) {
  const message = error instanceof Error ? error.message : "Delivery failed";
  return message.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").slice(0, 300);
}
