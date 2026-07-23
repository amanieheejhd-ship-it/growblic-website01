import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";
import {
  clearApplicantSessionCookie,
  readApplicantSessionCookie,
  readPublicUserSessionCookie,
  setApplicantSessionCookie,
} from "./internship-portal.cookies";
import { InternshipPortalService } from "./internship-portal.service";

@Controller("internship-portal")
export class InternshipPortalController {
  constructor(private readonly portal: InternshipPortalService) {}

  @Post("auth/register")
  async register(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.portal.register(body, this.context(request));
    setApplicantSessionCookie(response, result.token, result.expiresAt);
    return { success: true, account: result.account };
  }

  @Post("auth/login")
  async login(
    @Body() body: unknown,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.portal.login(body, this.context(request));
    setApplicantSessionCookie(response, result.token, result.expiresAt);
    return { success: true, account: result.account };
  }

  @Post("auth/pending-flow")
  pendingFlow(@Body() body: unknown, @Req() request: Request) {
    return this.portal.createPendingAuthFlow(body, this.context(request));
  }

  // SSO bridge: log the current PUBLIC accounts-service user into their matching
  // internship applicant account, if one exists. The public session token is
  // read from the growblic_user_session cookie and validated server-to-server
  // via accounts-service — no email is accepted from the request body. On a
  // match we set the normal applicant session cookie; otherwise linked=false and
  // nothing is minted (the portal shows its normal login).
  @Post("auth/sso-from-public")
  @Header("Cache-Control", "no-store")
  async ssoFromPublic(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.portal.ssoFromPublic(
      readPublicUserSessionCookie(request),
      this.context(request),
    );
    if (result.linked) {
      setApplicantSessionCookie(response, result.token, result.expiresAt);
      return { success: true, linked: true, account: result.account };
    }
    return { success: true, linked: false };
  }

  @Get("auth/oauth/:provider/start")
  async oauthStart(
    @Param("provider") provider: string,
    @Query() query: Record<string, unknown>,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const url = await this.portal.startOAuth(provider, query, this.context(request));
    response.redirect(url);
  }

  @Get("auth/oauth/:provider/callback")
  async oauthCallback(
    @Param("provider") provider: string,
    @Query() query: Record<string, unknown>,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const result = await this.portal.completeOAuth(provider, query, this.context(request));
    setApplicantSessionCookie(response, result.token, result.expiresAt);
    response.redirect(result.redirectUrl);
  }

  @Post("auth/logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.portal.logout(readApplicantSessionCookie(request));
    clearApplicantSessionCookie(response);
    return { success: true };
  }

  @Post("auth/forgot-password")
  forgotPassword(@Body() body: unknown, @Req() request: Request) {
    return this.portal.forgotPassword(body, this.context(request));
  }

  @Post("auth/reset-password")
  resetPassword(@Body() body: unknown, @Req() request: Request) {
    return this.portal.resetPassword(body, this.context(request));
  }

  @Post("auth/resend-verification")
  resendVerification(@Req() request: Request) {
    return this.portal.resendVerification(
      readApplicantSessionCookie(request),
      this.context(request),
    );
  }

  @Post("auth/verify-email")
  verifyEmail(@Body() body: unknown, @Req() request: Request) {
    return this.portal.verifyEmail(body, this.context(request));
  }

  @Get("auth/session")
  session(@Req() request: Request) {
    return this.portal.session(readApplicantSessionCookie(request));
  }

  @Get("dashboard")
  dashboard(
    @Req() request: Request,
    @Query() query: Record<string, unknown>,
  ) {
    return this.portal.dashboard(readApplicantSessionCookie(request), query);
  }

  @Post("payments/demo-session")
  demoSession(@Req() request: Request, @Body() body: unknown) {
    return this.portal.createDemoSession(readApplicantSessionCookie(request), body);
  }

  @Get("offer-letter")
  @Header("Cache-Control", "no-store")
  offerLetter(@Req() request: Request) {
    return this.portal.offerLetter(readApplicantSessionCookie(request), false);
  }

  @Get("offer-letter/download")
  @Header("Cache-Control", "no-store")
  offerLetterDownload(@Req() request: Request) {
    return this.portal.offerLetter(readApplicantSessionCookie(request), true);
  }

  @Get("certificate/status")
  certificateStatus(@Req() request: Request) {
    return this.portal.certificateStatus(readApplicantSessionCookie(request));
  }

  @Post("certificate/demo-complete")
  completeDemoInternship(@Req() request: Request, @Body() body: unknown) {
    return this.portal.completeDemoInternship(
      readApplicantSessionCookie(request),
      body,
    );
  }

  @Get("certificate")
  @Header("Cache-Control", "no-store")
  certificate(@Req() request: Request) {
    return this.portal.certificate(readApplicantSessionCookie(request), false);
  }

  @Get("certificate/download")
  @Header("Cache-Control", "no-store")
  certificateDownload(@Req() request: Request) {
    return this.portal.certificate(readApplicantSessionCookie(request), true);
  }

  private context(request: Request) {
    const forwarded = request.headers["x-vercel-forwarded-for"] ??
      request.headers["x-real-ip"];
    const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const ipAddress = typeof rawIp === "string"
      ? rawIp.split(",", 1)[0]?.trim().slice(0, 64)
      : request.ip?.slice(0, 64) ?? null;
    const rawUserAgent = request.headers["user-agent"];
    const userAgent = typeof rawUserAgent === "string"
      ? rawUserAgent.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 512)
      : null;
    return { ipAddress, userAgent };
  }
}
