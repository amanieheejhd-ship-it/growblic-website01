import { growblicApiUrl } from "./api";

// One-time dev confirmation of which origin the accounts-service calls resolve
// to. This makes a "Cannot reach the accounts service" error immediately
// diagnosable — the console shows the exact base URL the browser is hitting, so
// a wrong/unset NEXT_PUBLIC_ACCOUNTS_API_URL or a down service on that port is
// obvious. Browser + development only; never logs during SSR/prerender/build.
let accountsOriginLogged = false;
function logAccountsOriginOnce(base: string) {
  if (accountsOriginLogged) return;
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "production") return;
  accountsOriginLogged = true;
  console.info(
    `[accounts] API base → ${base} ` +
      `(configure NEXT_PUBLIC_ACCOUNTS_API_URL; accounts-service must be running there — pnpm dev:accounts)`,
  );
}

// Public user accounts are served by the accounts-service. A dedicated origin
// can be configured; without it the primary API origin is used so a
// single-origin gateway deployment keeps working (mirrors submissionsApiUrl).
export function accountsApiUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_ACCOUNTS_API_URL?.trim();
  const normalizedPath = path.replace(/^\/+/, "");
  if (configured) {
    const normalizedBase = configured.replace(/\/+$/, "");
    logAccountsOriginOnce(normalizedBase);
    return `${normalizedBase}/${normalizedPath}`;
  }
  logAccountsOriginOnce(
    (process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/+$/, "") ??
      "(NEXT_PUBLIC_API_URL unset)") + " [fallback]",
  );
  return growblicApiUrl(path);
}

export type PublicUser = {
  id: string;
  email: string;
  displayName?: string | null;
  status?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string | null;
  // Extended profile fields returned by GET/PATCH /public-auth/me.
  fullName?: string | null;
  phone?: string | null;
  company?: string | null;
};

type AuthUserResponse = {
  success: true;
  user: PublicUser;
};

type MessageResponse = {
  success: true;
  message: string;
};

type ErrorEnvelope = {
  statusCode?: number;
  error?: { code?: string; message?: string };
  requestId?: string;
  timestamp?: string;
};

const GENERIC_ERROR = "Something went wrong. Please try again.";
const NETWORK_ERROR =
  "Cannot reach the accounts service. Please try again in a moment.";

async function accountsFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(accountsApiUrl(path), {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      ...init,
    });
  } catch {
    throw new Error(NETWORK_ERROR);
  }
}

// Parse a JSON response; on a non-ok status throw an Error carrying the
// envelope's error.message (falling back to a generic message).
async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | (T & Partial<ErrorEnvelope>)
    | null;

  if (!response.ok) {
    const message =
      (data as ErrorEnvelope | null)?.error?.message?.trim() || GENERIC_ERROR;
    throw new Error(message);
  }

  if (!data) {
    throw new Error(GENERIC_ERROR);
  }

  return data as T;
}

function jsonBody(payload: unknown): RequestInit {
  return { method: "POST", body: JSON.stringify(payload) };
}

export async function registerUser(payload: {
  email: string;
  password: string;
  displayName?: string;
}): Promise<PublicUser> {
  const data = await parseJson<AuthUserResponse>(
    await accountsFetch("/public-auth/register", jsonBody(payload)),
  );
  return data.user;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<PublicUser> {
  const data = await parseJson<AuthUserResponse>(
    await accountsFetch("/public-auth/login", jsonBody(payload)),
  );
  return data.user;
}

export async function logoutUser(): Promise<void> {
  await parseJson<{ success: true }>(
    await accountsFetch("/public-auth/logout", { method: "POST" }),
  );
}

// Returns the signed-in user, or null when the session is absent (401).
export async function getSession(): Promise<PublicUser | null> {
  const response = await accountsFetch("/public-auth/session", {
    method: "GET",
  });
  if (response.status === 401) {
    return null;
  }
  const data = await parseJson<AuthUserResponse>(response);
  return data.user;
}

export async function forgotPassword(payload: {
  email: string;
}): Promise<string> {
  const data = await parseJson<MessageResponse>(
    await accountsFetch("/public-auth/forgot-password", jsonBody(payload)),
  );
  return data.message;
}

export async function resetPassword(payload: {
  token: string;
  password: string;
}): Promise<string> {
  const data = await parseJson<MessageResponse>(
    await accountsFetch("/public-auth/reset-password", jsonBody(payload)),
  );
  return data.message;
}

// Returns the full profile, or null when unauthenticated (401).
export async function getProfile(): Promise<PublicUser | null> {
  const response = await accountsFetch("/public-auth/me", { method: "GET" });
  if (response.status === 401) {
    return null;
  }
  const data = await parseJson<AuthUserResponse>(response);
  return data.user;
}

export async function updateProfile(payload: {
  displayName?: string;
  fullName?: string;
  phone?: string;
  company?: string;
}): Promise<PublicUser> {
  const data = await parseJson<AuthUserResponse>(
    await accountsFetch("/public-auth/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  );
  return data.user;
}

// SSO bridge: ask internship-service to log the CURRENT public user into their
// matching internship applicant account. The identity is derived server-side
// from the growblic_user_session cookie (sent via credentials:"include") and
// validated internship→accounts server-to-server — NO email is sent from the
// browser. Returns whether an internship session was established. This call
// targets the internship-service origin (growblicApiUrl), not accounts-service.
// Any failure resolves to { linked: false } so the caller safely falls back to
// the portal's normal login.
export async function bridgeIntoInternshipPortal(): Promise<{ linked: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      growblicApiUrl("/internship-portal/auth/sso-from-public"),
      {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      },
    );
    if (!response.ok) return { linked: false };
    const data = (await response.json().catch(() => null)) as
      | { linked?: boolean }
      | null;
    return { linked: Boolean(data?.linked) };
  } catch {
    return { linked: false };
  } finally {
    clearTimeout(timeout);
  }
}
