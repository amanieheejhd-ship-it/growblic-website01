import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import type {
  AdminSubmissionKind,
  ApplicationStatus,
  EnquiryStatus,
} from "@growblic/contracts";
import {
  APPLICATION_STATUSES,
  ENQUIRY_STATUSES,
  readAdminStatusUpdate,
  readAdminSubmissionId,
  readAdminSubmissionQuery,
} from "@growblic/validation";
import { withAdminErrors } from "./admin-errors";
import { ADMIN_SESSION_TOKEN_HEADER, requireAdminRole } from "./admin-session";
import {
  getAdminDashboardSummary,
  listCareerApplications,
  listContactMessages,
  listInternshipApplications,
  listMeetupRequests,
  listPriceCalculatorLeads,
  listProjectRequests,
  updateAdminSubmissionStatus,
  type SubmissionListQuery,
} from "./admin-submissions.repository";

const NO_STORE = "no-store, max-age=0";

type InstituteEnrollmentFilter = "all" | "yes" | "no";

function readInstituteEnrollmentFilter(
  value: string | null | undefined,
): InstituteEnrollmentFilter {
  if (typeof value !== "string") return "all";
  const normalized = value.trim().toLowerCase();
  return normalized === "yes" || normalized === "no" ? normalized : "all";
}

type SubmissionListPageResult = {
  items: unknown[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

const SUBMISSION_KINDS: Record<AdminSubmissionKind, {
  statuses: readonly string[];
  list: (query: SubmissionListQuery) => Promise<SubmissionListPageResult>;
}> = {
  "contact-messages": { statuses: ENQUIRY_STATUSES, list: listContactMessages },
  "project-requests": { statuses: ENQUIRY_STATUSES, list: listProjectRequests },
  "price-calculator-leads": { statuses: ENQUIRY_STATUSES, list: listPriceCalculatorLeads },
  "meetup-requests": { statuses: ENQUIRY_STATUSES, list: listMeetupRequests },
  "career-applications": { statuses: APPLICATION_STATUSES, list: listCareerApplications },
  "internship-applications": { statuses: APPLICATION_STATUSES, list: listInternshipApplications },
};

function submissionKind(kind: string): AdminSubmissionKind {
  if (!Object.prototype.hasOwnProperty.call(SUBMISSION_KINDS, kind)) {
    throw new NotFoundException();
  }
  return kind as AdminSubmissionKind;
}

function requestUrl(request: Request) {
  return new URL(request.originalUrl ?? request.url, "http://backend.internal");
}

@Controller("admin")
export class AdminSubmissionsController {
  @Get("dashboard/summary")
  @Header("Cache-Control", NO_STORE)
  async dashboardSummary(@Headers(ADMIN_SESSION_TOKEN_HEADER) token = "") {
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    const counts = await getAdminDashboardSummary();
    return { success: true, counts };
  }

  @Get("submissions/:kind")
  @Header("Cache-Control", NO_STORE)
  async list(
    @Param("kind") kindValue: string,
    @Req() request: Request,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const kind = submissionKind(kindValue);
    await requireAdminRole(token, ["SUPER_ADMIN"]);
    return withAdminErrors(async () => {
      const url = requestUrl(request);
      const definition = SUBMISSION_KINDS[kind];
      const query = readAdminSubmissionQuery(url, definition.statuses);
      const listQuery: SubmissionListQuery = kind === "internship-applications"
        ? {
            ...query,
            enrolledInInstitute: readInstituteEnrollmentFilter(
              url.searchParams.get("enrolledInInstitute"),
            ),
          }
        : query;
      const result = await definition.list(listQuery);
      return { success: true, ...result };
    });
  }

  @Patch("submissions/:kind/:id")
  @Header("Cache-Control", NO_STORE)
  async updateStatus(
    @Param("kind") kindValue: string,
    @Param("id") idValue: string,
    @Body() body: unknown,
    @Headers(ADMIN_SESSION_TOKEN_HEADER) token = "",
  ) {
    const kind = submissionKind(kindValue);
    const session = await requireAdminRole(token, ["SUPER_ADMIN"]);
    return withAdminErrors(async () => {
      const id = readAdminSubmissionId(idValue);
      const status = readAdminStatusUpdate(
        body,
        SUBMISSION_KINDS[kind].statuses,
      ) as EnquiryStatus | ApplicationStatus;
      const result = await updateAdminSubmissionStatus(kind, id, status, session.user.id);
      if (!result) {
        throw new NotFoundException("Submission not found.");
      }
      return { success: true, ...result };
    });
  }
}
