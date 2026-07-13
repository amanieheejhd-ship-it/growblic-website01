import "server-only";

export type AdminPageSearchParams = Promise<Record<string, string | string[] | undefined>>;
export async function readSubmissionPageQuery(searchParams: AdminPageSearchParams, allowedStatuses: readonly string[]) {
  const values = await searchParams;
  const rawPage = typeof values.page === "string" ? values.page : "1";
  const page = /^\d+$/.test(rawPage) ? Math.max(1, Math.min(100_000, Number(rawPage))) : 1;
  const search = (typeof values.search === "string" ? values.search : "").normalize("NFKC").trim().slice(0, 120);
  const rawStatus = typeof values.status === "string" ? values.status : "";
  const status = allowedStatuses.includes(rawStatus) ? rawStatus : "";
  return { page, pageSize: 20, search, status: status || null };
}
export function formatAdminDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}
