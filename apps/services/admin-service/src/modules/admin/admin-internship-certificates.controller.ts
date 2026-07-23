import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  StreamableFile,
} from "@nestjs/common";
import type { Request } from "express";
import {
  FormValidationError,
  INTERNSHIP_CERTIFICATE_STATUSES,
  readInternshipCertificateDraft,
  readInternshipCertificateId,
} from "@growblic/validation";
import { withAdminErrors } from "./admin-errors";
import { ADMIN_SESSION_TOKEN_HEADER, requireAdminRole } from "./admin-session";
import {
  getInternshipCertificate,
  listInternshipCertificates,
  markInternshipCertificateReady,
  retryInternshipCertificateEmail,
  saveInternshipCertificateDraft,
  scheduleInternshipCertificateReminderTest,
} from "./admin-internship-certificates.repository";
import { resolveInternshipCertificateDetail } from "./internship-certificate-detail-route";
import { InternshipCertificateProxyService } from "./internship-certificate-proxy.service";

const NO_STORE = "no-store, max-age=0";
const LIST_FILTERS = new Set([
  "ending-soon",
  "skills-pending",
  "ready",
  "emailed",
  "email-failed",
]);

function certificateId(value: string) {
  try {
    return readInternshipCertificateId(value);
  } catch (error) {
    if (error instanceof FormValidationError) {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
}

@Controller("admin/internship-certificates")
export class AdminInternshipCertificatesController {
  constructor(
    private readonly internalCertificates: InternshipCertificateProxyService,
  ) {}

  @Get()
  @Header("Cache-Control", NO_STORE)
  async list(
    @Req() request: Request,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    const url = new URL(request.originalUrl ?? request.url, "http://backend.internal");
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
    const search = url.searchParams.get("search")?.normalize("NFKC").trim() ?? "";
    const status = url.searchParams.get("status");
    const filter = url.searchParams.get("filter");
    if (
      !Number.isInteger(page) || page < 1 ||
      !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 ||
      search.length > 120 ||
      (status && !INTERNSHIP_CERTIFICATE_STATUSES.includes(status as never)) ||
      (filter && !LIST_FILTERS.has(filter))
    ) {
      throw new BadRequestException("Invalid certificate filters.");
    }
    const result = await listInternshipCertificates({ page, pageSize, search, status, filter });
    return { success: true, ...result };
  }

  @Get(":id/preview")
  @Header("Cache-Control", NO_STORE)
  async preview(
    @Param("id") id: string,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    const certificate = await this.internalCertificates.preview(id);
    return new StreamableFile(certificate.stream, {
      type: "application/pdf",
      disposition: certificate.disposition,
    });
  }

  @Get(":id/offer-letter")
  @Header("Cache-Control", NO_STORE)
  async offerLetter(
    @Param("id") id: string,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    const document = await this.internalCertificates.offerLetter(id);
    return new StreamableFile(document.stream, {
      type: "application/pdf",
      disposition: document.disposition,
    });
  }

  @Get(":id")
  @Header("Cache-Control", NO_STORE)
  async detail(
    @Param("id") id: string,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    const resolved = await resolveInternshipCertificateDetail({
      id,
      findById: getInternshipCertificate,
      notFound: () => {
        throw new NotFoundException("Certificate not found.");
      },
    });
    return { success: true, result: resolved.result };
  }

  @Patch(":id")
  @Header("Cache-Control", NO_STORE)
  async saveDraft(
    @Param("id") idValue: string,
    @Body() body: unknown,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const session = await requireAdminRole(token, ["SUPER_ADMIN"]);
    return withAdminErrors(async () => {
      const id = certificateId(idValue);
      const draft = readInternshipCertificateDraft(body);
      const result = await saveInternshipCertificateDraft(id, draft, session.user.id);
      if (!result) throw new NotFoundException("Certificate not found.");
      return { success: true, status: result.status };
    });
  }

  @Post(":id/ready")
  @Header("Cache-Control", NO_STORE)
  async markReady(
    @Param("id") idValue: string,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const session = await requireAdminRole(token, ["SUPER_ADMIN"]);
    return withAdminErrors(async () => {
      const result = await markInternshipCertificateReady(certificateId(idValue), session.user.id);
      if (!result) throw new NotFoundException("Certificate not found.");
      return { success: true, status: result.status };
    });
  }

  @Post(":id/retry")
  @Header("Cache-Control", NO_STORE)
  async retryEmail(
    @Param("id") idValue: string,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const session = await requireAdminRole(token, ["SUPER_ADMIN"]);
    return withAdminErrors(async () => {
      const result = await retryInternshipCertificateEmail(certificateId(idValue), session.user.id);
      if (!result) throw new NotFoundException("Certificate not found.");
      return { success: true, status: result.status };
    });
  }

  @Post(":id/reminder-test")
  @Header("Cache-Control", NO_STORE)
  async reminderTest(
    @Param("id") idValue: string,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const session = await requireAdminRole(token, ["SUPER_ADMIN"]);
    return withAdminErrors(async () => {
      const result = await scheduleInternshipCertificateReminderTest(
        certificateId(idValue),
        session.user.id,
      );
      if (!result) throw new NotFoundException("Certificate not found.");
      return { success: true, scheduledFor: result.scheduledFor.toISOString() };
    });
  }
}
