import { readInternshipCertificateId } from "@growblic/validation";

export async function resolveInternshipCertificateDetail<Result>(input: {
  id: string;
  findById: (id: string) => Promise<Result | null>;
  notFound: () => never;
}) {
  let id: string;
  try {
    id = readInternshipCertificateId(input.id);
  } catch {
    return input.notFound();
  }

  const result = await input.findById(id);
  if (!result) return input.notFound();
  return { id, result };
}
