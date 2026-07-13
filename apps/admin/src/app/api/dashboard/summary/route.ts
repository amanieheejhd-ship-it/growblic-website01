import type { AdminDashboardSummaryResponse } from "@growblic/contracts";
import { requireAdminRole } from "@/server/auth/require-admin-session";
import { ADMIN_NO_STORE_HEADERS, adminSubmissionApiError } from "@/server/submissions/admin-submissions.api";
import { getAdminDashboardSummary } from "@/server/submissions/admin-submissions.repository";

export const runtime = "nodejs";
export async function GET() {
  try {
    await requireAdminRole(["SUPER_ADMIN"]);
    const counts = await getAdminDashboardSummary();
    return Response.json({ success: true, counts } satisfies AdminDashboardSummaryResponse, { status: 200, headers: ADMIN_NO_STORE_HEADERS });
  } catch (error) { return adminSubmissionApiError(error, "dashboard summary"); }
}
