import "server-only";

import { prisma } from "@growblic/database";
import { validateInternshipApplication } from "@growblic/validation";

export async function saveInternshipApplication(input: Record<string, unknown>) {
  const data = validateInternshipApplication(input);

  await prisma.internshipApplication.upsert({
    where: { submissionKey: data.submissionKey },
    update: { submissionKey: data.submissionKey },
    create: data,
    select: { id: true },
  });
}
