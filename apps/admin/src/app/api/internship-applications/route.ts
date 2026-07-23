import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyAdminJson(request, "/admin/submissions/internship-applications", {
    fallbackMessage: "Unable to complete the admin submission request.",
  });
}
