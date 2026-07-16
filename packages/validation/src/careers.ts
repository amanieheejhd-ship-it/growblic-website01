import type { NormalizedCareerApplication } from "@growblic/contracts";
import { readEmail, readString, readSubmissionKey, readUrlList } from "./common";

export function validateCareerApplication(input: Record<string, unknown>): NormalizedCareerApplication {
  return {
    submissionKey: readSubmissionKey(input),
    candidateName: readString(input, "fullName", { min: 2, max: 120, required: true })!,
    email: readEmail(input, "email", true)!,
    phone: readString(input, "phone", { min: 5, max: 30, required: true })!,
    role: readString(input, "role", { min: 2, max: 120, required: true })!,
    experience: readString(input, "experience", { min: 2, max: 80, required: true })!,
    workLinks: readUrlList(input, "workLinks", 10),
    message: readString(input, "message", { min: 10, max: 3_000, required: true })!,
  };
}
