import "server-only";

import { prisma } from "@/lib/prisma";
import { FormValidationError, readEmail, readString, readSubmissionKey } from "./form-validation";

export async function saveInternshipApplication(input: Record<string, unknown>) {
  const submissionKey = readSubmissionKey(input);
  const internshipSlug = readString(input, "internshipSlug", {
    min: 2,
    max: 100,
    required: true,
  });
  const candidateName = readString(input, "fullName", { min: 2, max: 120, required: true });
  const email = readEmail(input, "email", true);
  const phone = readString(input, "phone", { min: 5, max: 30, required: true });
  const state = readString(input, "state", { min: 2, max: 100, required: true });
  const instituteEnrollment = readString(input, "instituteEnrollment", {
    max: 3,
    required: true,
  });

  if (!internshipSlug || !/^[a-z0-9-]+$/.test(internshipSlug)) {
    throw new FormValidationError();
  }

  if (!instituteEnrollment || !["Yes", "No"].includes(instituteEnrollment)) {
    throw new FormValidationError();
  }

  const instituteName = readString(input, "instituteName", {
    min: instituteEnrollment === "Yes" ? 2 : 0,
    max: 180,
    required: instituteEnrollment === "Yes",
  });
  const course = readString(input, "course", {
    min: instituteEnrollment === "Yes" ? 2 : 0,
    max: 120,
    required: instituteEnrollment === "Yes",
  });
  const enrollmentNumber = readString(input, "enrollmentNumber", {
    min: instituteEnrollment === "Yes" ? 2 : 0,
    max: 100,
    required: instituteEnrollment === "Yes",
  });
  const highestQualification = readString(input, "highestQualification", {
    min: instituteEnrollment === "No" ? 2 : 0,
    max: 120,
    required: instituteEnrollment === "No",
  });
  const passingYear = readString(input, "passingYear", {
    min: instituteEnrollment === "No" ? 4 : 0,
    max: 4,
    required: instituteEnrollment === "No",
  });
  const message = readString(input, "message", { max: 2_000 });

  await prisma.internshipApplication.upsert({
    where: { submissionKey },
    update: { submissionKey },
    create: {
      submissionKey,
      internshipSlug,
      candidateName: candidateName!,
      email: email!,
      phone: phone!,
      state: state!,
      instituteEnrollment,
      instituteName: instituteEnrollment === "Yes" ? instituteName : null,
      course: instituteEnrollment === "Yes" ? course : null,
      enrollmentNumber: instituteEnrollment === "Yes" ? enrollmentNumber : null,
      highestQualification: instituteEnrollment === "No" ? highestQualification : null,
      passingYear: instituteEnrollment === "No" ? passingYear : null,
      message,
    },
    select: { id: true },
  });
}
