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

type SharedValidators = {
  FormValidationError: new (...args: never[]) => Error;
  readSubmissionKey(input: Record<string, unknown>): string;
  validateContact(input: Record<string, unknown>):
    | { success: true; data: ContactData }
    | { success: false; fieldErrors: Record<string, string> };
  validateQuoteRequest(input: Record<string, unknown>): QuoteData;
  validateMeetingRequest(input: Record<string, unknown>): SubmissionData;
  validateCareerApplication(input: Record<string, unknown>): SubmissionData;
  validateInternshipApplication(input: Record<string, unknown>): SubmissionData;
};

let sharedValidators: Promise<SharedValidators> | null = null;

function loadSharedValidators() {
  sharedValidators ??= Promise.all([
    "@growblic/validation/common",
    "@growblic/validation/contact",
    "@growblic/validation/quote",
    "@growblic/validation/meeting",
    "@growblic/validation/careers",
    "@growblic/validation/internships",
  ].map((specifier) => import(specifier))).then(([
    common,
    contact,
    quote,
    meeting,
    careers,
    internships,
  ]) => ({
    FormValidationError: common.FormValidationError,
    readSubmissionKey: common.readSubmissionKey,
    validateContact: contact.validateContact,
    validateQuoteRequest: quote.validateQuoteRequest,
    validateMeetingRequest: meeting.validateMeetingRequest,
    validateCareerApplication: careers.validateCareerApplication,
    validateInternshipApplication: internships.validateInternshipApplication,
  }) as SharedValidators);
  return sharedValidators;
}

function quoteSubmission(
  kind: "project-request" | "price-calculator",
  input: Record<string, unknown>,
  validateQuoteRequest: SharedValidators["validateQuoteRequest"],
): PreparedPublicSubmission {
  const data = validateQuoteRequest(input);

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

  const validators = await loadSharedValidators();

  try {
    switch (kind) {
      case "contact": {
        const submissionKey = validators.readSubmissionKey(input);
        const result = validators.validateContact(input);
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
          submission: quoteSubmission(kind, input, validators.validateQuoteRequest),
        };
      case "meetup":
        return {
          honeypot: false,
          submission: { kind, data: validators.validateMeetingRequest(input) },
        };
      case "career-application":
        return {
          honeypot: false,
          submission: { kind, data: validators.validateCareerApplication(input) },
        };
      case "internship-application":
        return {
          honeypot: false,
          submission: { kind, data: validators.validateInternshipApplication(input) },
        };
    }
  } catch (error) {
    if (error instanceof PublicSubmissionValidationError) throw error;
    if (error instanceof validators.FormValidationError) {
      throw new PublicSubmissionValidationError(error.message);
    }
    throw error;
  }
}
