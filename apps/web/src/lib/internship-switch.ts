// Client-only state for the "switch account to continue your internship
// application" flow. It lives in sessionStorage (per-tab, cleared on completion)
// so NO personal data (emails, form answers) ever travels in a URL query string.
//
// The flow spans three client pages within one tab:
//   /internships/<slug>  → user (signed in as A) types email B and chooses to
//                          switch → we snapshot the in-progress form here, revoke
//                          A's session, and send them to /login.
//   /login or /register  → prefilled with B; on successful auth we stamp the
//                          authenticated email + stage "authenticated" and return.
//   /internships/<slug>  → we restore the form, lock the email to the now
//                          authenticated address, and let them confirm-and-submit.

const STORAGE_KEY = "growblic:internship-application-switch";

// Fields we snapshot from the internship form (everything except email, which is
// always re-derived from the authenticated session on return).
export type InternshipSwitchForm = {
  fullName: string;
  phone: string;
  state: string;
  instituteEnrollment: string;
  instituteName: string;
  course: string;
  enrollmentNumber: string;
  highestQualification: string;
  passingYear: string;
  message: string;
};

export type InternshipSwitchPayload = {
  stage: "pending-auth" | "authenticated";
  // Before auth: the email to sign in as (prefill). After auth: the actual
  // authenticated email (source of truth for the restored form).
  email: string;
  slug: string;
  returnTo: string;
  form: InternshipSwitchForm;
};

// trim + lowercase — matches how both accounts-service and internship-service
// normalize emails for identity comparison. Used ONLY to compare, never as proof
// of identity (identity always comes from an authenticated session server-side).
export function normalizeEmailForCompare(email: string) {
  return email.trim().toLowerCase();
}

// Only ever return to an internship detail path we produced ourselves — a small
// guard against a tampered sessionStorage value driving an open redirect.
function isSafeReturnTo(value: unknown): value is string {
  return typeof value === "string" && /^\/internships\/[a-z0-9-]+\/?$/i.test(value);
}

export function saveInternshipSwitch(payload: InternshipSwitchPayload): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage unavailable (private mode / disabled) — the switch simply
    // won't carry state; the user can re-enter it. Never throw from here.
  }
}

export function readInternshipSwitch(): InternshipSwitchPayload | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InternshipSwitchPayload>;
    if (
      !parsed ||
      (parsed.stage !== "pending-auth" && parsed.stage !== "authenticated") ||
      typeof parsed.email !== "string" ||
      typeof parsed.slug !== "string" ||
      !isSafeReturnTo(parsed.returnTo) ||
      typeof parsed.form !== "object" ||
      parsed.form === null
    ) {
      return null;
    }
    return parsed as InternshipSwitchPayload;
  } catch {
    return null;
  }
}

export function clearInternshipSwitch(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
