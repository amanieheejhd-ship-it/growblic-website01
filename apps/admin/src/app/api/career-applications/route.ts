import { APPLICATION_STATUSES } from "@growblic/validation";
import { createAdminSubmissionListHandler } from "@/server/submissions/admin-submissions.api";
import { listCareerApplications } from "@/server/submissions/admin-submissions.repository";
export const runtime = "nodejs";
export const GET = createAdminSubmissionListHandler(APPLICATION_STATUSES, listCareerApplications);
