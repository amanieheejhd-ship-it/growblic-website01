import "server-only";

import type { AdminSafeUser, AdminSessionResponse } from "@growblic/contracts";
import { backendAdminFetch } from "@/server/backend/backend-admin";
import { AdminAuthorizationError } from "@/server/errors/admin-authorization.error";
import { getAdminSessionCookie } from "./admin-auth.cookies";

export type AdminPageSession = {
  expiresAt: Date;
  user: AdminSafeUser;
};

export async function getOptionalAdminSession(): Promise<AdminPageSession | null> {
  const token = await getAdminSessionCookie();

  if (!token) {
    return null;
  }

  const response = await backendAdminFetch("/admin/auth/session", { token });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to validate the admin session.");
  }

  const payload = (await response.json()) as AdminSessionResponse;

  if (!payload.success) {
    return null;
  }

  return {
    expiresAt: new Date(payload.session.expiresAt),
    user: payload.user,
  };
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
