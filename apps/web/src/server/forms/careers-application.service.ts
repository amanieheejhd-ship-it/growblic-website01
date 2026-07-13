import "server-only";

import { prisma } from "@growblic/database";
import { validateCareerApplication } from "@growblic/validation";

export async function saveCareerApplication(input: Record<string, unknown>) {
  const data = validateCareerApplication(input);

  await prisma.careerApplication.upsert({
    where: { submissionKey: data.submissionKey },
    update: { submissionKey: data.submissionKey },
    create: data,
    select: { id: true },
  });
}
