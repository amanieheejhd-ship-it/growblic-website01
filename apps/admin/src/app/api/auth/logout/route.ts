import {
  clearAdminSessionCookie,
  getAdminSessionCookie,
} from "@/server/auth/admin-auth.cookies";
import { logoutAdmin } from "@/server/auth/admin-auth.service";

export const runtime = "nodejs";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function POST() {
  try {
    const token = await getAdminSessionCookie();

    if (token) {
      await logoutAdmin(token);
    }

    await clearAdminSessionCookie();

    return Response.json(
      { success: true },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch {
    await clearAdminSessionCookie().catch(() => undefined);
    console.error("Admin logout could not revoke the server session.");
    return Response.json(
      { success: false, message: "Unable to complete logout." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
