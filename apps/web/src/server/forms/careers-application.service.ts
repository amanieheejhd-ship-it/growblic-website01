import "server-only";

import { prisma } from "@/lib/prisma";
import {
  readEmail,
  readString,
  readSubmissionKey,
  readUrlList,
} from "./form-validation";

export async function saveCareerApplication(input: Record<string, unknown>) {
  const submissionKey = readSubmissionKey(input);
  const candidateName = readString(input, "fullName", { min: 2, max: 120, required: true });
  const email = readEmail(input, "email", true);
  const phone = readString(input, "phone", { min: 5, max: 30, required: true });
  const role = readString(input, "role", { min: 2, max: 120, required: true });
  const experience = readString(input, "experience", { min: 2, max: 80, required: true });
  const workLinks = readUrlList(input, "workLinks", 10);
  const message = readString(input, "message", { min: 10, max: 3_000, required: true });

  await prisma.careerApplication.upsert({
    where: { submissionKey },
    update: { submissionKey },
    create: {
      submissionKey,
      candidateName: candidateName!,
      email: email!,
      phone: phone!,
      role: role!,
      experience: experience!,
      workLinks,
      message: message!,
    },
    select: { id: true },
  });
}
