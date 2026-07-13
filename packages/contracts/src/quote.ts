import type { FormSubmissionResponse } from "./common";

export type QuoteRequest = {
  submissionKey: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  location?: string;
  service?: string;
  budget?: string;
  requirements: string;
  calculatorData?: Record<string, unknown>;
  source?: string;
  website?: string;
};

export type NormalizedQuoteRequest = Omit<
  QuoteRequest,
  | "website"
  | "email"
  | "phone"
  | "company"
  | "location"
  | "service"
  | "budget"
  | "calculatorData"
  | "source"
> & {
  email: string | null;
  phone: string | null;
  company: string | null;
  location: string | null;
  service: string | null;
  budget: string | null;
  calculatorData: Record<string, unknown> | null;
  source: string | null;
};

export type QuoteResponse = FormSubmissionResponse;
