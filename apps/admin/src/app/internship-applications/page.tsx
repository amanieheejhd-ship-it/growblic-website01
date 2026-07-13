import { APPLICATION_STATUSES } from "@growblic/validation";
import AdminShell from "@/components/admin/AdminShell";
import SubmissionListPage from "@/components/submissions/SubmissionListPage";
import SubmissionStatusSelect from "@/components/submissions/SubmissionStatusSelect";
import { formatAdminDate, readSubmissionPageQuery, type AdminPageSearchParams } from "@/server/submissions/admin-submissions.page";
import { listInternshipApplications } from "@/server/submissions/admin-submissions.repository";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: AdminPageSearchParams }) { const query = await readSubmissionPageQuery(searchParams, APPLICATION_STATUSES); const result = await listInternshipApplications(query); return <AdminShell><SubmissionListPage title="Internship Applications" description="Candidates applying to internship opportunities." basePath="/internship-applications/" items={result.items} pagination={result.pagination} search={query.search} status={query.status ?? ""} statuses={APPLICATION_STATUSES} columns={[
  { label: "Candidate", render: (item) => <b className="text-slate-950">{item.candidateName}</b> }, { label: "Contact", render: (item) => <><span className="block">{item.email}</span><span className="text-xs text-slate-500">{item.phone}</span></> }, { label: "Internship", render: (item) => item.internshipSlug }, { label: "College", render: (item) => item.instituteName ?? "—" }, { label: "Course", render: (item) => item.course ?? "—" }, { label: "State", render: (item) => item.state }, { label: "Status", render: (item) => <SubmissionStatusSelect endpoint={`/api/internship-applications/${item.id}/`} initialStatus={item.status} statuses={APPLICATION_STATUSES} /> }, { label: "Submitted", render: (item) => formatAdminDate(item.createdAt) },
]} /></AdminShell>; }
