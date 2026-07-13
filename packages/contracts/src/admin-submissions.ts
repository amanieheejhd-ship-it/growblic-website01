import type { ApiErrorResponse } from "./common";

export type EnquiryStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED" | "SPAM";
export type ApplicationStatus =
  | "NEW" | "REVIEWING" | "SHORTLISTED" | "INTERVIEW"
  | "REJECTED" | "HIRED" | "WITHDRAWN";

export type AdminSubmissionKind =
  | "contact-messages"
  | "project-requests"
  | "price-calculator-leads"
  | "meetup-requests"
  | "career-applications"
  | "internship-applications";

export type AdminSubmissionCount = { total: number; pending: number };
export type AdminDashboardSummary = Record<AdminSubmissionKind, AdminSubmissionCount>;

export type AdminSubmissionPage<T> = {
  items: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

type SubmissionBase<Status extends string> = { id: string; status: Status; createdAt: string };

export type AdminContactMessage = SubmissionBase<EnquiryStatus> & {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  messageSummary: string;
};

export type AdminProjectRequest = SubmissionBase<EnquiryStatus> & {
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  requirementsSummary: string;
};

export type AdminPriceCalculatorLead = SubmissionBase<EnquiryStatus> & {
  name: string;
  email: string | null;
  phone: string | null;
  projectCategory: string | null;
  selectedOptionsSummary: string;
  calculatedEstimate: string | null;
  calculatorDetailsSummary: string;
};

export type AdminMeetupRequest = SubmissionBase<EnquiryStatus> & {
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  topicSummary: string;
};

export type AdminCareerApplication = SubmissionBase<ApplicationStatus> & {
  candidateName: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  workLinks: string[];
  messageSummary: string;
};

export type AdminInternshipApplication = SubmissionBase<ApplicationStatus> & {
  candidateName: string;
  email: string;
  phone: string;
  internshipSlug: string;
  instituteName: string | null;
  course: string | null;
  state: string;
};

export type AdminDashboardSummaryResponse =
  | { success: true; counts: AdminDashboardSummary }
  | ApiErrorResponse;
export type AdminSubmissionListResponse<T> =
  | ({ success: true } & AdminSubmissionPage<T>)
  | ApiErrorResponse;
export type AdminSubmissionStatusUpdateResponse =
  | { success: true; id: string; status: EnquiryStatus | ApplicationStatus }
  | ApiErrorResponse;
