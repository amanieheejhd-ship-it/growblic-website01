import { FormValidationError, readInternshipCertificateId } from "@growblic/validation";
import { ADMIN_NO_STORE_HEADERS, proxyAdminPdf } from "@/server/backend/admin-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  let id: string;
  try {
    id = readInternshipCertificateId((await context.params).id);
  } catch (error) {
    const message = error instanceof FormValidationError
      ? error.message
      : "Invalid certificate identifier.";
    return Response.json(
      { success: false, message },
      { status: 400, headers: ADMIN_NO_STORE_HEADERS },
    );
  }
  return proxyAdminPdf(
    request,
    `/admin/internship-certificates/${encodeURIComponent(id)}/preview`,
    {
      unavailableMessage: "Certificate preview is unavailable.",
      notFoundMessage: "Complete the joining date and skills before previewing.",
      defaultFilename: "Growblic-Internship-Certificate-Preview.pdf",
    },
  );
}
