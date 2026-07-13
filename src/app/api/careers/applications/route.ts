import { handleWebsiteFormPost } from "@/server/forms/form-api";
import { saveCareerApplication } from "@/server/forms/careers-application.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleWebsiteFormPost(request, saveCareerApplication);
}
