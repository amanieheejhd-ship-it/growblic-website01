export type InternshipApplicationsFilterName =
  | "search"
  | "status"
  | "enrolledInInstitute";

export function updateInternshipApplicationsFilterQuery(
  currentQuery: string,
  name: InternshipApplicationsFilterName,
  value: string,
) {
  const query = new URLSearchParams(currentQuery);
  const normalized = value.trim();
  if (normalized) query.set(name, normalized);
  else query.delete(name);
  query.delete("page");
  return query.toString();
}
