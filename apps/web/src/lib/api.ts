import type {
  CareerApplicationRequest,
  ContactRequest,
  FormSubmissionResponse,
  InternshipApplicationRequest,
  MeetingRequest,
  QuoteRequest,
} from "@growblic/contracts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://growblic-api.onrender.com";
const LEAD_REQUEST_TIMEOUT_MS = 10_000;
const WEBSITE_FORM_REQUEST_TIMEOUT_MS = 15_000;

function websiteSubmissionsUrl() {
  return process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL?.trim() || "";
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

export type LeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
  source?: string;
};

type LeadResponse = {
  success?: boolean;
  message?: string;
  leadId?: string;
};

export async function submitLead(
  path: "/leads/contact" | "/leads/start-project" | "/leads/meetup",
  payload: LeadPayload,
) {
  const { response, data } = await postJsonWithTimeout<LeadResponse>(
    `${API_BASE_URL}${path}`,
    payload,
    LEAD_REQUEST_TIMEOUT_MS,
  );

  if (!response.ok || !data?.success || !data.leadId) {
    throw new Error(data?.message || "Lead request failed.");
  }

  return data;
}

type WebsiteFormRequestMap = {
  "/api/contact/": ContactRequest & { submissionKey: string };
  "/api/careers/applications/": CareerApplicationRequest;
  "/api/internships/applications/": InternshipApplicationRequest;
  "/api/meeting-requests/": MeetingRequest;
  "/api/quote-requests/": QuoteRequest;
};

function submissionType<Path extends keyof WebsiteFormRequestMap>(
  path: Path,
  payload: WebsiteFormRequestMap[Path],
) {
  switch (path) {
    case "/api/contact/":
      return "contact";
    case "/api/careers/applications/":
      return "career-application";
    case "/api/internships/applications/":
      return "internship-application";
    case "/api/meeting-requests/":
      return "meetup-request";
    case "/api/quote-requests/":
      return (payload as QuoteRequest).calculatorData
        ? "price-calculator"
        : "project-request";
  }
}

export async function persistWebsiteForm<Path extends keyof WebsiteFormRequestMap>(
  path: Path,
  payload: WebsiteFormRequestMap[Path],
) {
  const edgeFunctionUrl = websiteSubmissionsUrl();
  const useEdgeFunction = edgeFunctionUrl.length > 0;
  const { response, data } = await postJsonWithTimeout<FormSubmissionResponse>(
    useEdgeFunction ? edgeFunctionUrl : path,
    useEdgeFunction
      ? { type: submissionType(path, payload), payload }
      : payload,
    WEBSITE_FORM_REQUEST_TIMEOUT_MS,
  );

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Form request failed.");
  }

  return data;
}
