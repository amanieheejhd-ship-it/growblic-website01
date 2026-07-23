import type { Request, Response } from "express";

export const APPLICANT_SESSION_COOKIE = "growblic_applicant_session";

const sessionDurationMs = 1000 * 60 * 60 * 24 * 14;

function cookieOptions(expires?: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export function applicantSessionExpiry(now = new Date()) {
  return new Date(now.getTime() + sessionDurationMs);
}

export function setApplicantSessionCookie(response: Response, token: string, expiresAt: Date) {
  response.cookie(APPLICANT_SESSION_COOKIE, token, cookieOptions(expiresAt));
}

export function clearApplicantSessionCookie(response: Response) {
  response.clearCookie(APPLICANT_SESSION_COOKIE, cookieOptions(new Date(0)));
}

export function readApplicantSessionCookie(request: Request) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === APPLICANT_SESSION_COOKIE) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return "";
}

// The PUBLIC accounts-service session cookie (a different, independent auth
// system). We only READ it here to forward the opaque token to accounts-service
// for validation during the SSO bridge — internship-service never issues or
// trusts it directly.
export const PUBLIC_USER_SESSION_COOKIE = "growblic_user_session";

export function readPublicUserSessionCookie(request: Request) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return "";
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === PUBLIC_USER_SESSION_COOKIE) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return "";
}
