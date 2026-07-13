import { prisma } from "@growblic/database";
import { validateContact } from "@growblic/validation";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const SUCCESS_MESSAGE = "Thank you. Your enquiry has been received.";
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function json(body: object, status: number) {
  return Response.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ success: false, message: "The submitted form is too large." }, 400);
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, message: "The submitted form is too large." }, 400);
    }

    body = JSON.parse(rawBody);
  } catch {
    return json({ success: false, message: "Please submit a valid form." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ success: false, message: "Please submit a valid form." }, 400);
  }

  const input = body as Record<string, unknown>;

  if (
    input.website !== undefined &&
    input.website !== null &&
    String(input.website).trim()
  ) {
    return json({ success: true, message: SUCCESS_MESSAGE }, 201);
  }

  const result = validateContact(input);

  if (!result.success) {
    return json(
      {
        success: false,
        message: "Please correct the highlighted fields and try again.",
        fieldErrors: result.fieldErrors,
      },
      400,
    );
  }

  try {
    await prisma.contactEnquiry.create({ data: result.data });

    return json({ success: true, message: SUCCESS_MESSAGE }, 201);
  } catch {
    console.error("Contact enquiry could not be saved.");
    return json(
      { success: false, message: "We could not submit your enquiry. Please try again later." },
      500,
    );
  }
}
