import AdminShell from "@/components/admin/AdminShell";
import ApplicantAccountsMasterDetail from "@/components/internship-accounts/ApplicantAccountsMasterDetail";
import { fetchInternshipApplicantAccounts } from "@/server/backend/backend-admin";

export const dynamic = "force-dynamic";

export default async function Page() {
  const accounts = await fetchInternshipApplicantAccounts();
  return (
    <AdminShell>
      <section className="min-w-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Applicant Accounts</h1>
          <p className="mt-1 text-sm text-slate-600">
            Review applicant accounts, payments, documents, and security activity from one focused panel.
          </p>
        </div>
        <ApplicantAccountsMasterDetail accounts={accounts} />
      </section>
    </AdminShell>
  );
}
