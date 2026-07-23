import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyAdminJson(
    request,
    `/admin/submissions/meetup-requests/${encodeURIComponent(id)}`,
    {
      errorMessages: { 404: "Submission not found." },
      fallbackMessage: "Unable to complete the admin submission request.",
    },
  );
}
