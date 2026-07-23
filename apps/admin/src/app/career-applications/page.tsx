import { APPLICATION_STATUSES } from "@growblic/validation";
import AdminShell from "@/components/admin/AdminShell";
import SubmissionDetails from "@/components/submissions/SubmissionDetails";
import SubmissionListPage from "@/components/submissions/SubmissionListPage";
import SubmissionStatusSelect from "@/components/submissions/SubmissionStatusSelect";
import { formatAdminDate, readSubmissionPageQuery, type AdminPageSearchParams } from "@/server/submissions/admin-submissions.page";
import type { AdminCareerApplication } from "@growblic/contracts";
import { fetchAdminSubmissionPage } from "@/server/backend/backend-admin";
export const dynamic = "force-dynamic";
function safeWorkLink(value: string) { try { const url = new URL(value); return ["http:", "https:", "mailto:"].includes(url.protocol) && !url.username && !url.password ? url.toString() : null; } catch { return null; } }
export default async function Page({ searchParams }: { searchParams: AdminPageSearchParams }) { const query = await readSubmissionPageQuery(searchParams, APPLICATION_STATUSES); const result = await fetchAdminSubmissionPage<AdminCareerApplication>("career-applications", query); return <AdminShell><SubmissionListPage title="Career Applications" description="Candidates applying through the careers form." basePath="/career-applications/" items={result.items} pagination={result.pagination} search={query.search} status={query.status ?? ""} statuses={APPLICATION_STATUSES} columns={[
  { label: "Candidate", render: (item) => <b className="text-slate-950">{item.candidateName}</b> }, { label: "Contact", render: (item) => <><span className="block">{item.email}</span><span className="text-xs text-slate-500">{item.phone}</span></> }, { label: "Role", render: (item) => item.role }, { label: "Experience", render: (item) => item.experience }, { label: "Work links", render: (item) => <div className="space-y-1">{item.workLinks.map(safeWorkLink).filter((link): link is string => Boolean(link)).map((link, index) => <a className="block text-indigo-700 underline" href={link} key={link} rel="noreferrer" target="_blank">Link {index + 1}</a>)}</div> }, { label: "Message", render: (item) => <SubmissionDetails summary={item.messageSummary} /> }, { label: "Status", render: (item) => <SubmissionStatusSelect endpoint={`/api/career-applications/${item.id}/`} initialStatus={item.status} statuses={APPLICATION_STATUSES} /> }, { label: "Submitted", render: (item) => formatAdminDate(item.createdAt) },
]} /></AdminShell>; }
