import { ENQUIRY_STATUSES } from "@growblic/validation";
import AdminShell from "@/components/admin/AdminShell";
import SubmissionDetails from "@/components/submissions/SubmissionDetails";
import SubmissionListPage from "@/components/submissions/SubmissionListPage";
import SubmissionStatusSelect from "@/components/submissions/SubmissionStatusSelect";
import { formatAdminDate, readSubmissionPageQuery, type AdminPageSearchParams } from "@/server/submissions/admin-submissions.page";
import { listPriceCalculatorLeads } from "@/server/submissions/admin-submissions.repository";
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: AdminPageSearchParams }) { const query = await readSubmissionPageQuery(searchParams, ENQUIRY_STATUSES); const result = await listPriceCalculatorLeads(query); return <AdminShell><SubmissionListPage title="Price Calculator Leads" description="Structured estimates generated through the price calculator." basePath="/price-calculator-leads/" items={result.items} pagination={result.pagination} search={query.search} status={query.status ?? ""} statuses={ENQUIRY_STATUSES} columns={[
  { label: "Name", render: (item) => <b className="text-slate-950">{item.name}</b> }, { label: "Contact", render: (item) => <><span className="block">{item.email ?? "—"}</span><span className="text-xs text-slate-500">{item.phone ?? "—"}</span></> }, { label: "Project", render: (item) => item.projectCategory ?? "—" }, { label: "Options", render: (item) => item.selectedOptionsSummary }, { label: "Estimate", render: (item) => item.calculatedEstimate ?? "—" }, { label: "Details", render: (item) => <SubmissionDetails summary={item.calculatorDetailsSummary} label="Calculator details" /> }, { label: "Status", render: (item) => <SubmissionStatusSelect endpoint={`/api/price-calculator-leads/${item.id}/`} initialStatus={item.status} statuses={ENQUIRY_STATUSES} /> }, { label: "Submitted", render: (item) => formatAdminDate(item.createdAt) },
]} /></AdminShell>; }
