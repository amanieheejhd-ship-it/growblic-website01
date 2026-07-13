import "server-only";

import { Prisma, prisma } from "@growblic/database";
import { validateQuoteRequest } from "@growblic/validation";

export async function saveQuoteRequest(input: Record<string, unknown>) {
  const data = validateQuoteRequest(input);

  await prisma.quoteRequest.upsert({
    where: { submissionKey: data.submissionKey },
    update: { submissionKey: data.submissionKey },
    create: {
      ...data,
      calculatorData: data.calculatorData as Prisma.InputJsonValue | undefined,
    },
    select: { id: true },
  });
}
