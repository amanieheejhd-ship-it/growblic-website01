import "server-only";

import { getAdminSessionCookie } from "@/server/auth/admin-auth.cookies";
import { backendAdminFetch } from "./backend-admin";

export const ADMIN_NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

// The backend exception filter forwards intentional user-facing messages only
// for these statuses, matching the messages the admin API returned before the
// server logic moved to the backend.
const MESSAGE_PASSTHROUGH_STATUSES = new Set([400, 401, 403, 409, 422, 429]);

type ProxyOptions = {
  // Per-status overrides, e.g. the previous route-specific 404 messages.
  errorMessages?: Partial<Record<number, string>>;
  fallbackMessage?: string;
};

type BackendErrorBody = { error?: { message?: unknown } };

async function backendErrorMessage(response: Response, options: ProxyOptions) {
  const override = options.errorMessages?.[response.status];
  if (override) {
    return override;
  }
  if (MESSAGE_PASSTHROUGH_STATUSES.has(response.status)) {
    try {
      const body = (await response.json()) as BackendErrorBody;
      if (typeof body.error?.message === "string" && body.error.message) {
        return body.error.message;
      }
    } catch {
      // Fall through to the fallback message.
    }
  }
  return options.fallbackMessage ?? "Unable to complete the admin request.";
}

// Forwards an admin /api request to the backend admin module, attaching the
// session token from the HttpOnly cookie, and translates backend error
// envelopes into the { success: false, message } shape the admin UI expects.
export async function proxyAdminJson(
  request: Request,
  backendPath: string,
  options: ProxyOptions = {},
) {
  try {
    const token = await getAdminSessionCookie();
    const method = request.method.toUpperCase();
    const search = new URL(request.url).search;
    const body = method === "GET" || method === "HEAD" ? null : await request.text();
    const response = await backendAdminFetch(`${backendPath}${search}`, {
      method,
      token,
      body: body || null,
    });
    if (response.ok) {
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          ...ADMIN_NO_STORE_HEADERS,
          "Content-Type": "application/json",
        },
      });
    }
    const message = await backendErrorMessage(response, options);
    const status = response.status >= 500 ? 500 : response.status;
    return Response.json(
      { success: false, message },
      { status, headers: ADMIN_NO_STORE_HEADERS },
    );
  } catch {
    console.error("Admin backend proxy request could not be completed.");
    return Response.json(
      {
        success: false,
        message: options.fallbackMessage ?? "Unable to complete the admin request.",
      },
      { status: 500, headers: ADMIN_NO_STORE_HEADERS },
    );
  }
}

// Streams a PDF from the backend admin module, preserving the previous
// behavior of the internal-token proxy routes (404 -> 409 with a helpful
// message, other backend failures -> 502).
export async function proxyAdminPdf(
  request: Request,
  backendPath: string,
  options: {
    unavailableMessage: string;
    notFoundMessage?: string;
    defaultFilename: string;
  },
) {
  try {
    const token = await getAdminSessionCookie();
    const response = await backendAdminFetch(backendPath, { token });
    if (response.status === 401 || response.status === 403) {
      const message = await backendErrorMessage(response, {
        fallbackMessage: options.unavailableMessage,
      });
      return Response.json(
        { success: false, message },
        { status: response.status, headers: ADMIN_NO_STORE_HEADERS },
      );
    }
    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message:
            response.status === 404
              ? options.notFoundMessage ?? options.unavailableMessage
              : options.unavailableMessage,
        },
        { status: response.status === 404 ? 409 : 502, headers: ADMIN_NO_STORE_HEADERS },
      );
    }
    const download = new URL(request.url).searchParams.get("download") === "1";
    const disposition =
      response.headers.get("content-disposition") ??
      `inline; filename="${options.defaultFilename}"`;
    return new Response(await response.arrayBuffer(), {
      headers: {
        ...ADMIN_NO_STORE_HEADERS,
        "Content-Type": "application/pdf",
        "Content-Disposition": download
          ? disposition.replace(/^inline/i, "attachment")
          : disposition,
      },
    });
  } catch {
    console.error("Admin backend PDF proxy request could not be completed.");
    return Response.json(
      { success: false, message: options.unavailableMessage },
      { status: 500, headers: ADMIN_NO_STORE_HEADERS },
    );
  }
}
