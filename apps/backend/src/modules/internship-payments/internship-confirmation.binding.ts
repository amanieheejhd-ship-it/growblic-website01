import {
  InvoiceStateError,
  trustedInvoicePdfData,
  trustedPaidPaymentSource,
  type InternshipApplicationSource,
  type InternshipPaymentSource,
  type PersistedInvoiceSource,
} from "./internship-invoice.binding";
import { asNonEmptyString } from "./internship-payment.core";
import { confirmationReference } from "./internship-confirmation.core";

export type ConfirmationApplicationSource = InternshipApplicationSource & {
  state: string;
  instituteEnrollment: string;
  instituteName: string | null;
  course: string | null;
  enrollmentNumber: string | null;
  highestQualification: string | null;
  passingYear: string | null;
  createdAt: Date;
};

export type PersistedConfirmationSource = InternshipPaymentSource & {
  confirmationReference: string | null;
  confirmationSequence: number | null;
  confirmationYear: number | null;
  joiningDate: Date | null;
  confirmationIssuedAt: Date | null;
};

function required(value: unknown, maximum = 256) {
  const normalized = asNonEmptyString(value, maximum);
  if (!normalized) throw new InvoiceStateError();
  return normalized;
}

function optional(value: unknown, maximum = 256) {
  if (value === null || value === undefined) return null;
  return asNonEmptyString(value, maximum);
}

function validDate(value: unknown): value is Date {
  return value instanceof Date && Number.isFinite(value.getTime());
}

export function trustedConfirmationLetterData(
  payment: PersistedConfirmationSource,
  application: ConfirmationApplicationSource,
  invoice: PersistedInvoiceSource,
) {
  const paid = trustedPaidPaymentSource(payment, application);
  trustedInvoicePdfData(paid, invoice);

  if (
    !validDate(application.createdAt) ||
    !validDate(payment.joiningDate) ||
    !validDate(payment.confirmationIssuedAt) ||
    !Number.isInteger(payment.confirmationSequence) ||
    !Number.isInteger(payment.confirmationYear)
  ) throw new InvoiceStateError();

  const sequence = payment.confirmationSequence as number;
  const year = payment.confirmationYear as number;
  const referenceNumber = required(payment.confirmationReference, 128);
  if (
    sequence < 1 ||
    sequence > 999_999 ||
    year < 2000 ||
    year > 9999 ||
    referenceNumber !== confirmationReference(year, sequence) ||
    payment.confirmationIssuedAt.getUTCFullYear() !== year
  ) throw new InvoiceStateError();

  return {
    referenceNumber,
    issuedAt: payment.confirmationIssuedAt,
    joiningDate: payment.joiningDate,
    fullName: paid.customerName,
    email: paid.customerEmail,
    phone: paid.customerPhone,
    state: required(application.state),
    instituteEnrollment: required(application.instituteEnrollment, 32),
    instituteName: optional(application.instituteName),
    course: optional(application.course),
    enrollmentNumber: optional(application.enrollmentNumber),
    highestQualification: optional(application.highestQualification),
    passingYear: optional(application.passingYear, 16),
    program: paid.program,
    durationDays: paid.durationDays,
    status: paid.status,
  };
}

export type ConfirmationLetterData = ReturnType<
  typeof trustedConfirmationLetterData
>;

function safeFilenamePart(value: string, fallback: string) {
  const safe = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();

  return safe || fallback;
}

export function confirmationLetterFilename(data: ConfirmationLetterData) {
  return `growblic-internship-confirmation-${safeFilenamePart(data.fullName, "candidate")}-${safeFilenamePart(data.referenceNumber, "reference")}.pdf`;
}
