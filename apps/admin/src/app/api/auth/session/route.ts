import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyAdminJson(request, "/admin/auth/session", {
    fallbackMessage: "Unable to validate admin session.",
  });
}
