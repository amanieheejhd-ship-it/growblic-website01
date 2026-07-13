import { APPLICATION_STATUSES } from "@growblic/validation";
import { createAdminSubmissionStatusHandler } from "@/server/submissions/admin-submissions.api";
export const runtime = "nodejs";
export const PATCH = createAdminSubmissionStatusHandler("career-applications", APPLICATION_STATUSES);
