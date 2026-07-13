import { ENQUIRY_STATUSES } from "@growblic/validation";
import AdminShell from "@/components/admin/AdminShell";
import SubmissionDetails from "@/components/submissions/SubmissionDetails";
import SubmissionListPage from "@/components/submissions/SubmissionListPage";
import SubmissionStatusSelect from "@/components/submissions/SubmissionStatusSelect";
import { formatAdminDate, readSubmissionPageQuery, type AdminPageSearchParams } from "@/server/submissions/admin-submissions.page";
import { listProjectRequests } from "@/server/submissions/admin-submissions.repository";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: AdminPageSearchParams }) { const query = await readSubmissionPageQuery(searchParams, ENQUIRY_STATUSES); const result = await listProjectRequests(query); return <AdminShell><SubmissionListPage title="Project Requests" description="Start Project submissions, excluding price calculator leads." basePath="/project-requests/" items={result.items} pagination={result.pagination} search={query.search} status={query.status ?? ""} statuses={ENQUIRY_STATUSES} columns={[
  { label: "Name", render: (item) => <b className="text-slate-950">{item.name}</b> }, { label: "Contact", render: (item) => <><span className="block">{item.email ?? "—"}</span><span className="text-xs text-slate-500">{item.phone ?? "—"}</span></> }, { label: "Company", render: (item) => item.company ?? "—" }, { label: "Project type", render: (item) => item.service ?? "—" }, { label: "Budget", render: (item) => item.budget ?? "—" }, { label: "Timeline", render: (item) => item.timeline ?? "—" }, { label: "Requirements", render: (item) => <SubmissionDetails summary={item.requirementsSummary} /> }, { label: "Status", render: (item) => <SubmissionStatusSelect endpoint={`/api/project-requests/${item.id}/`} initialStatus={item.status} statuses={ENQUIRY_STATUSES} /> }, { label: "Submitted", render: (item) => formatAdminDate(item.createdAt) },
]} /></AdminShell>; }
