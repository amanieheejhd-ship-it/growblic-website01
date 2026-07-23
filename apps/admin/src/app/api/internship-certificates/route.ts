import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyAdminJson(request, "/admin/internship-certificates", {
    fallbackMessage: "Unable to complete the certificate request.",
  });
}
