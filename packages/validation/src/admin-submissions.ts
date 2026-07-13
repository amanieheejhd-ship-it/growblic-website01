import { FormValidationError } from "./common";

export const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED", "SPAM"] as const;
export const APPLICATION_STATUSES = [
  "NEW", "REVIEWING", "SHORTLISTED", "INTERVIEW", "REJECTED", "HIRED", "WITHDRAWN",
] as const;

const CUID_PATTERN = /^c[a-z0-9]{20,}$/;

export function readAdminSubmissionId(value: string) {
  if (!CUID_PATTERN.test(value)) throw new FormValidationError("Invalid submission identifier.");
  return value;
}

export function readAdminSubmissionQuery(url: URL, allowedStatuses: readonly string[]) {
  const pageValue = url.searchParams.get("page") ?? "1";
  const pageSizeValue = url.searchParams.get("pageSize") ?? "20";
  if (!/^\d+$/.test(pageValue) || !/^\d+$/.test(pageSizeValue)) {
    throw new FormValidationError("Invalid pagination parameters.");
  }
  const page = Number(pageValue);
  const pageSize = Number(pageSizeValue);
  if (page < 1 || page > 100_000 || pageSize < 1 || pageSize > 100) {
    throw new FormValidationError("Invalid pagination parameters.");
  }
  const status = url.searchParams.get("status");
  if (status && !allowedStatuses.includes(status)) {
    throw new FormValidationError("Invalid status filter.");
  }
  const search = url.searchParams.get("search")?.normalize("NFKC").trim() ?? "";
  if (search.length > 120) throw new FormValidationError("Search is too long.");
  return { page, pageSize, status, search };
}

export function readAdminStatusUpdate(input: unknown, allowedStatuses: readonly string[]) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new FormValidationError("Invalid status update.");
  }
  const status = (input as Record<string, unknown>).status;
  if (typeof status !== "string" || !allowedStatuses.includes(status)) {
    throw new FormValidationError("Invalid status update.");
  }
  return status;
}
