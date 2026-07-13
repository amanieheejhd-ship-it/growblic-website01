import { ENQUIRY_STATUSES } from "@growblic/validation";
import { createAdminSubmissionListHandler } from "@/server/submissions/admin-submissions.api";
import { listMeetupRequests } from "@/server/submissions/admin-submissions.repository";
export const runtime = "nodejs";
export const GET = createAdminSubmissionListHandler(ENQUIRY_STATUSES, listMeetupRequests);
