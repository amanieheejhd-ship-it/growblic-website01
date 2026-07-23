import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { getAdminSession, type SafeAdminSession } from "./admin-auth.service";

export const ADMIN_SESSION_TOKEN_HEADER = "x-admin-session-token";

export async function requireAdminSession(
  rawToken: string | undefined,
): Promise<SafeAdminSession> {
  const session = rawToken ? await getAdminSession(rawToken) : null;

  if (!session) {
    throw new UnauthorizedException("Admin authentication required.");
  }

  return session;
}

export async function requireAdminRole(
  rawToken: string | undefined,
  roleNames: string[],
): Promise<SafeAdminSession> {
  const session = await requireAdminSession(rawToken);
  const allowedRoles = new Set(roleNames);

  if (!session.user.roles.some((role) => allowedRoles.has(role))) {
    throw new ForbiddenException("Admin role required.");
  }

  return session;
}
