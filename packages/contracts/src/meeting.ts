import type { FormSubmissionResponse } from "./common";

export type MeetingRequest = {
  submissionKey: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
  website?: string;
};

export type NormalizedMeetingRequest = Omit<
  MeetingRequest,
  "website" | "email" | "phone" | "source"
> & {
  email: string | null;
  phone: string | null;
  source: string | null;
};

export type MeetingResponse = FormSubmissionResponse;
