import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return proxyAdminJson(request, "/admin/submissions/price-calculator-leads", {
    fallbackMessage: "Unable to complete the admin submission request.",
  });
}
