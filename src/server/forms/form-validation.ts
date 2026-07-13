import "server-only";

export class FormValidationError extends Error {
  constructor(message = "Please check the submitted information and try again.") {
    super(message);
    this.name = "FormValidationError";
  }
}

type StringOptions = {
  min?: number;
  max: number;
  required?: boolean;
};

export function readString(
  input: Record<string, unknown>,
  key: string,
  { min = 0, max, required = false }: StringOptions,
) {
  const value = input[key];

  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new FormValidationError();
    }

    return null;
  }

  if (typeof value !== "string") {
    throw new FormValidationError();
  }

  const normalized = value.normalize("NFKC").trim();

  if ((required && normalized.length === 0) || normalized.length < min || normalized.length > max) {
    throw new FormValidationError();
  }

  return normalized || null;
}

export function readEmail(
  input: Record<string, unknown>,
  key: string,
  required = false,
) {
  const value = readString(input, key, { max: 254, required });

  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new FormValidationError("Please provide a valid email address.");
  }

  return normalized;
}

export function readSubmissionKey(input: Record<string, unknown>) {
  const value = readString(input, "submissionKey", {
    min: 8,
    max: 100,
    required: true,
  });

  if (!value || !/^[a-zA-Z0-9_-]+$/.test(value)) {
    throw new FormValidationError();
  }

  return value;
}

export function readUrlList(
  input: Record<string, unknown>,
  key: string,
  maximumItems: number,
) {
  const value = input[key];

  if (!Array.isArray(value) || value.length === 0 || value.length > maximumItems) {
    throw new FormValidationError();
  }

  const urls = value.map((item) => {
    if (typeof item !== "string" || item.length > 2_048) {
      throw new FormValidationError();
    }

    let parsed: URL;

    try {
      parsed = new URL(item.trim());
    } catch {
      throw new FormValidationError("Please provide valid work links.");
    }

    if (
      !["http:", "https:", "mailto:"].includes(parsed.protocol) ||
      parsed.username ||
      parsed.password
    ) {
      throw new FormValidationError("Please provide valid work links.");
    }

    return parsed.toString();
  });

  return [...new Set(urls)];
}

export function readOptionalJsonObject(
  input: Record<string, unknown>,
  key: string,
) {
  const value = input[key];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new FormValidationError();
  }

  return value as Record<string, unknown>;
}
