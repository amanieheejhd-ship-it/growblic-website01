import { prisma } from "@growblic/database";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;
const SUCCESS_MESSAGE = "Thank you. Your enquiry has been received.";
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

type FieldName =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "service"
  | "budget"
  | "message";

type NormalizedContact = Record<FieldName, string | undefined> & {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<FieldName, string>>;

function json(body: object, status: number) {
  return Response.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function getTrimmedString(
  input: Record<string, unknown>,
  field: FieldName,
  fieldErrors: FieldErrors,
  options: { required?: boolean; min?: number; max: number },
) {
  const value = input[field];

  if (value === undefined || value === null || value === "") {
    if (options.required) {
      fieldErrors[field] = `${field[0].toUpperCase()}${field.slice(1)} is required.`;
    }
    return undefined;
  }

  if (typeof value !== "string") {
    fieldErrors[field] = `${field[0].toUpperCase()}${field.slice(1)} must be text.`;
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized && options.required) {
    fieldErrors[field] = `${field[0].toUpperCase()}${field.slice(1)} is required.`;
  } else if (options.min && normalized.length < options.min) {
    fieldErrors[field] = `${field[0].toUpperCase()}${field.slice(1)} must be at least ${options.min} characters.`;
  } else if (normalized.length > options.max) {
    fieldErrors[field] = `${field[0].toUpperCase()}${field.slice(1)} must be at most ${options.max} characters.`;
  }

  return normalized || undefined;
}

function validateContact(input: Record<string, unknown>) {
  const fieldErrors: FieldErrors = {};
  const name = getTrimmedString(input, "name", fieldErrors, {
    required: true,
    min: 2,
    max: 100,
  });
  const email = getTrimmedString(input, "email", fieldErrors, {
    required: true,
    max: 254,
  })?.toLowerCase();
  const phone = getTrimmedString(input, "phone", fieldErrors, { max: 30 });
  const company = getTrimmedString(input, "company", fieldErrors, { max: 120 });
  const service = getTrimmedString(input, "service", fieldErrors, { max: 120 });
  const budget = getTrimmedString(input, "budget", fieldErrors, { max: 100 });
  const message = getTrimmedString(input, "message", fieldErrors, {
    required: true,
    min: 10,
    max: 3000,
  });

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (Object.keys(fieldErrors).length > 0 || !name || !email || !message) {
    return { fieldErrors };
  }

  const data: NormalizedContact = {
    name,
    email,
    phone,
    company,
    service,
    budget,
    message,
  };

  return { data };
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

  if (!result.data) {
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
