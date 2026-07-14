export const MAX_BODY_BYTES = 65_536;

export const DEFAULT_ALLOWED_ORIGINS = new Set([
  "https://amanieheejhd-ship-it.github.io",
]);

export type SubmissionType =
  | "contact"
  | "project-request"
  | "price-calculator"
  | "meetup-request"
  | "career-application"
  | "internship-application";

export type SubmissionWrite = {
  table: string;
  conflictColumn: string;
  row: Record<string, unknown>;
};

export type SubmissionWriter = (submission: SubmissionWrite) => Promise<void>;

class SubmissionValidationError extends Error {}

const SUCCESS_MESSAGE = "Thank you. Your request has been received.";
const SAFE_ERROR_MESSAGE = "Unable to submit your request right now.";
const JSON_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
};

function isAllowedOrigin(origin: string, allowedOrigins: ReadonlySet<string>) {
  if (allowedOrigins.has(origin)) return true;

  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      url.username === "" &&
      url.password === ""
    );
  } catch {
    return false;
  }
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: object, status: number, origin?: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...(origin ? corsHeaders(origin) : {}),
    },
  });
}

function validationError(message = "Please check the submitted information and try again.") {
  throw new SubmissionValidationError(message);
}

function readString(
  input: Record<string, unknown>,
  key: string,
  options: { min?: number; max: number; required?: boolean },
) {
  const value = input[key];

  if (value === undefined || value === null || value === "") {
    if (options.required) validationError();
    return null;
  }

  if (typeof value !== "string") validationError();

  const normalized = value.normalize("NFKC").trim();
  const minimum = options.min ?? 0;

  if (
    (options.required && normalized.length === 0) ||
    normalized.length < minimum ||
    normalized.length > options.max
  ) {
    validationError();
  }

  return normalized || null;
}

function readEmail(input: Record<string, unknown>, key: string, required = false) {
  const value = readString(input, key, { max: 254, required });
  if (!value) return null;

  const normalized = value.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    validationError("Please provide a valid email address.");
  }

  return normalized;
}

function readSubmissionKey(input: Record<string, unknown>) {
  const value = readString(input, "submissionKey", {
    min: 8,
    max: 100,
    required: true,
  });

  if (!value || !/^[a-zA-Z0-9_-]+$/.test(value)) validationError();
  return value;
}

function readObject(input: Record<string, unknown>, key: string) {
  const value = input[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) validationError();
  return value as Record<string, unknown>;
}

function readUrlList(input: Record<string, unknown>, key: string) {
  const value = input[key];
  if (!Array.isArray(value) || value.length === 0 || value.length > 10) {
    validationError();
  }

  const urls = value.map((item) => {
    if (typeof item !== "string" || item.length > 2_048) validationError();

    let parsed: URL;
    try {
      parsed = new URL(item.trim());
    } catch {
      validationError("Please provide valid work links.");
    }

    if (
      !["http:", "https:", "mailto:"].includes(parsed!.protocol) ||
      parsed!.username ||
      parsed!.password
    ) {
      validationError("Please provide valid work links.");
    }

    return parsed!.toString();
  });

  return [...new Set(urls)];
}

function timestamps() {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now, created_at: now, updated_at: now };
}

function contactWrite(input: Record<string, unknown>): SubmissionWrite {
  const submissionKey = readSubmissionKey(input);
  const name = readString(input, "name", { min: 2, max: 100, required: true })!;
  const email = readEmail(input, "email", true)!;
  const message = readString(input, "message", { min: 10, max: 3_000, required: true })!;
  const { createdAt, updatedAt } = timestamps();

  return {
    table: "contact_enquiries",
    conflictColumn: "id",
    row: {
      id: `contact_${submissionKey}`,
      name,
      email,
      phone: readString(input, "phone", { max: 30 }),
      company: readString(input, "company", { max: 120 }),
      service: readString(input, "service", { max: 120 }),
      budget: readString(input, "budget", { max: 100 }),
      message,
      createdAt,
      updatedAt,
    },
  };
}

function quoteWrite(
  type: "project-request" | "price-calculator",
  input: Record<string, unknown>,
): SubmissionWrite {
  const calculatorData = readObject(input, "calculatorData");

  if (type === "price-calculator" && !calculatorData) validationError();
  if (type === "project-request" && calculatorData) validationError();

  const { created_at, updated_at } = timestamps();

  return {
    table: "quote_requests",
    conflictColumn: "submission_key",
    row: {
      id: crypto.randomUUID(),
      submission_key: readSubmissionKey(input),
      name: readString(input, "name", { min: 2, max: 120, required: true })!,
      email: readEmail(input, "email"),
      phone: readString(input, "phone", { max: 30 }),
      company: readString(input, "company", { max: 160 }),
      location: readString(input, "location", { max: 160 }),
      service: readString(input, "service", { max: 160 }),
      budget: readString(input, "budget", { max: 120 }),
      requirements: readString(input, "requirements", {
        min: 3,
        max: 10_000,
        required: true,
      })!,
      calculator_data: calculatorData,
      source:
        type === "price-calculator"
          ? "price-calculator"
          : readString(input, "source", { max: 100 }),
      created_at,
      updated_at,
    },
  };
}

function meetupWrite(input: Record<string, unknown>): SubmissionWrite {
  const { created_at, updated_at } = timestamps();

  return {
    table: "meeting_requests",
    conflictColumn: "submission_key",
    row: {
      id: crypto.randomUUID(),
      submission_key: readSubmissionKey(input),
      name: readString(input, "name", { min: 2, max: 120, required: true })!,
      email: readEmail(input, "email"),
      phone: readString(input, "phone", { max: 30 }),
      message: readString(input, "message", {
        min: 3,
        max: 3_000,
        required: true,
      })!,
      source: readString(input, "source", { max: 100 }),
      created_at,
      updated_at,
    },
  };
}

function careerWrite(input: Record<string, unknown>): SubmissionWrite {
  const { created_at, updated_at } = timestamps();

  return {
    table: "career_applications",
    conflictColumn: "submission_key",
    row: {
      id: crypto.randomUUID(),
      submission_key: readSubmissionKey(input),
      candidate_name: readString(input, "fullName", {
        min: 2,
        max: 120,
        required: true,
      })!,
      email: readEmail(input, "email", true)!,
      phone: readString(input, "phone", { min: 5, max: 30, required: true })!,
      role: readString(input, "role", { min: 2, max: 120, required: true })!,
      experience: readString(input, "experience", {
        min: 2,
        max: 80,
        required: true,
      })!,
      work_links: readUrlList(input, "workLinks"),
      message: readString(input, "message", {
        min: 10,
        max: 3_000,
        required: true,
      })!,
      created_at,
      updated_at,
    },
  };
}

function internshipWrite(input: Record<string, unknown>): SubmissionWrite {
  const internshipSlug = readString(input, "internshipSlug", {
    min: 2,
    max: 100,
    required: true,
  });
  const enrollment = readString(input, "instituteEnrollment", {
    max: 3,
    required: true,
  });

  if (!internshipSlug || !/^[a-z0-9-]+$/.test(internshipSlug)) validationError();
  if (enrollment !== "Yes" && enrollment !== "No") validationError();

  const enrolled = enrollment === "Yes";
  const { created_at, updated_at } = timestamps();

  return {
    table: "internship_applications",
    conflictColumn: "submission_key",
    row: {
      id: crypto.randomUUID(),
      submission_key: readSubmissionKey(input),
      internship_slug: internshipSlug,
      candidate_name: readString(input, "fullName", {
        min: 2,
        max: 120,
        required: true,
      })!,
      email: readEmail(input, "email", true)!,
      phone: readString(input, "phone", { min: 5, max: 30, required: true })!,
      state: readString(input, "state", { min: 2, max: 100, required: true })!,
      institute_enrollment: enrollment,
      institute_name: enrolled
        ? readString(input, "instituteName", { min: 2, max: 180, required: true })
        : null,
      course: enrolled
        ? readString(input, "course", { min: 2, max: 120, required: true })
        : null,
      enrollment_number: enrolled
        ? readString(input, "enrollmentNumber", { min: 2, max: 100, required: true })
        : null,
      highest_qualification: enrolled
        ? null
        : readString(input, "highestQualification", {
            min: 2,
            max: 120,
            required: true,
          }),
      passing_year: enrolled
        ? null
        : readString(input, "passingYear", { min: 4, max: 4, required: true }),
      message: readString(input, "message", { max: 2_000 }),
      created_at,
      updated_at,
    },
  };
}

function toWrite(type: SubmissionType, input: Record<string, unknown>) {
  switch (type) {
    case "contact":
      return contactWrite(input);
    case "project-request":
    case "price-calculator":
      return quoteWrite(type, input);
    case "meetup-request":
      return meetupWrite(input);
    case "career-application":
      return careerWrite(input);
    case "internship-application":
      return internshipWrite(input);
  }
}

function readEnvelope(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) validationError();

  const envelope = body as Record<string, unknown>;
  const type = envelope.type;
  const payload = envelope.payload;
  const supported: SubmissionType[] = [
    "contact",
    "project-request",
    "price-calculator",
    "meetup-request",
    "career-application",
    "internship-application",
  ];

  if (typeof type !== "string" || !supported.includes(type as SubmissionType)) {
    validationError();
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) validationError();

  return { type: type as SubmissionType, payload: payload as Record<string, unknown> };
}

export function createWebsiteSubmissionsHandler({
  write,
  allowedOrigins = DEFAULT_ALLOWED_ORIGINS,
}: {
  write: SubmissionWriter;
  allowedOrigins?: ReadonlySet<string>;
}) {
  return async function handleWebsiteSubmission(request: Request) {
    const origin = request.headers.get("origin") ?? "";

    if (!isAllowedOrigin(origin, allowedOrigins)) {
      return json({ success: false, message: "Origin is not allowed." }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ success: false, message: "Method not allowed." }), {
        status: 405,
        headers: { ...JSON_HEADERS, ...corsHeaders(origin), Allow: "POST, OPTIONS" },
      });
    }

    const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim();
    if (contentType !== "application/json") {
      return json({ success: false, message: "Please submit JSON." }, 415, origin);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return json({ success: false, message: "Please submit a valid request." }, 400, origin);
    }

    let body: unknown;

    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return json({ success: false, message: "Please submit a valid request." }, 400, origin);
      }
      body = JSON.parse(rawBody);
    } catch {
      return json({ success: false, message: "Please submit a valid request." }, 400, origin);
    }

    try {
      const { type, payload } = readEnvelope(body);
      const honeypot = payload.website;

      if (typeof honeypot === "string" && honeypot.trim().length > 0) {
        return json({ success: true, message: SUCCESS_MESSAGE }, 201, origin);
      }

      await write(toWrite(type, payload));
      return json({ success: true, message: SUCCESS_MESSAGE }, 201, origin);
    } catch (error) {
      if (error instanceof SubmissionValidationError) {
        return json({ success: false, message: error.message }, 400, origin);
      }

      return json({ success: false, message: SAFE_ERROR_MESSAGE }, 500, origin);
    }
  };
}
