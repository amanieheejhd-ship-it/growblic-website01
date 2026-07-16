import {
  FormValidationError,
  readSubmissionKey,
} from "../../../../../packages/validation/src/common";
import { validateContact } from "../../../../../packages/validation/src/contact";
import { validateQuoteRequest } from "../../../../../packages/validation/src/quote";
import { validateMeetingRequest } from "../../../../../packages/validation/src/meeting";
import { validateCareerApplication } from "../../../../../packages/validation/src/careers";
import { validateInternshipApplication } from "../../../../../packages/validation/src/internships";

export type PublicSubmissionKind =
  | "contact"
  | "project-request"
  | "price-calculator"
  | "meetup"
  | "career-application"
  | "internship-application";

type ContactData = Record<string, string | undefined>;
type SubmissionData = { submissionKey: string } & Record<string, unknown>;
type QuoteData = SubmissionData & {
  calculatorData: Record<string, unknown> | null;
  source: string | null;
};

export type PreparedPublicSubmission =
  | { kind: "contact"; submissionKey: string; data: ContactData }
  | { kind: "project-request"; data: QuoteData }
  | { kind: "price-calculator"; data: QuoteData }
  | { kind: "meetup"; data: SubmissionData }
  | { kind: "career-application"; data: SubmissionData }
  | { kind: "internship-application"; data: SubmissionData };

export type PublicSubmissionPreparation =
  | { honeypot: true }
  | { honeypot: false; submission: PreparedPublicSubmission };

export class PublicSubmissionValidationError extends Error {
  constructor(
    message = "Please check the submitted information and try again.",
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "PublicSubmissionValidationError";
  }
}

function inputRecord(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new PublicSubmissionValidationError();
  }
  return body as Record<string, unknown>;
}

function quoteSubmission(
  kind: "project-request" | "price-calculator",
  input: Record<string, unknown>,
  validator: typeof validateQuoteRequest,
): PreparedPublicSubmission {
  const data = validator(input);

  if (kind === "project-request" && data.calculatorData) {
    throw new PublicSubmissionValidationError();
  }
  if (kind === "price-calculator" && !data.calculatorData) {
    throw new PublicSubmissionValidationError();
  }

  return {
    kind,
    data: {
      ...data,
      calculatorData: kind === "price-calculator" ? data.calculatorData : null,
      source: kind === "price-calculator" ? "price-calculator" : data.source,
    },
  };
}

export async function preparePublicSubmission(
  kind: PublicSubmissionKind,
  body: unknown,
): Promise<PublicSubmissionPreparation> {
  const input = inputRecord(body);
  const honeypot = input.website;

  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { honeypot: true };
  }

  try {
    switch (kind) {
      case "contact": {
        const submissionKey = readSubmissionKey(input);
        const result = validateContact(input);
        if (!result.success) {
          throw new PublicSubmissionValidationError(
            "Please correct the highlighted fields and try again.",
            result.fieldErrors,
          );
        }
        return {
          honeypot: false,
          submission: { kind, submissionKey, data: result.data },
        };
      }
      case "project-request":
      case "price-calculator":
        return {
          honeypot: false,
          submission: quoteSubmission(kind, input, validateQuoteRequest),
        };
      case "meetup":
        return {
          honeypot: false,
          submission: { kind, data: validateMeetingRequest(input) },
        };
      case "career-application":
        return {
          honeypot: false,
          submission: { kind, data: validateCareerApplication(input) },
        };
      case "internship-application":
        return {
          honeypot: false,
          submission: { kind, data: validateInternshipApplication(input) },
        };
    }
  } catch (error) {
    if (error instanceof PublicSubmissionValidationError) throw error;
    if (error instanceof FormValidationError) {
      throw new PublicSubmissionValidationError(
        error instanceof Error ? error.message : undefined,
      );
    }
    throw error;
  }
}
