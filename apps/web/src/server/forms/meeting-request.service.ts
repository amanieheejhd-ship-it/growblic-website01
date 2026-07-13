import "server-only";

import { prisma } from "@/lib/prisma";
import { readEmail, readString, readSubmissionKey } from "./form-validation";

export async function saveMeetingRequest(input: Record<string, unknown>) {
  const submissionKey = readSubmissionKey(input);
  const name = readString(input, "name", { min: 2, max: 120, required: true });
  const email = readEmail(input, "email");
  const phone = readString(input, "phone", { max: 30 });
  const message = readString(input, "message", { min: 3, max: 3_000, required: true });
  const source = readString(input, "source", { max: 100 });

  await prisma.meetingRequest.upsert({
    where: { submissionKey },
    update: { submissionKey },
    create: {
      submissionKey,
      name: name!,
      email,
      phone,
      message: message!,
      source,
    },
    select: { id: true },
  });
}
