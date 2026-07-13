import type { AdminLoginRequest, AdminLoginResponse } from "@growblic/contracts";
import {
  loginAdmin,
  logoutAdmin,
} from "@/server/auth/admin-auth.service";
import { setAdminSessionCookie } from "@/server/auth/admin-auth.cookies";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_192;
const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function json(body: AdminLoginResponse, status: number) {
  return Response.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function getTrustedClientIp(request: Request) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-real-ip");
  const candidate = forwarded?.split(",", 1)[0]?.trim();

  if (
    !candidate ||
    candidate.length > 64 ||
    !/^[0-9a-f:.]+$/i.test(candidate)
  ) {
    return null;
  }

  return candidate;
}

function getBoundedUserAgent(request: Request) {
  const value = request.headers.get("user-agent")?.trim();

  if (!value) {
    return null;
  }

  return value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 512) || null;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ success: false, message: "Please submit a valid login request." }, 400);
  }

  let body: unknown;

  try {
    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ success: false, message: "Please submit a valid login request." }, 400);
    }

    body = JSON.parse(rawBody);
  } catch {
    return json({ success: false, message: "Please submit a valid login request." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ success: false, message: "Please submit a valid login request." }, 400);
  }

  const input = body as Partial<AdminLoginRequest>;

  if (typeof input.email !== "string" || typeof input.password !== "string") {
    return json({ success: false, message: "Please submit a valid login request." }, 400);
  }

  try {
    const result = await loginAdmin({
      email: input.email,
      password: input.password,
      ipAddress: getTrustedClientIp(request),
      userAgent: getBoundedUserAgent(request),
    });

    if (!result.ok) {
      const status =
        result.reason === "RATE_LIMITED"
          ? 429
          : result.reason === "INVALID_REQUEST"
            ? 400
            : 401;

      return json({ success: false, message: result.message }, status);
    }

    try {
      await setAdminSessionCookie(result.token, result.expiresAt);
    } catch {
      await logoutAdmin(result.token).catch(() => undefined);
      throw new Error("Admin session cookie could not be set.");
    }

    return json(
      {
        success: true,
        user: result.user,
      },
      200,
    );
  } catch {
    console.error("Admin login could not be completed.");
    return json({ success: false, message: "Unable to complete login." }, 500);
  }
}
