import "server-only";

import { redirect } from "next/navigation";
import { AdminAuthorizationError } from "@/server/errors/admin-authorization.error";
import { requireAdminSession } from "./require-admin-session";

export async function requireAdminPageSession() {
  let session;
  let unauthenticated = false;

  try {
    session = await requireAdminSession();
  } catch (error) {
    if (
      error instanceof AdminAuthorizationError &&
      error.code === "UNAUTHENTICATED"
    ) {
      unauthenticated = true;
    } else {
      throw error;
    }
  }

  if (unauthenticated || !session) {
    redirect("/admin/login/");
  }

  if (session.user.roles.length === 0) {
    throw new AdminAuthorizationError("FORBIDDEN");
  }

  return session;
}
