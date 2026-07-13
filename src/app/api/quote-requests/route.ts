import { handleWebsiteFormPost } from "@/server/forms/form-api";
import { saveQuoteRequest } from "@/server/forms/quote-request.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleWebsiteFormPost(request, saveQuoteRequest);
}
