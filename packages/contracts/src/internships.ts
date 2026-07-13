import type { FormSubmissionResponse } from "./common";

export type InstituteEnrollment = "Yes" | "No";

export type InternshipApplicationRequest = {
  submissionKey: string;
  internshipSlug: string;
  fullName: string;
  email: string;
  phone: string;
  state: string;
  instituteEnrollment: string;
  instituteName?: string;
  course?: string;
  enrollmentNumber?: string;
  highestQualification?: string;
  passingYear?: string;
  message?: string;
  website?: string;
};

export type NormalizedInternshipApplication = Omit<
  InternshipApplicationRequest,
  | "fullName"
  | "website"
  | "instituteEnrollment"
  | "instituteName"
  | "course"
  | "enrollmentNumber"
  | "highestQualification"
  | "passingYear"
  | "message"
> & {
  candidateName: string;
  instituteEnrollment: InstituteEnrollment;
  instituteName: string | null;
  course: string | null;
  enrollmentNumber: string | null;
  highestQualification: string | null;
  passingYear: string | null;
  message: string | null;
};

export type InternshipApplicationResponse = FormSubmissionResponse;
