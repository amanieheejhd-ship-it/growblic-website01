import { asNonEmptyString, trustedPlan, trustedProgram } from "./internship-payment.core";

export class InvoiceStateError extends Error {
  constructor() {
    super("The persisted payment is not ready for invoicing.");
    this.name = "InvoiceStateError";
  }
}

export type InternshipApplicationSource = {
  id: string;
  internshipSlug: string;
  candidateName: string;
  email: string;
  phone: string;
};

export type InternshipPaymentSource = {
  internshipApplicationId: string;
  status: string;
  selectedDuration: number;
  internshipProgram: string;
  amountPaise: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paidAt: Date | null;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  paymentMethod: string | null;
};

export type PersistedInvoiceSource = {
  invoiceNumber: string;
  issuedAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  amountPaise: number;
  totalPaise: number;
  currency: string;
};

function validDate(value: unknown): value is Date {
  return value instanceof Date && Number.isFinite(value.getTime());
}

function required(value: unknown, maximum = 256) {
  const normalized = asNonEmptyString(value, maximum);
  if (!normalized) throw new InvoiceStateError();
  return normalized;
}

export function trustedPaidPaymentSource(
  payment: InternshipPaymentSource,
  application: InternshipApplicationSource,
) {
  const customerName = required(application.candidateName);
  const customerEmail = required(application.email);
  const customerPhone = required(application.phone);
  const program = trustedProgram(required(application.internshipSlug));
  const plan = trustedPlan(payment.selectedDuration);
  const gatewayOrderId = required(payment.gatewayOrderId);
  const gatewayPaymentId = required(payment.gatewayPaymentId);

  if (
    payment.status !== "PAID" ||
    payment.internshipApplicationId !== application.id ||
    !program ||
    !plan ||
    !validDate(payment.paidAt) ||
    gatewayOrderId.startsWith("reservation_") ||
    payment.amountPaise !== plan.amountPaise ||
    payment.currency !== plan.currency ||
    payment.internshipProgram !== program ||
    payment.customerName !== customerName ||
    payment.customerEmail !== customerEmail ||
    payment.customerPhone !== customerPhone
  ) throw new InvoiceStateError();

  return {
    customerName,
    customerEmail,
    customerPhone,
    program,
    durationDays: plan.duration,
    amountPaise: plan.amountPaise,
    currency: plan.currency,
    status: "PAID" as const,
    paidAt: payment.paidAt,
    gatewayOrderId,
    gatewayPaymentId,
    paymentMethod: payment.paymentMethod ? required(payment.paymentMethod, 32) : null,
  };
}

export function trustedInvoicePdfData(
  payment: ReturnType<typeof trustedPaidPaymentSource>,
  invoice: PersistedInvoiceSource,
) {
  const invoiceNumber = required(invoice.invoiceNumber, 128);
  if (
    !validDate(invoice.issuedAt) ||
    invoice.customerName !== payment.customerName ||
    invoice.customerEmail !== payment.customerEmail ||
    invoice.customerPhone !== payment.customerPhone ||
    invoice.description !== `${payment.program} internship - ${payment.durationDays} days` ||
    invoice.amountPaise !== payment.amountPaise ||
    invoice.totalPaise !== payment.amountPaise ||
    invoice.currency !== payment.currency
  ) throw new InvoiceStateError();

  return {
    invoiceNumber,
    issuedAt: invoice.issuedAt,
    ...payment,
  };
}
