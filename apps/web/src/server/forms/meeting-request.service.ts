import "server-only";

import { prisma } from "@growblic/database";
import { validateMeetingRequest } from "@growblic/validation";

export async function saveMeetingRequest(input: Record<string, unknown>) {
  const data = validateMeetingRequest(input);

  await prisma.meetingRequest.upsert({
    where: { submissionKey: data.submissionKey },
    update: { submissionKey: data.submissionKey },
    create: data,
    select: { id: true },
  });
}
