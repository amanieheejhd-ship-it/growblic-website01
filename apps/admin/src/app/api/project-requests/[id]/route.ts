import { ENQUIRY_STATUSES } from "@growblic/validation";
import { createAdminSubmissionStatusHandler } from "@/server/submissions/admin-submissions.api";
export const runtime = "nodejs";
export const PATCH = createAdminSubmissionStatusHandler("project-requests", ENQUIRY_STATUSES);
