import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  Patch,
} from "@nestjs/common";
import { ADMIN_SESSION_TOKEN_HEADER, requireAdminRole } from "./admin-session";
import {
  listInternshipApplicantAccounts,
  revokeInternshipApplicantSessions,
  updateInternshipApplicantAccountStatus,
} from "./admin-internship-accounts.repository";

const NO_STORE = "no-store, max-age=0";

@Controller("admin/internship-accounts")
export class AdminInternshipAccountsController {
  @Get()
  @Header("Cache-Control", NO_STORE)
  async list(@Headers(ADMIN_SESSION_TOKEN_HEADER) token = "") {
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    const accounts = await listInternshipApplicantAccounts();
    return { success: true, accounts };
  }

  @Patch(":id")
  @Header("Cache-Control", NO_STORE)
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const session = await requireAdminRole(token, ["SUPER_ADMIN"]);
    const action =
      body && typeof body === "object" && typeof (body as { action?: unknown }).action === "string"
        ? (body as { action: string }).action
        : "";
    if (action === "enable") {
      const account = await updateInternshipApplicantAccountStatus(id, "ACTIVE", session.user.id);
      return { success: true, account };
    }
    if (action === "disable") {
      const account = await updateInternshipApplicantAccountStatus(id, "DISABLED", session.user.id);
      return { success: true, account };
    }
    if (action === "revoke-sessions") {
      const result = await revokeInternshipApplicantSessions(id, session.user.id);
      return { success: true, revoked: result.count };
    }
    throw new BadRequestException("Invalid account action.");
  }
}
