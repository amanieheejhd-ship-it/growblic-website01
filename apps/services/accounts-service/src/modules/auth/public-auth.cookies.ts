import type { Request, Response } from "express";

// A dedicated cookie for the public-user system — NOT shared with the
// internship applicant portal (growblic_applicant_session) or admin auth
// (growblic_admin_session).
export const PUBLIC_USER_SESSION_COOKIE = "growblic_user_session";

const sessionDurationMs = 1000 * 60 * 60 * 24 * 14; // 14 days

function cookieOptions(expires?: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export function publicUserSessionExpiry(now = new Date()) {
  return new Date(now.getTime() + sessionDurationMs);
}

export function setPublicUserSessionCookie(
  response: Response,
  token: string,
  expiresAt: Date,
) {
  response.cookie(PUBLIC_USER_SESSION_COOKIE, token, cookieOptions(expiresAt));
}

export function clearPublicUserSessionCookie(response: Response) {
  response.clearCookie(PUBLIC_USER_SESSION_COOKIE, cookieOptions(new Date(0)));
}

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
