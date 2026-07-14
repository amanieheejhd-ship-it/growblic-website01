import type { InstituteEnrollment, NormalizedInternshipApplication } from "@growblic/contracts";
import { FormValidationError, readEmail, readString, readSubmissionKey } from "./common.ts";

export function validateInternshipApplication(input: Record<string, unknown>): NormalizedInternshipApplication {
  const submissionKey = readSubmissionKey(input);
  const internshipSlug = readString(input, "internshipSlug", { min: 2, max: 100, required: true });
  const candidateName = readString(input, "fullName", { min: 2, max: 120, required: true });
  const email = readEmail(input, "email", true);
  const phone = readString(input, "phone", { min: 5, max: 30, required: true });
  const state = readString(input, "state", { min: 2, max: 100, required: true });
  const instituteEnrollment = readString(input, "instituteEnrollment", { max: 3, required: true });
  if (!internshipSlug || !/^[a-z0-9-]+$/.test(internshipSlug)) throw new FormValidationError();
  if (!instituteEnrollment || !["Yes", "No"].includes(instituteEnrollment)) throw new FormValidationError();
  const enrollment = instituteEnrollment as InstituteEnrollment;

  const instituteName = readString(input, "instituteName", { min: enrollment === "Yes" ? 2 : 0, max: 180, required: enrollment === "Yes" });
  const course = readString(input, "course", { min: enrollment === "Yes" ? 2 : 0, max: 120, required: enrollment === "Yes" });
  const enrollmentNumber = readString(input, "enrollmentNumber", { min: enrollment === "Yes" ? 2 : 0, max: 100, required: enrollment === "Yes" });
  const highestQualification = readString(input, "highestQualification", { min: enrollment === "No" ? 2 : 0, max: 120, required: enrollment === "No" });
  const passingYear = readString(input, "passingYear", { min: enrollment === "No" ? 4 : 0, max: 4, required: enrollment === "No" });

  return {
    submissionKey,
    internshipSlug,
    candidateName: candidateName!,
    email: email!,
    phone: phone!,
    state: state!,
    instituteEnrollment: enrollment,
    instituteName: enrollment === "Yes" ? instituteName : null,
    course: enrollment === "Yes" ? course : null,
    enrollmentNumber: enrollment === "Yes" ? enrollmentNumber : null,
    highestQualification: enrollment === "No" ? highestQualification : null,
    passingYear: enrollment === "No" ? passingYear : null,
    message: readString(input, "message", { max: 2_000 }),
  };
}
