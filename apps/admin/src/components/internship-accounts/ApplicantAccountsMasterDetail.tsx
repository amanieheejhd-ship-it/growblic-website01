"use client";

import { useMemo, useState } from "react";
import ApplicantAccountActions from "./ApplicantAccountActions";
import {
  formatMoneyPaise,
  friendlyStatus,
  type ApplicantAccountView,
  type DocumentActionState,
} from "./internship-account-view-model";

export default function ApplicantAccountsMasterDetail({
  accounts,
}: {
  accounts: ApplicantAccountView[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState(accounts[0]?.id ?? "");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch = !needle || account.searchText.includes(needle);
      const matchesStatus = status === "all" ||
        account.list.accountStatus === status ||
        account.list.paymentStatus === status ||
        account.list.internshipStatus === status;
      return matchesSearch && matchesStatus;
    });
  }, [accounts, query, status]);
  const selected = filtered.find((account) => account.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[minmax(18rem,34%)_minmax(0,1fr)]">
      <aside className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_10rem] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_9rem]">
            <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Search
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Name, email, ref"
              />
            </label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All</option>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="NOT_STARTED">Not started</option>
              </select>
            </label>
          </div>
        </div>
        <div className="grid max-h-[72vh] gap-2 overflow-y-auto p-3">
          {filtered.map((account) => {
            const active = selected?.id === account.id;
            return (
              <button
                key={account.id}
                type="button"
                onClick={() => setSelectedId(account.id)}
                aria-pressed={active}
                className={`min-w-0 rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-indigo-300 bg-indigo-50 shadow-sm"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="block truncate text-sm font-black text-slate-950">{account.list.name}</span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-slate-600">{account.list.email}</span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone={account.list.accountStatus === "ACTIVE" ? "green" : "red"}>{friendlyStatus(account.list.accountStatus)}</Badge>
                  <Badge tone={account.list.paymentStatus === "PAID" ? "green" : "slate"}>{friendlyStatus(account.list.paymentStatus)}</Badge>
                  <Badge tone={account.list.internshipStatus === "COMPLETED" ? "blue" : "amber"}>{friendlyStatus(account.list.internshipStatus)}</Badge>
                </span>
                <span className="mt-3 flex flex-wrap justify-between gap-2 text-xs font-semibold text-slate-500">
                  <span>Applied: {formatDate(account.list.appliedAt)}</span>
                  <span>Ref: {account.list.reference}</span>
                </span>
              </button>
            );
          })}
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm font-semibold text-slate-500">
              No applicant accounts found.
            </p>
          ) : null}
        </div>
      </aside>

      <main className="min-w-0">
        {selected ? <ApplicantDetail account={selected} /> : (
          <section className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm">
            Select an applicant to review account details.
          </section>
        )}
      </main>
    </div>
  );
}

function ApplicantDetail({ account }: { account: ApplicantAccountView }) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="sticky top-0 z-10 rounded-t-xl border-b border-slate-100 bg-white/95 p-4 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-black text-slate-950">{account.account.name}</h2>
            <p className="truncate text-sm font-semibold text-slate-600">{account.account.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DocumentLink action={account.letter.actions} label="View Letter" />
            <DocumentLink action={account.letter.actions} label="Download Letter" download />
            <DocumentLink action={account.certificate.actions} label="View Certificate" />
            <DocumentLink action={account.certificate.actions} label="Download Certificate" download />
          </div>
        </div>
      </header>

      <div className="grid gap-4 p-4">
        <DetailSection title="Account">
          <Definition label="Applicant name" value={account.account.name} />
          <Definition label="Email" value={account.account.email} />
          <Definition label="Phone" value={account.account.phone} />
          <Definition label="Account status" value={friendlyStatus(account.account.status)} badge />
          <Definition label="Authentication method" value={account.account.authMethod} />
          <Definition label="Email verified" value={yesNo(account.account.emailVerified)} />
          <Definition label="Account created" value={formatDateTime(account.account.createdAt)} />
        </DetailSection>

        <DetailSection title="Application">
          <Definition label="Application status" value={friendlyStatus(account.application.status)} badge />
          <Definition label="Application date" value={formatDateTime(account.application.submittedAt)} />
          <Definition label="State" value={account.application.state} />
          <Definition label="Institute enrollment" value={account.application.instituteEnrollment === null ? null : yesNo(account.application.instituteEnrollment)} />
          {account.application.instituteEnrollment ? (
            <>
              <Definition label="Institute name" value={account.application.instituteName} />
              <Definition label="Course" value={account.application.course} />
              <Definition label="Enrollment number" value={account.application.enrollmentNumber} />
            </>
          ) : null}
        </DetailSection>

        <DetailSection title="Payment">
          <Definition label="Payment status" value={friendlyStatus(account.payment.status)} badge />
          <Definition label="Amount paid" value={formatMoneyPaise(account.payment.amountPaid, account.payment.currency)} />
          <Definition label="Payment date" value={formatDateTime(account.payment.paidAt)} />
          <Definition label="Payment type" value={account.payment.type} />
          <Definition label="Payment reference" value={account.payment.reference} />
        </DetailSection>

        <DetailSection title="Internship">
          <Definition label="Duration" value={account.internship.durationDays === null ? null : `${account.internship.durationDays} days`} />
          <Definition label="Internship status" value={friendlyStatus(account.internship.status)} badge />
          <Definition label="Start date" value={formatDateTime(account.internship.startedAt)} />
          <Definition label="Completion date" value={formatDateTime(account.internship.completedAt)} />
          <Definition label="Remaining days" value={account.internship.remainingDays === null ? null : `${account.internship.remainingDays} days`} />
          <Definition label="Progress percentage" value={account.internship.progressPercentage === null ? null : `${account.internship.progressPercentage}%`} />
        </DetailSection>

        <DetailSection title="Letter">
          <Definition label="Letter status" value={account.letter.status} badge />
          <Definition label="Generated date" value={formatDateTime(account.letter.generatedAt)} />
          <Definition label="Letter reference" value={account.letter.reference} />
          <Definition label="Applicant downloaded" value={yesNo(account.letter.applicantDownloads.downloaded)} />
          <Definition label="First download date" value={formatDateTime(account.letter.applicantDownloads.firstDownloadedAt)} />
          <Definition label="Last download date" value={formatDateTime(account.letter.applicantDownloads.lastDownloadedAt)} />
          <Definition label="Download count" value={String(account.letter.applicantDownloads.downloadCount)} />
          {!account.letter.actions.available ? <p className="sm:col-span-2 text-sm font-semibold text-amber-700">{account.letter.actions.reason}</p> : null}
        </DetailSection>

        <DetailSection title="Certificate">
          <Definition label="Certificate status" value={friendlyStatus(account.certificate.status)} badge />
          <Definition label="Ready" value={yesNo(account.certificate.ready)} />
          <Definition label="Generated date" value={formatDateTime(account.certificate.generatedAt)} />
          <Definition label="Certificate reference" value={account.certificate.reference} />
          <Definition label="Applicant received/available" value={yesNo(account.certificate.applicantAvailable)} />
          <Definition label="Applicant downloaded" value={yesNo(account.certificate.applicantDownloads.downloaded)} />
          <Definition label="First download date" value={formatDateTime(account.certificate.applicantDownloads.firstDownloadedAt)} />
          <Definition label="Last download date" value={formatDateTime(account.certificate.applicantDownloads.lastDownloadedAt)} />
          <Definition label="Download count" value={String(account.certificate.applicantDownloads.downloadCount)} />
          {!account.certificate.actions.available ? <p className="sm:col-span-2 text-sm font-semibold text-amber-700">{account.certificate.actions.reason}</p> : null}
        </DetailSection>

        <DetailSection title="Login & Security">
          <Definition label="Last login" value={formatDateTime(account.account.lastLoginAt)} />
          <Definition label="Active sessions" value={String(account.account.activeSessions)} />
          <Definition label="Failed login attempts" value={String(account.account.failedLoginAttempts)} />
        </DetailSection>

        <section className="rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Admin Actions</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
            <ApplicantAccountActions accountId={account.id} status={account.account.status} />
            <div className="grid gap-2 sm:grid-cols-2">
              <DisabledAction label="Send password reset" />
              <DisabledAction label="Resend verification" />
              <DocumentLink action={account.letter.actions} label="View Letter" />
              <DocumentLink action={account.letter.actions} label="Download Letter" download />
              <DocumentLink action={account.certificate.actions} label="View Certificate" />
              <DocumentLink action={account.certificate.actions} label="Download Certificate" download />
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 p-4">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Definition({ label, value, badge = false }: { label: string; value: string | null; badge?: boolean }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-sm font-semibold text-slate-900">
        {badge ? <Badge tone="slate">{value}</Badge> : value}
      </dd>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "slate" | "green" | "red" | "amber" | "blue" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-black ${tones[tone]}`}>{children}</span>;
}

function DocumentLink({
  action,
  download = false,
  label,
}: {
  action: DocumentActionState;
  download?: boolean;
  label: string;
}) {
  const href = download ? action.downloadHref : action.viewHref;
  if (!action.available || !href) {
    return (
      <button
        type="button"
        disabled
        title={action.reason ?? "Unavailable"}
        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-400"
      >
        {label}
      </button>
    );
  }
  return (
    <a
      href={href}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noreferrer"}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-black text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
    >
      {label}
    </a>
  );
}

function DisabledAction({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Not configured in the current admin account API"
      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-400"
    >
      {label}
    </button>
  );
}

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }) : "Pending";
}

function formatDateTime(value: string | null) {
  return value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : null;
}
