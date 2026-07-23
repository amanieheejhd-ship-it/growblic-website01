export type DocumentDownloadSummary = {
  downloaded: boolean;
  firstDownloadedAt: string | null;
  lastDownloadedAt: string | null;
  downloadCount: number;
};

export type DocumentActionState = {
  available: boolean;
  reason: string | null;
  viewHref: string | null;
  downloadHref: string | null;
};

export type ApplicantAccountView = {
  id: string;
  searchText: string;
  list: {
    name: string;
    email: string;
    accountStatus: string;
    paymentStatus: string;
    internshipStatus: string;
    appliedAt: string | null;
    reference: string;
  };
  account: {
    name: string;
    email: string;
    phone: string | null;
    status: string;
    authMethod: string;
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt: string | null;
    activeSessions: number;
    failedLoginAttempts: number;
  };
  application: {
    status: string | null;
    submittedAt: string | null;
    state: string | null;
    instituteEnrollment: boolean | null;
    instituteName: string | null;
    course: string | null;
    enrollmentNumber: string | null;
  };
  payment: {
    status: string;
    amountPaid: number | null;
    currency: string;
    paidAt: string | null;
    type: "Demo" | "Real" | "Pending";
    reference: string | null;
  };
  internship: {
    durationDays: number | null;
    status: string;
    startedAt: string | null;
    completedAt: string | null;
    remainingDays: number | null;
    progressPercentage: number | null;
  };
  letter: {
    status: string;
    generatedAt: string | null;
    reference: string | null;
    applicantDownloads: DocumentDownloadSummary;
    actions: DocumentActionState;
  };
  certificate: {
    status: string;
    ready: boolean;
    generatedAt: string | null;
    reference: string | null;
    applicantAvailable: boolean;
    applicantDownloads: DocumentDownloadSummary;
    actions: DocumentActionState;
  };
};

export function compactReference(value: string | null | undefined, prefix = "GB") {
  const clean = String(value ?? "").trim();
  if (!clean) return "Not linked";
  if (/^GB[-A-Z0-9]+$/i.test(clean) && clean.length <= 24) return clean.toUpperCase();
  return `${prefix}-${clean.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase() || "UNKNOWN"}`;
}

export function compactPaymentReference(value: string | null | undefined) {
  const clean = String(value ?? "").trim();
  if (!clean) return null;
  if (/^PAY-[A-Z0-9]{1,12}$/i.test(clean)) return clean.toUpperCase();
  return `PAY-${clean.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase() || "UNKNOWN"}`;
}

export function formatMoneyPaise(value: number | null | undefined, currency = "INR") {
  if (value === null || value === undefined) return "Not paid";
  if (currency !== "INR") return `${currency} ${(value / 100).toLocaleString("en-IN")}`;
  return `₹${(value / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function friendlyStatus(value: string | null | undefined) {
  if (!value) return "Not started";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function authMethodLabel(providers: string[], hasPassword: boolean) {
  if (providers.some((provider) => provider.toLowerCase() === "google")) return "Google";
  if (providers.some((provider) => provider.toLowerCase() === "github")) return "GitHub";
  return hasPassword ? "Email and Password" : "Email and Password";
}

export function hasInstituteEnrollment(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return null;
  if (["no", "none", "not enrolled", "not_enrolled", "not-enrolled", "false"].includes(normalized)) return false;
  return true;
}

export function summarizeApplicantDownloads(
  accesses: Array<{ createdAt: string; actorType: string; action: string }>,
): DocumentDownloadSummary {
  const applicantDownloads = accesses
    .filter((access) => access.actorType === "APPLICANT" && access.action === "DOWNLOAD")
    .map((access) => access.createdAt)
    .sort();
  return {
    downloaded: applicantDownloads.length > 0,
    firstDownloadedAt: applicantDownloads[0] ?? null,
    lastDownloadedAt: applicantDownloads.at(-1) ?? null,
    downloadCount: applicantDownloads.length,
  };
}

export function certificateUnavailableReason(input: {
  hasCertificate: boolean;
  internshipCompleted: boolean;
  detailsComplete: boolean;
  markedReady: boolean;
  pdfGenerated: boolean;
}) {
  if (!input.internshipCompleted) return "Internship not completed";
  if (!input.hasCertificate || !input.detailsComplete) return "Certificate details incomplete";
  if (!input.markedReady) return "Certificate not marked ready";
  if (!input.pdfGenerated) return "PDF not generated";
  return null;
}

export function visibleListText(account: ApplicantAccountView) {
  return [
    account.list.name,
    account.list.email,
    friendlyStatus(account.list.accountStatus),
    friendlyStatus(account.list.paymentStatus),
    friendlyStatus(account.list.internshipStatus),
    account.list.appliedAt ?? "",
    account.list.reference,
  ].join(" ");
}
