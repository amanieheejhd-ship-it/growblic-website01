import "server-only";

import { Prisma, prisma } from "@growblic/database";
import {
  readEmail,
  readOptionalJsonObject,
  readString,
  readSubmissionKey,
} from "./form-validation";

export async function saveQuoteRequest(input: Record<string, unknown>) {
  const submissionKey = readSubmissionKey(input);
  const name = readString(input, "name", { min: 2, max: 120, required: true });
  const email = readEmail(input, "email");
  const phone = readString(input, "phone", { max: 30 });
  const company = readString(input, "company", { max: 160 });
  const location = readString(input, "location", { max: 160 });
  const service = readString(input, "service", { max: 160 });
  const budget = readString(input, "budget", { max: 120 });
  const requirements = readString(input, "requirements", {
    min: 3,
    max: 10_000,
    required: true,
  });
  const calculatorData = readOptionalJsonObject(input, "calculatorData");
  const source = readString(input, "source", { max: 100 });

  await prisma.quoteRequest.upsert({
    where: { submissionKey },
    update: { submissionKey },
    create: {
      submissionKey,
      name: name!,
      email,
      phone,
      company,
      location,
      service,
      budget,
      requirements: requirements!,
      calculatorData: calculatorData as Prisma.InputJsonValue | undefined,
      source,
    },
    select: { id: true },
  });
}
