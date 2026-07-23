import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CertificateReminderTestAction from "@/components/internship-certificates/CertificateReminderTestAction";
import DeliveryHistoryDisclosure from "@/components/internship-certificates/DeliveryHistoryDisclosure";
import InternshipCertificateEditor from "@/components/internship-certificates/InternshipCertificateEditor";
import { fetchInternshipCertificateDetail } from "@/server/backend/backend-admin";

export const dynamic = "force-dynamic";
function value(input: string | null) {
  return input ? new Date(input).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }) : "Pending";
}
function datetime(input: string | null) {
  return input ? new Date(input).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "Pending";
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { certificate, audits } = await fetchInternshipCertificateDetail((await params).id, notFound);
  const id = certificate.id;
  const reminderTestEnabled =
    process.env.NODE_ENV !== "production" &&
    process.env.INTERNSHIP_CERTIFICATE_TEST_MODE === "true" &&
    process.env.INTERNSHIP_CERTIFICATE_JOBS_ENABLED === "true";
  return (
    <AdminShell>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div>
          <h1 className="text-2xl font-bold">{certificate.application.candidateName}</h1>
          <p className="mt-1 text-sm text-slate-600">{certificate.payment.internshipProgram} — {certificate.durationDays} days</p>
          <div className="my-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm sm:grid-cols-2">
            <p><b>Email:</b> {certificate.application.email}</p><p><b>Phone:</b> {certificate.application.phone}</p>
            <p><b>Application reference:</b> {certificate.application.submissionKey}</p><p><b>Payment:</b> {certificate.payment.status}</p>
            <p><b>Joining:</b> {value(certificate.joiningDate)}</p><p><b>Completion:</b> {value(certificate.completionDate)}</p>
            <p><b>Certificate status:</b> {certificate.status}</p><p><b>Email status:</b> {certificate.emailStatus}</p>
            <p><b>Reminder:</b> {certificate.reminderStatus}</p><p><b>Sent:</b> {value(certificate.emailedAt)}</p>
            <p><b>Portal account:</b> {certificate.application.applicantAccount?.emailDisplay ?? "Not registered"}</p>
            <p><b>Portal status:</b> {certificate.application.applicantAccount?.status ?? "Not registered"}</p>
            <p><b>Portal last login:</b> {datetime(certificate.application.applicantAccount?.lastLoginAt ?? null)}</p>
            <p><b>Portal created:</b> {datetime(certificate.application.applicantAccount?.createdAt ?? null)}</p>
            <p><b>Internship start:</b> {datetime(certificate.payment.internshipStartedAt ?? certificate.payment.joiningDate)}</p>
            <p><b>Expected completion:</b> {datetime(certificate.payment.expectedCompletionAt ?? certificate.completionDate)}</p>
            <p><b>Offer letter:</b> {datetime(certificate.payment.offerLetterGeneratedAt ?? certificate.payment.confirmationIssuedAt)}</p>
            <p><b>Certificate available:</b> {datetime(certificate.payment.certificateAvailableAt ?? certificate.completionDate)}</p>
          </div>
          <div className="mb-5 flex flex-wrap gap-3">
            <a className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" href={`/api/internship-certificates/${id}/offer-letter`} target="_blank" rel="noreferrer">View offer letter</a>
            <a className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" href={`/api/internship-certificates/${id}/offer-letter?download=1`}>Download offer letter</a>
            <a className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white" href={`/api/internship-certificates/${id}/preview`} target="_blank" rel="noreferrer">View certificate</a>
            <a className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700" href={`/api/internship-certificates/${id}/preview?download=1`}>Download certificate</a>
          </div>
          <InternshipCertificateEditor id={id} initial={{
            domainRole: certificate.domainRole,
            skills: certificate.skills.map((skill) => skill.name),
            designation: certificate.designation ?? "",
            projectWork: certificate.projectWork ?? "",
            performanceSummary: certificate.performanceSummary ?? "",
            conductNote: certificate.conductNote ?? "",
            remarks: certificate.remarks ?? "",
            immutable: Boolean(certificate.generatedAt || certificate.emailedAt),
            canRetry: certificate.emailStatus === "FAILED" && !certificate.emailedAt,
          }} />
        </div>
        <aside className="grid content-start gap-5">
          {reminderTestEnabled ? <CertificateReminderTestAction id={id} /> : null}
          <DeliveryHistoryDisclosure attempts={certificate.emailAttempts.map((attempt) => ({ id: attempt.id, kind: attempt.kind, successful: attempt.successful, attemptedAt: new Date(attempt.attemptedAt).toLocaleString("en-IN") }))} />
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-bold">Audit history</h2>
            <ul className="mt-3 grid gap-3 text-sm">{audits.map((audit) => <li key={audit.id}><b>{audit.action.replaceAll("_", " ")}</b><span className="block text-slate-600">{new Date(audit.createdAt).toLocaleString("en-IN")}</span></li>)}{!audits.length ? <li className="text-slate-500">No admin changes.</li> : null}</ul>
          </section>
        </aside>
      </div>
    </AdminShell>
  );
}
