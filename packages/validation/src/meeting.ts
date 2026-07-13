import type { NormalizedMeetingRequest } from "@growblic/contracts";
import { readEmail, readString, readSubmissionKey } from "./common";

export function validateMeetingRequest(input: Record<string, unknown>): NormalizedMeetingRequest {
  return {
    submissionKey: readSubmissionKey(input),
    name: readString(input, "name", { min: 2, max: 120, required: true })!,
    email: readEmail(input, "email"),
    phone: readString(input, "phone", { max: 30 }),
    message: readString(input, "message", { min: 3, max: 3_000, required: true })!,
    source: readString(input, "source", { max: 100 }),
  };
}
