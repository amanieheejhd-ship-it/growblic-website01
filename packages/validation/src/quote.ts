import type { NormalizedQuoteRequest } from "@growblic/contracts";
import { readEmail, readOptionalJsonObject, readString, readSubmissionKey } from "./common.ts";

export function validateQuoteRequest(input: Record<string, unknown>): NormalizedQuoteRequest {
  return {
    submissionKey: readSubmissionKey(input),
    name: readString(input, "name", { min: 2, max: 120, required: true })!,
    email: readEmail(input, "email"),
    phone: readString(input, "phone", { max: 30 }),
    company: readString(input, "company", { max: 160 }),
    location: readString(input, "location", { max: 160 }),
    service: readString(input, "service", { max: 160 }),
    budget: readString(input, "budget", { max: 120 }),
    requirements: readString(input, "requirements", { min: 3, max: 10_000, required: true })!,
    calculatorData: readOptionalJsonObject(input, "calculatorData"),
    source: readString(input, "source", { max: 100 }),
  };
}
