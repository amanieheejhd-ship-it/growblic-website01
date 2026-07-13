import type { AdminSessionResponse } from "@growblic/contracts";
import { getAdminSessionCookie } from "@/server/auth/admin-auth.cookies";
import { getAdminSession } from "@/server/auth/admin-auth.service";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  try {
    const token = await getAdminSessionCookie();
    const session = token ? await getAdminSession(token) : null;

    if (!session) {
      return Response.json(
        { success: false, message: "Admin authentication required." } satisfies AdminSessionResponse,
        { status: 401, headers: NO_STORE_HEADERS },
      );
    }

    return Response.json(
      {
        success: true,
        session: {
          expiresAt: session.expiresAt.toISOString(),
        },
        user: session.user,
      } satisfies AdminSessionResponse,
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch {
    console.error("Admin session validation could not be completed.");
    return Response.json(
      { success: false, message: "Unable to validate admin session." } satisfies AdminSessionResponse,
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
