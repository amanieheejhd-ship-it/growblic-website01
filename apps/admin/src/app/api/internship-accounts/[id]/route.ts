import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyAdminJson(
    request,
    `/admin/internship-accounts/${encodeURIComponent(id)}`,
    {
      fallbackMessage: "Unable to update applicant account.",
    },
  );
}
