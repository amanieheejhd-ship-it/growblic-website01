export type JoiningDateErrorCode =
  | "MISSING"
  | "MALFORMED"
  | "IMPOSSIBLE"
  | "TOO_EARLY"
  | "TOO_FAR_IN_FUTURE";

export class JoiningDateError extends Error {
  constructor(readonly code: JoiningDateErrorCode) {
    super("The date of joining is invalid.");
    this.name = "JoiningDateError";
  }
}

function utcDateOnly(value: Date) {
  return Date.UTC(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate(),
  );
}

export function parseJoiningDate(
  value: unknown,
  trusted: { applicationCreatedAt: Date; paidAt: Date; now: Date },
) {
  if (typeof value !== "string" || !value) {
    throw new JoiningDateError("MISSING");
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new JoiningDateError("MALFORMED");

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new JoiningDateError("IMPOSSIBLE");
  }

  const earliest = Math.max(
    utcDateOnly(trusted.applicationCreatedAt),
    utcDateOnly(trusted.paidAt),
  );
  if (parsed.getTime() < earliest) {
    throw new JoiningDateError("TOO_EARLY");
  }

  const latest = new Date(utcDateOnly(trusted.now));
  latest.setUTCDate(latest.getUTCDate() + 365);
  if (parsed.getTime() > latest.getTime()) {
    throw new JoiningDateError("TOO_FAR_IN_FUTURE");
  }

  return parsed;
}

export function sameJoiningDate(left: Date, right: Date) {
  return utcDateOnly(left) === utcDateOnly(right);
}

export function confirmationReference(year: number, sequence: number) {
  if (
    !Number.isInteger(year) ||
    year < 2000 ||
    year > 9999 ||
    !Number.isInteger(sequence) ||
    sequence < 1 ||
    sequence > 999_999
  ) {
    throw new RangeError("Confirmation reference is outside its valid range.");
  }
  return `GB-INT-${year}-${String(sequence).padStart(6, "0")}`;
}
