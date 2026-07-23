import {
  BadRequestException,
  ConflictException,
  HttpException,
} from "@nestjs/common";
import { FormValidationError } from "@growblic/validation";

// User-facing messages for domain error codes thrown by the certificate
// repository. These map to HTTP 409 exactly as the previous admin API did.
const CERTIFICATE_CONFLICT_MESSAGES: Record<string, string> = {
  IMMUTABLE_CERTIFICATE: "Generated certificates cannot be edited.",
  CERTIFICATE_NOT_ELIGIBLE: "A trusted paid payment and joining date are required.",
  CERTIFICATE_DOMAIN_REQUIRED: "Select an internship domain or role before marking ready.",
  CERTIFICATE_SKILLS_REQUIRED: "Add at least one verified skill before marking ready.",
  CERTIFICATE_RETRY_NOT_ALLOWED: "This certificate email cannot be retried.",
  CERTIFICATE_RETRY_RATE_LIMITED: "Too many retry requests. Please wait before trying again.",
  CERTIFICATE_PREVIEW_NOT_CONFIGURED: "Certificate preview is not configured.",
  CERTIFICATE_TEST_PRODUCTION_FORBIDDEN: "Reminder test mode is unavailable in production.",
  CERTIFICATE_TEST_MODE_DISABLED: "Reminder test mode is disabled.",
  CERTIFICATE_TEST_JOBS_DISABLED: "Certificate background jobs must be enabled for this test.",
  CERTIFICATE_TEST_MINUTES_INVALID: "The reminder test delay is not configured safely.",
  CERTIFICATE_TEST_PAYMENT_REQUIRED: "A trusted paid payment is required for this test.",
  CERTIFICATE_TEST_ACTIVE_INTERNSHIP_REQUIRED: "Select an active internship with a future completion date.",
  CERTIFICATE_TEST_REMINDER_ALREADY_SENT: "The admin reminder has already been sent successfully.",
};

// Translates moved admin-domain errors into HttpExceptions so the shared
// GlobalExceptionFilter renders them with the correct status and message.
export function toAdminHttpException(error: unknown): unknown {
  if (error instanceof HttpException) return error;
  if (error instanceof FormValidationError) {
    return new BadRequestException(error.message);
  }
  const code = error instanceof Error ? error.message : "";
  if (CERTIFICATE_CONFLICT_MESSAGES[code]) {
    return new ConflictException(CERTIFICATE_CONFLICT_MESSAGES[code]);
  }
  return error;
}

export async function withAdminErrors<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw toAdminHttpException(error);
  }
}
