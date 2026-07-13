import "server-only";

import type { AdminSubmissionKind, AdminSubmissionListResponse, AdminSubmissionStatusUpdateResponse, ApplicationStatus, EnquiryStatus } from "@growblic/contracts";
import { FormValidationError, readAdminSubmissionId, readAdminSubmissionQuery, readAdminStatusUpdate } from "@growblic/validation";
import { requireAdminRole } from "@/server/auth/require-admin-session";
import { AdminAuthorizationError } from "@/server/errors/admin-authorization.error";
import type { SubmissionListQuery } from "./admin-submissions.repository";
import { updateAdminSubmissionStatus } from "./admin-submissions.repository";

export const ADMIN_NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export function adminSubmissionApiError(error: unknown, operation: string) {
  if (error instanceof FormValidationError) return Response.json({ success: false, message: error.message }, { status: 400, headers: ADMIN_NO_STORE_HEADERS });
  if (error instanceof AdminAuthorizationError) return Response.json({ success: false, message: error.message }, { status: error.code === "UNAUTHENTICATED" ? 401 : 403, headers: ADMIN_NO_STORE_HEADERS });
  console.error(`Admin submissions ${operation} could not be completed.`);
  return Response.json({ success: false, message: "Unable to complete the admin submission request." }, { status: 500, headers: ADMIN_NO_STORE_HEADERS });
}

export function createAdminSubmissionListHandler<T>(allowedStatuses: readonly string[], list: (query: SubmissionListQuery) => Promise<{ items: T[]; pagination: { page: number; pageSize: number; total: number; totalPages: number } }>) {
  return async function GET(request: Request) {
    try {
      await requireAdminRole(["SUPER_ADMIN"]);
      const result = await list(readAdminSubmissionQuery(new URL(request.url), allowedStatuses));
      return Response.json({ success: true, ...result } satisfies AdminSubmissionListResponse<T>, { status: 200, headers: ADMIN_NO_STORE_HEADERS });
    } catch (error) { return adminSubmissionApiError(error, "list"); }
  };
}

export function createAdminSubmissionStatusHandler(kind: AdminSubmissionKind, allowedStatuses: readonly string[]) {
  return async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
      const session = await requireAdminRole(["SUPER_ADMIN"]);
      const id = readAdminSubmissionId((await context.params).id);
      let input: unknown;
      try { input = await request.json(); } catch { throw new FormValidationError("Invalid status update."); }
      const status = readAdminStatusUpdate(input, allowedStatuses) as EnquiryStatus | ApplicationStatus;
      const result = await updateAdminSubmissionStatus(kind, id, status, session.user.id);
      if (!result) return Response.json({ success: false, message: "Submission not found." } satisfies AdminSubmissionStatusUpdateResponse, { status: 404, headers: ADMIN_NO_STORE_HEADERS });
      return Response.json({ success: true, ...result } satisfies AdminSubmissionStatusUpdateResponse, { status: 200, headers: ADMIN_NO_STORE_HEADERS });
    } catch (error) { return adminSubmissionApiError(error, "status update"); }
  };
}
