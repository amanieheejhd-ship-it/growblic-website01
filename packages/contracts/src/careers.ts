import type { FormSubmissionResponse } from "./common";

export type CareerApplicationRequest = {
  submissionKey: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  workLinks: string[];
  message: string;
  website?: string;
};

export type NormalizedCareerApplication = Omit<
  CareerApplicationRequest,
  "fullName" | "website"
> & {
  candidateName: string;
};

export type CareerApplicationResponse = FormSubmissionResponse;
