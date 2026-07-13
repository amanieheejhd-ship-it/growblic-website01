import "server-only";

import { FormValidationError } from "@growblic/validation";

const MAX_BODY_BYTES = 65_536;
const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

function json(body: object, status: number) {
  return Response.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

export async function handleWebsiteFormPost(
  request: Request,
  save: (input: Record<string, unknown>) => Promise<void>,
) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ success: false, message: "Please submit a valid request." }, 400);
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, message: "Please submit a valid request." }, 400);
    }

    body = JSON.parse(rawBody);
  } catch {
    return json({ success: false, message: "Please submit a valid request." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ success: false, message: "Please submit a valid request." }, 400);
  }

  const input = body as Record<string, unknown>;
  const honeypot = input.website;

  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return json({ success: true, message: "Thank you. Your request has been received." }, 201);
  }

  try {
    await save(input);
    return json({ success: true, message: "Thank you. Your request has been received." }, 201);
  } catch (error) {
    if (error instanceof FormValidationError) {
      return json({ success: false, message: error.message }, 400);
    }

    console.error("Website form submission could not be saved.");
    return json({ success: false, message: "Unable to submit your request right now." }, 500);
  }
}
