import type {
  CareerApplicationRequest,
  ContactRequest,
  FormSubmissionResponse,
  InternshipApplicationRequest,
  MeetingRequest,
  QuoteRequest,
} from "@growblic/contracts";

const WEBSITE_FORM_REQUEST_TIMEOUT_MS = 15_000;
export const LOCAL_BACKEND_CONNECTION_ERROR =
  "Cannot connect to the local backend at http://127.0.0.1:4000. Make sure the backend is running.";

export function growblicApiUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!configured) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }
  return joinApiUrl(configured, path);
}

// Public form submissions are served by the submissions-service. A dedicated
// origin can be configured; without it the primary API origin is used so a
// single-origin gateway deployment keeps working.
export function submissionsApiUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_SUBMISSIONS_API_URL?.trim();
  if (configured) {
    return joinApiUrl(configured, path);
  }
  return growblicApiUrl(path);
}

function joinApiUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export async function fetchGrowblicApi(path: string, init?: RequestInit) {
  try {
    return await fetch(growblicApiUrl(path), {
      credentials: "include",
      ...init,
    });
  } catch {
    throw new Error(LOCAL_BACKEND_CONNECTION_ERROR);
  }
}

async function postJsonWithTimeout<T>(
  url: string,
  payload: unknown,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => null)) as T | null;

    return { response, data };
  } finally {
    clearTimeout(timeout);
  }
}

type WebsiteFormRequestMap = {
  "/api/contact/": ContactRequest & { submissionKey: string };
  "/api/careers/applications/": CareerApplicationRequest;
  "/api/internships/applications/": InternshipApplicationRequest;
  "/api/meeting-requests/": MeetingRequest;
  "/api/quote-requests/": QuoteRequest;
};

function submissionEndpoint<Path extends keyof WebsiteFormRequestMap>(
  path: Path,
  payload: WebsiteFormRequestMap[Path],
) {
  switch (path) {
    case "/api/contact/":
      return "/public-submissions/contact";
    case "/api/careers/applications/":
      return "/public-submissions/career-applications";
    case "/api/internships/applications/":
      return "/public-submissions/internship-applications";
    case "/api/meeting-requests/":
      return "/public-submissions/meetups";
    case "/api/quote-requests/":
      return (payload as QuoteRequest).calculatorData
        ? "/public-submissions/price-calculator"
        : "/public-submissions/project-requests";
  }
}

export async function persistWebsiteForm<Path extends keyof WebsiteFormRequestMap>(
  path: Path,
  payload: WebsiteFormRequestMap[Path],
) {
  const { response, data } = await postJsonWithTimeout<FormSubmissionResponse>(
    submissionsApiUrl(submissionEndpoint(path, payload)),
    payload,
    WEBSITE_FORM_REQUEST_TIMEOUT_MS,
  );

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Form request failed.");
  }

  return { ...data, status: response.status };
}
