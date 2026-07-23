import { ENQUIRY_STATUSES } from "@growblic/validation";
import AdminShell from "@/components/admin/AdminShell";
import SubmissionDetails from "@/components/submissions/SubmissionDetails";
import SubmissionListPage from "@/components/submissions/SubmissionListPage";
import SubmissionStatusSelect from "@/components/submissions/SubmissionStatusSelect";
import { formatAdminDate, readSubmissionPageQuery, type AdminPageSearchParams } from "@/server/submissions/admin-submissions.page";
import type { AdminContactMessage } from "@growblic/contracts";
import { fetchAdminSubmissionPage } from "@/server/backend/backend-admin";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: AdminPageSearchParams }) { const query = await readSubmissionPageQuery(searchParams, ENQUIRY_STATUSES); const result = await fetchAdminSubmissionPage<AdminContactMessage>("contact-messages", query); return <AdminShell><SubmissionListPage title="Contact Messages" description="Messages submitted through the public contact form." basePath="/contact-messages/" items={result.items} pagination={result.pagination} search={query.search} status={query.status ?? ""} statuses={ENQUIRY_STATUSES} columns={[
  { label: "Name", render: (item) => <b className="text-slate-950">{item.name}</b> }, { label: "Email", render: (item) => item.email }, { label: "Phone", render: (item) => item.phone ?? "—" }, { label: "Company", render: (item) => item.company ?? "—" }, { label: "Service", render: (item) => item.service ?? "—" }, { label: "Message", render: (item) => <SubmissionDetails summary={item.messageSummary} /> }, { label: "Status", render: (item) => <SubmissionStatusSelect endpoint={`/api/contact-messages/${item.id}/`} initialStatus={item.status} statuses={ENQUIRY_STATUSES} /> }, { label: "Submitted", render: (item) => formatAdminDate(item.createdAt) },
]} /></AdminShell>; }
