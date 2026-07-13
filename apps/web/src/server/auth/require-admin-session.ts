import "server-only";

import { AdminAuthorizationError } from "@/server/errors/admin-authorization.error";
import { getAdminSessionCookie } from "./admin-auth.cookies";
import { getAdminSession } from "./admin-auth.service";

export async function getOptionalAdminSession() {
  const token = await getAdminSessionCookie();

  if (!token) {
    return null;
  }

  return getAdminSession(token);
}

export async function requireAdminSession() {
  const session = await getOptionalAdminSession();

  if (!session) {
    throw new AdminAuthorizationError("UNAUTHENTICATED");
  }

  return session;
}

export async function requireAdminRole(roleNames: string[]) {
  const session = await requireAdminSession();
  const allowedRoles = new Set(roleNames);

  if (!session.user.roles.some((role) => allowedRoles.has(role))) {
    throw new AdminAuthorizationError("FORBIDDEN");
  }

  return session;
}
