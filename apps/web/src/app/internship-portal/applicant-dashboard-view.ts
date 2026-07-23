type RawDetails = Record<string, string | number | boolean | null | undefined>;

export type ApplicantDashboardSource = {
  account: {
    email: string;
  };
  application: {
    reference: string;
    status: string;
    submittedAt: string;
  } | null;
  applicant: {
    name: string;
    email: string;
    phone: string;
    originalApplicationDetails: RawDetails;
  } | null;
  internship: {
    selectedPlan: string;
    durationDays: number | null;
    status: string;
    startedAt: string | null;
    expectedCompletionAt: string | null;
    totalDays: number | null;
    elapsedDays: number | null;
    remainingDays: number | null;
    progressPercentage: number | null;
  } | null;
  payment: {
    status: string;
    method: string | null;
    amountPaise: number | null;
    currency: string;
  } | null;
};

export type DisplayRow = {
  label: string;
  value: string;
};

export type ApplicantDashboardView = {
  applicantName: string;
  applicationStatus: string;
  paymentStatus: string;
  internshipStatus: string;
  applicantRows: DisplayRow[];
  internshipRows: DisplayRow[];
  instituteRows: DisplayRow[];
  progress: {
    startDate: string;
    completionDate: string;
    totalDuration: string | null;
    elapsedDays: string | null;
    remainingDays: string | null;
    progressPercentage: number;
    status: string;
  } | null;
};

export const applicantDashboardLayout = Object.freeze({
  paymentPlacement: "below-dashboard",
  paymentSideBySide: false,
  paymentDensity: "compact",
  paymentCardLayout: "desktop-details-left-qr-right",
  paymentSummary: ["Duration", "Amount", "Payment status"],
  demoButtonPlacement: "below-qr",
  demoTestModeLabel: "Test mode — no real payment will be charged",
  qrPlacement: "right-column-level-with-summary",
  qrCardWidth: "280-320px",
  qrImageSize: "190-220px",
  paymentSuccessPlacement: "below-payment",
  progressPlacement: "below-letter-controls",
});

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  COMPLETED_AWAITING_CERTIFICATE_DETAILS: "Completed",
  CREATED: "Created",
  FAILED: "Failed",
  NEW: "New",
  NOT_CREATED: "Not started",
  NOT_STARTED: "Not started",
  PAID: "Paid",
  PENDING: "Pending",
  REFUNDED: "Refunded",
};

export function buildApplicantDashboardView(
  dashboard: ApplicantDashboardSource,
): ApplicantDashboardView {
  const details = dashboard.applicant?.originalApplicationDetails ?? {};
  const amount = formatAmount(dashboard.payment?.amountPaise ?? readNumber(details.selectedPlanAmountPaise));
  const durationDays = dashboard.internship?.durationDays ?? readNumber(details.selectedPlanDuration);
  const instituteRows = instituteDetails(details);
  const progress = progressDetails(dashboard);

  return {
    applicantName: displayText(dashboard.applicant?.name) ?? "Applicant",
    applicationStatus: friendlyStatus(dashboard.application?.status),
    paymentStatus: friendlyStatus(dashboard.payment?.status),
    internshipStatus: friendlyStatus(dashboard.internship?.status),
    applicantRows: compactRows([
      row("Email", dashboard.applicant?.email),
      row("Phone", dashboard.applicant?.phone),
      row("State", details.state),
      row("Application date", formatDate(dashboard.application?.submittedAt ?? null)),
      row("Application reference", formatReference(dashboard.application?.reference ?? details.reference)),
    ]),
    internshipRows: compactRows([
      row("Duration", durationDays ? formatDays(durationDays) : null),
      row("Amount", amount),
      row("Payment status", friendlyStatus(dashboard.payment?.status)),
      row("Internship status", friendlyStatus(dashboard.internship?.status)),
    ]),
    instituteRows,
    progress,
  };
}

export function friendlyStatus(value: unknown) {
  const text = displayText(value);
  if (!text) return "Not started";
  const key = text.trim().toUpperCase().replace(/[\s-]+/g, "_");
  return statusLabels[key] ?? text.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatReference(value: unknown) {
  const text = displayText(value);
  if (!text) return null;
  const compact = text.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase();
  return compact ? `GB-${compact}` : null;
}

export function formatAmount(amountPaise: number | null) {
  if (!Number.isFinite(amountPaise) || !amountPaise) return null;
  return inrFormatter.format(amountPaise / 100);
}

export function isInternshipDemoPaymentEnabled(
  value: string | undefined,
  legacyValue?: string | undefined,
) {
  return value === "true" || legacyValue === "true";
}

export function instituteDetails(details: RawDetails): DisplayRow[] {
  const enrollment = normalizeYesNo(details.instituteEnrollment);
  if (enrollment === "No") {
    return [row("Institute enrollment", "No")].filter(Boolean) as DisplayRow[];
  }
  if (enrollment === "Yes") {
    return compactRows([
      row("Institute enrollment", "Yes"),
      row("Institute name", details.instituteName),
      row("Course", details.course),
      row("Enrollment number", details.enrollmentNumber),
    ]);
  }
  return [];
}

function progressDetails(dashboard: ApplicantDashboardSource) {
  if (!dashboard.internship?.startedAt || !dashboard.internship.expectedCompletionAt) {
    return null;
  }
  const totalDays = dashboard.internship.totalDays ?? dashboard.internship.durationDays;
  const elapsedDays = dashboard.internship.elapsedDays;
  const remainingDays = dashboard.internship.remainingDays;
  return {
    startDate: formatDate(dashboard.internship.startedAt) ?? "",
    completionDate: formatDate(dashboard.internship.expectedCompletionAt) ?? "",
    totalDuration: totalDays ? formatDays(totalDays) : null,
    elapsedDays: typeof elapsedDays === "number" ? formatDays(elapsedDays) : null,
    remainingDays: typeof remainingDays === "number" ? formatDays(remainingDays) : null,
    progressPercentage: Math.min(
      100,
      Math.max(0, dashboard.internship.progressPercentage ?? 0),
    ),
    status: friendlyStatus(dashboard.internship.status),
  };
}

function normalizeYesNo(value: unknown) {
  const text = displayText(value)?.toLowerCase();
  if (!text) return null;
  if (["yes", "y", "true", "1"].includes(text)) return "Yes";
  if (["no", "n", "false", "0"].includes(text)) return "No";
  return null;
}

function row(label: string, value: unknown): DisplayRow | null {
  const text = displayText(value);
  return text ? { label, value: text } : null;
}

function compactRows(rows: Array<DisplayRow | null>) {
  return rows.filter((item): item is DisplayRow => Boolean(item));
}

function displayText(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text && text !== "—" ? text : null;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function readNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function formatDays(value: number) {
  return `${value} ${value === 1 ? "day" : "days"}`;
}
