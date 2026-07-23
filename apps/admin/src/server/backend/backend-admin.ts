import "server-only";

import { redirect } from "next/navigation";
import type {
  AdminDashboardSummary,
  AdminSubmissionKind,
  AdminSubmissionPage,
  ApplicantAccountView,
  InternshipCertificateListItem,
} from "@growblic/contracts";
import { getAdminSessionCookie } from "@/server/auth/admin-auth.cookies";
import { AdminAuthorizationError } from "@/server/errors/admin-authorization.error";

// The admin API is served by the admin-service (apps/services/admin-service).
const DEFAULT_BACKEND_INTERNAL_URL = "http://localhost:4002";

export const ADMIN_SESSION_TOKEN_HEADER = "x-admin-session-token";

export function backendInternalUrl() {
  const configured = process.env.BACKEND_INTERNAL_URL?.trim();
  return (configured || DEFAULT_BACKEND_INTERNAL_URL).replace(/\/$/, "");
}

export async function backendAdminFetch(
  path: string,
  init: {
    method?: string;
    token?: string | null;
    body?: string | null;
    headers?: Record<string, string>;
  } = {},
) {
  const headers: Record<string, string> = { ...init.headers };
  if (init.token) {
    headers[ADMIN_SESSION_TOKEN_HEADER] = init.token;
  }
  if (init.body && !headers["content-type"]) {
    headers["content-type"] = "application/json";
  }
  return fetch(`${backendInternalUrl()}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body ?? undefined,
    cache: "no-store",
  });
}

// Server-component data loader: mirrors the previous in-process guards by
// redirecting to the login page when unauthenticated and surfacing FORBIDDEN
// for sessions without the required role.
export async function fetchAdminPageData<T>(
  path: string,
  options: { notFound?: () => never } = {},
): Promise<T> {
  const token = await getAdminSessionCookie();
  if (!token) {
    redirect("/login/");
  }
  const response = await backendAdminFetch(path, { token });
  if (response.status === 401) {
    redirect("/login/");
  }
  if (response.status === 403) {
    throw new AdminAuthorizationError("FORBIDDEN");
  }
  if (response.status === 404 && options.notFound) {
    return options.notFound();
  }
  if (!response.ok) {
    throw new Error(`Admin backend request failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

export async function fetchAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const payload = await fetchAdminPageData<{ success: true; counts: AdminDashboardSummary }>(
    "/admin/dashboard/summary",
  );
  return payload.counts;
}

export type SubmissionPageQuery = {
  page: number;
  pageSize: number;
  search: string;
  status: string | null;
};

export async function fetchAdminSubmissionPage<T>(
  kind: AdminSubmissionKind,
  query: SubmissionPageQuery,
  extraParams: Record<string, string> = {},
): Promise<AdminSubmissionPage<T>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  for (const [name, value] of Object.entries(extraParams)) {
    params.set(name, value);
  }
  const payload = await fetchAdminPageData<
    { success: true } & AdminSubmissionPage<T>
  >(`/admin/submissions/${kind}?${params.toString()}`);
  return { items: payload.items, pagination: payload.pagination };
}

export type AdminInternshipCertificateListItem = InternshipCertificateListItem & {
  paymentAmountPaise: number;
  paymentGateway: string;
};

export async function fetchInternshipCertificateList(query: {
  page: number;
  pageSize: number;
  search: string;
  status: string | null;
  filter: string | null;
}): Promise<AdminSubmissionPage<AdminInternshipCertificateListItem>> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("pageSize", String(query.pageSize));
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.filter) params.set("filter", query.filter);
  const payload = await fetchAdminPageData<
    { success: true } & AdminSubmissionPage<AdminInternshipCertificateListItem>
  >(`/admin/internship-certificates?${params.toString()}`);
  return { items: payload.items, pagination: payload.pagination };
}

// JSON-serialized certificate detail returned by the backend admin module.
export type AdminCertificateDetailPayload = {
  certificate: {
    id: string;
    status: string;
    domainRole: string | null;
    designation: string | null;
    projectWork: string | null;
    performanceSummary: string | null;
    conductNote: string | null;
    remarks: string | null;
    durationDays: number;
    joiningDate: string | null;
    completionDate: string | null;
    generatedAt: string | null;
    issuedAt: string | null;
    emailedAt: string | null;
    emailStatus: string;
    reminderStatus: string;
    publicReference: string | null;
    certificateNumber: string | null;
    skills: Array<{ id: string; name: string; position: number }>;
    emailAttempts: Array<{
      id: string;
      kind: string;
      successful: boolean;
      attemptedAt: string;
    }>;
    application: {
      candidateName: string;
      email: string;
      phone: string;
      submissionKey: string;
      applicantAccount: {
        emailDisplay: string;
        status: string;
        lastLoginAt: string | null;
        createdAt: string;
      } | null;
    };
    payment: {
      status: string;
      internshipProgram: string;
      internshipStartedAt: string | null;
      joiningDate: string | null;
      expectedCompletionAt: string | null;
      offerLetterGeneratedAt: string | null;
      confirmationIssuedAt: string | null;
      certificateAvailableAt: string | null;
    };
  };
  audits: Array<{ id: string; action: string; createdAt: string }>;
};

export async function fetchInternshipCertificateDetail(
  id: string,
  notFound: () => never,
): Promise<AdminCertificateDetailPayload> {
  const payload = await fetchAdminPageData<{
    success: true;
    result: AdminCertificateDetailPayload;
  }>(`/admin/internship-certificates/${encodeURIComponent(id)}`, { notFound });
  return payload.result;
}

export async function fetchInternshipApplicantAccounts(): Promise<ApplicantAccountView[]> {
  const payload = await fetchAdminPageData<{
    success: true;
    accounts: ApplicantAccountView[];
  }>("/admin/internship-accounts");
  return payload.accounts;
}
