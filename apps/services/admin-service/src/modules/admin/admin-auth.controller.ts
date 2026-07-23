import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpException,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import type { AdminLoginRequest } from "@growblic/contracts";
import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
} from "./admin-auth.service";
import { ADMIN_SESSION_TOKEN_HEADER } from "./admin-session";

const NO_STORE = "no-store, max-age=0";

function trustedClientIp(request: Request) {
  // Express derives request.ip from forwarded headers only when the trust
  // proxy setting (configured in bootstrap) allows it.
  const candidate = request.ip?.trim();
  if (
    !candidate ||
    candidate.length > 64 ||
    !/^[0-9a-f:.]+$/i.test(candidate)
  ) {
    return null;
  }
  return candidate;
}

function boundedUserAgent(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 512) || null;
}

@Controller("admin/auth")
export class AdminAuthController {
  @Post("login")
  @HttpCode(200)
  @Header("Cache-Control", NO_STORE)
  async login(@Body() body: unknown, @Req() request: Request) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new BadRequestException("Please submit a valid login request.");
    }
    const input = body as Partial<AdminLoginRequest>;
    if (typeof input.email !== "string" || typeof input.password !== "string") {
      throw new BadRequestException("Please submit a valid login request.");
    }

    const result = await loginAdmin({
      email: input.email,
      password: input.password,
      ipAddress: trustedClientIp(request),
      userAgent: boundedUserAgent(request.headers["user-agent"]),
    });

    if (!result.ok) {
      if (result.reason === "RATE_LIMITED") {
        throw new HttpException(result.message, 429);
      }
      if (result.reason === "INVALID_REQUEST") {
        throw new BadRequestException(result.message);
      }
      throw new UnauthorizedException(result.message);
    }

    // The opaque token is returned exactly once; only its SHA-256 is stored.
    return {
      success: true,
      token: result.token,
      expiresAt: result.expiresAt.toISOString(),
      user: result.user,
    };
  }

  @Post("logout")
  @HttpCode(200)
  @Header("Cache-Control", NO_STORE)
  async logout(@Headers(ADMIN_SESSION_TOKEN_HEADER) token = "") {
    if (token) {
      await logoutAdmin(token);
    }
    return { success: true };
  }

  @Get("session")
  @Header("Cache-Control", NO_STORE)
  async session(@Headers(ADMIN_SESSION_TOKEN_HEADER) token = "") {
    const session = token ? await getAdminSession(token) : null;
    if (!session) {
      throw new UnauthorizedException("Admin authentication required.");
    }
    return {
      success: true,
      session: { expiresAt: session.expiresAt.toISOString() },
      user: session.user,
    };
  }
}
