import { handleWebsiteFormPost } from "@/server/forms/form-api";
import { saveInternshipApplication } from "@/server/forms/internship-application.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleWebsiteFormPost(request, saveInternshipApplication);
}
