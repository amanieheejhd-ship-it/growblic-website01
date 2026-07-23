import { proxyAdminJson } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyAdminJson(
    request,
    `/admin/internship-certificates/${encodeURIComponent(id)}`,
    {
      errorMessages: { 404: "Certificate not found." },
      fallbackMessage: "Unable to complete the certificate request.",
    },
  );
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyAdminJson(
    request,
    `/admin/internship-certificates/${encodeURIComponent(id)}`,
    {
      errorMessages: { 404: "Certificate not found." },
      fallbackMessage: "Unable to complete the certificate request.",
    },
  );
}
