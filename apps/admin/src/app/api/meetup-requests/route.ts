import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyAdminJson(request, "/admin/submissions/meetup-requests", {
    fallbackMessage: "Unable to complete the admin submission request.",
  });
}
