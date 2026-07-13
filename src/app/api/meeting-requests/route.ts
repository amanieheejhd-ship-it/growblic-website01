import { handleWebsiteFormPost } from "@/server/forms/form-api";
import { saveMeetingRequest } from "@/server/forms/meeting-request.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleWebsiteFormPost(request, saveMeetingRequest);
}
