import type { ApiSuccessResponse, ValidationErrorResponse } from "./common";

export type ContactField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "service"
  | "budget"
  | "message";

export type ContactRequest = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  website?: string;
};

export type NormalizedContact = Omit<ContactRequest, "website">;

export type ContactResponse =
  | (ApiSuccessResponse & { message: string })
  | ValidationErrorResponse<ContactField>;
