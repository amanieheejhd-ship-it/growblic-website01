import Link from "next/link";
import { INTERNSHIP_CERTIFICATE_STATUSES } from "@growblic/validation";
import AdminShell from "@/components/admin/AdminShell";
import CertificateCountdown from "@/components/internship-certificates/CertificateCountdown";
import { fetchInternshipCertificateList } from "@/server/backend/backend-admin";

export const dynamic = "force-dynamic";
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const filters = ["ending-soon", "skills-pending", "ready", "emailed", "email-failed"] as const;

function date(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(value)) : "Pending";
}

function paymentAmount(amountPaise: number, gateway: string) {
  const amount = amountPaise / 100;
  const formatted = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return `₹${formatted}${gateway === "DEMO" ? " (Demo)" : ""}`;
}

function emailDeliveryLabel(status: string) {
  if (status === "SENT") return "Sent";
  if (status === "FAILED") return "Failed";
  return "Pending";
}

function emailDeliveryClass(status: string) {
  if (status === "SENT") return "bg-emerald-50 text-emerald-700";
  if (status === "FAILED") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const renderedAt = new Date().toISOString();
  const values = await searchParams;
  const page = Math.max(1, Number(typeof values.page === "string" ? values.page : "1") || 1);
  const search = (typeof values.search === "string" ? values.search : "").normalize("NFKC").trim().slice(0, 120);
  const statusValue = typeof values.status === "string" ? values.status : "";
  const status = INTERNSHIP_CERTIFICATE_STATUSES.includes(statusValue as never) ? statusValue : null;
  const filterValue = typeof values.filter === "string" ? values.filter : "";
  const filter = filters.includes(filterValue as never) ? filterValue : null;
  const result = await fetchInternshipCertificateList({ page, pageSize: 20, search, status, filter });
  return (
    <AdminShell>
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Internship Certificates</h1>
        <p className="mt-1 text-sm text-slate-600">Trusted lifecycle, skills, reminders, generation and delivery.</p>
        <form className="mt-5 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4" action="/internship-certificates/">
          <input aria-label="Search candidates" name="search" defaultValue={search} placeholder="Name, email or reference" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          <select aria-label="Certificate status" name="status" defaultValue={status ?? ""} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">All statuses</option>
            {INTERNSHIP_CERTIFICATE_STATUSES.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
          </select>
          <select aria-label="Certificate filter" name="filter" defaultValue={filter ?? ""} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">All records</option>
            {filters.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-bold text-white">Filter</button>
        </form>
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[1180px] table-fixed divide-y divide-slate-200 text-left text-sm">
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[17%]" />
              <col className="w-[9%]" />
              <col className="w-[10%]" />
              <col className="w-[9%]" />
              <col className="w-[8%]" />
              <col className="w-[16%]" />
              <col className="w-[10%]" />
              <col className="w-[7%]" />
            </colgroup>
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-600"><tr>
              {["Candidate", "Dates", "Payment", "Remaining", "Reminder", "Skills", "Email", "Sent", "Action"].map((label) => <th key={label} className={`px-3 py-3 ${["Reminder", "Skills", "Sent", "Action"].includes(label) ? "text-center" : ""}`}>{label}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {result.items.map((certificate) => {
                const hrefId = certificate.id;
                if (certificate.id !== hrefId) {
                  throw new Error("Certificate ID mismatch");
                }
                return <tr key={certificate.id} className="align-middle">
                <td className="px-3 py-4">
                  <b className="text-slate-900">{certificate.candidateName}</b>
                  <span className="mt-0.5 block text-xs text-slate-500">{certificate.phone}</span>
                </td>
                <td className="px-3 py-4">
                  <span className="whitespace-nowrap">{date(certificate.joiningDate)} → {date(certificate.completionDate)}</span>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">{certificate.durationDays} Days</span>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <span className="font-semibold text-slate-900">{certificate.paymentStatus}</span>
                  <span className="mt-0.5 block text-xs text-slate-600">{paymentAmount(certificate.paymentAmountPaise, certificate.paymentGateway)}</span>
                </td>
                <td className="px-3 py-4">
                  <CertificateCountdown completionDate={certificate.completionDate} initialNow={renderedAt} />
                </td>
                <td className="px-3 py-4 text-center">
                  <span className="inline-flex min-h-6 items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-slate-600">{certificate.reminderStatus}</span>
                </td>
                <td className="px-3 py-4 text-center">
                  <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${certificate.skillsCompleted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {certificate.skillsCompleted ? "Done" : "Pending"}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <span className="break-words text-slate-800">{certificate.email}</span>
                  <span className={`mt-1.5 inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${emailDeliveryClass(certificate.emailStatus)}`}>
                    {emailDeliveryLabel(certificate.emailStatus)}
                  </span>
                </td>
                <td className="px-3 py-4 text-center text-xs whitespace-nowrap text-slate-600">{date(certificate.emailedAt)}</td>
                <td className="px-3 py-4 text-center"><Link className="font-bold text-indigo-700 hover:text-indigo-900" href={`/internship-certificates/${hrefId}/`}>View</Link></td>
              </tr>;
              })}
              {!result.items.length ? <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">No certificate records found.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">{result.pagination.total} records — page {result.pagination.page} of {result.pagination.totalPages}</p>
      </section>
    </AdminShell>
  );
}
