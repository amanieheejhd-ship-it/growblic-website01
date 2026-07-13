const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://growblic-api.onrender.com";

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as LeadResponse | null;

  if (!response.ok || !data?.success || !data.leadId) {
    throw new Error(data?.message || "Lead request failed.");
  }

  return data;
}

type WebsiteFormPath =
  | "/api/meeting-requests/"
  | "/api/quote-requests/";

export async function persistWebsiteForm(
  path: WebsiteFormPath,
  payload: Record<string, unknown>,
) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as LeadResponse | null;

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Form request failed.");
  }

  return data;
}
