import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE_NAME } from "./admin-auth.constants";

const sharedCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  priority: "high" as const,
};

export async function setAdminSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    ...sharedCookieOptions,
    expires: expiresAt,
    maxAge: Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1_000)),
  });
}

export async function getAdminSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value ?? null;
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...sharedCookieOptions,
    expires: new Date(0),
    maxAge: 0,
  });
}
