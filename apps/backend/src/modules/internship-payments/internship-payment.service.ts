import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { StructuredLogger } from "../../common/logging/structured-logger.service";
import {
  InvoiceStateError,
  trustedInvoicePdfData,
  trustedPaidPaymentSource,
} from "./internship-invoice.binding";
import {
  confirmationLetterFilename,
  trustedConfirmationLetterData,
} from "./internship-confirmation.binding";
import { generateInternshipConfirmationPdf } from "./internship-confirmation.pdf";
import {
  confirmationReference,
  JoiningDateError,
  parseJoiningDate,
  sameJoiningDate,
} from "./internship-confirmation.core";
import { generateInternshipInvoicePdf } from "./internship-invoice.pdf";
import {
  asNonEmptyString,
  constantTimeEqual,
  paymentAccessToken,
  readRazorpayPayment,
  sha256,
  trustedPlan,
  trustedProgram,
  verifyCheckoutSignature,
  verifyWebhookSignature,
  webhookPayment,
  type RazorpayPaymentSnapshot,
} from "./internship-payment.core";

// The shared package is loaded lazily because it is ESM and requires DATABASE_URL at runtime.
// Prisma still supplies the concrete generated client; this boundary avoids loading it in unit tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DatabaseClient = any;
type DatabaseModule = { prisma: DatabaseClient };
type PaymentAccess = { paymentId: string; accessToken: string };
const demoPaymentAmountPaise = 100;

function requiredEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new ServiceUnavailableException(`Missing server configuration: ${name}`);
  return value;
}

function razorpayTestKeyId() {
  const keyId = requiredEnvironment("RAZORPAY_KEY_ID");
  if (!keyId.startsWith("rzp_test_")) {
    throw new ServiceUnavailableException("Razorpay test mode is required.");
  }
  return keyId;
}

function isUniqueConflict(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

function isSerializationConflict(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2034");
}

class ConfirmationAssignmentRace extends Error {}

@Injectable()
export class InternshipPaymentService {
  private databaseModule: DatabaseModule | null = null;

  constructor(private readonly logger: StructuredLogger) {}

  async createDemoSession(body: unknown) {
    this.requireDemoGateway();
    const input = body && typeof body === "object"
      ? body as Record<string, unknown>
      : {};
    const submissionKey = asNonEmptyString(input.applicationReference, 128);
    const plan = trustedPlan(input.duration);
    if (!submissionKey || !plan) throw new BadRequestException();

    const database = await this.database();
    const application = await database.internshipApplication.findUnique({
      where: { submissionKey },
    });
    if (!application) throw new NotFoundException();
    const program = trustedProgram(application.internshipSlug);
    if (!program) throw new BadRequestException();

    const accessToken = paymentAccessToken();
    try {
      const payment = await database.internshipPayment.create({
        data: {
          internshipApplicationId: application.id,
          accessTokenHash: sha256(accessToken),
          gateway: "DEMO",
          gatewayOrderId: `demo_order_${paymentAccessToken().slice(0, 24)}`,
          selectedDuration: plan.duration,
          internshipProgram: program,
          amountPaise: demoPaymentAmountPaise,
          currency: plan.currency,
          status: "PENDING",
          customerName: application.candidateName,
          customerEmail: application.email,
          customerPhone: application.phone,
        },
      });
      return {
        paymentId: payment.id,
        accessToken,
        durationDays: payment.selectedDuration,
        status: payment.status,
        amount: payment.amountPaise,
        currency: payment.currency,
      };
    } catch (error) {
      if (isUniqueConflict(error)) {
        throw new ConflictException(
          "A payment session already exists for this application.",
        );
      }

      if (process.env.NODE_ENV !== "production") {
        console.error("DEMO_SESSION_CREATE_FAILED", error);
      }

      throw error;
    }
  }

  async createOrder(body: unknown) {
    const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const submissionKey = asNonEmptyString(input.applicationReference, 128);
    const plan = trustedPlan(input.duration);
    if (!submissionKey || !plan) throw new BadRequestException();

    const database = await this.database();
    const application = await database.internshipApplication.findUnique({ where: { submissionKey } });
    if (!application) throw new NotFoundException();
    const program = trustedProgram(application.internshipSlug);
    if (!program) throw new BadRequestException();

    const accessToken = paymentAccessToken();
    let payment;
    try {
      payment = await database.internshipPayment.create({
        data: {
          internshipApplicationId: application.id,
          accessTokenHash: sha256(accessToken),
          gatewayOrderId: `reservation_${paymentAccessToken().slice(0, 24)}`,
          selectedDuration: plan.duration,
          internshipProgram: program,
          amountPaise: plan.amountPaise,
          currency: plan.currency,
          status: "CREATED",
          customerName: application.candidateName,
          customerEmail: application.email,
          customerPhone: application.phone,
        },
      });
    } catch (error) {
      if (isUniqueConflict(error)) throw new ConflictException("A payment order already exists for this application.");
      throw error;
    }

    try {
      const order = await this.razorpayRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          amount: plan.amountPaise,
          currency: plan.currency,
          receipt: `internship_${application.id.slice(-20)}`,
          notes: { applicationId: application.id, duration: String(plan.duration) },
        }),
      });
      const orderId = asNonEmptyString(order.id);
      if (!orderId || order.amount !== plan.amountPaise || order.currency !== plan.currency) throw new ServiceUnavailableException();
      payment = await database.internshipPayment.update({
        where: { id: payment.id },
        data: { gatewayOrderId: orderId, status: "PENDING" },
      });
      return {
        paymentId: payment.id,
        accessToken,
        razorpayKeyId: razorpayTestKeyId(),
        razorpayOrderId: orderId,
        amount: payment.amountPaise,
        currency: payment.currency,
        name: payment.customerName,
        email: payment.customerEmail,
        contact: payment.customerPhone,
      };
    } catch (error) {
      await database.internshipPayment.deleteMany({ where: { id: payment.id, status: "CREATED" } });
      throw error;
    }
  }

  async verifyCheckout(body: unknown) {
    const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const paymentId = asNonEmptyString(input.paymentId);
    const accessToken = asNonEmptyString(input.accessToken);
    const gatewayPaymentId = asNonEmptyString(input.razorpayPaymentId);
    const signature = asNonEmptyString(input.razorpaySignature);
    if (!paymentId || !accessToken || !gatewayPaymentId || !signature) throw new BadRequestException();

    const payment = await this.authorizedPayment({ paymentId, accessToken });
    if (payment.status === "PAID") return this.status({ paymentId, accessToken });
    if (!verifyCheckoutSignature({
      orderId: payment.gatewayOrderId,
      paymentId: gatewayPaymentId,
      signature,
      secret: requiredEnvironment("RAZORPAY_KEY_SECRET"),
    })) throw new UnauthorizedException();

    const gatewayPayment = readRazorpayPayment(await this.razorpayRequest(`/payments/${encodeURIComponent(gatewayPaymentId)}`));
    if (!gatewayPayment || gatewayPayment.status !== "captured") throw new ConflictException("Payment has not been captured.");
    await this.assertGatewayPaymentMatches(payment, gatewayPayment);
    const settled = await this.settlePaid(payment.id, gatewayPayment);
    await this.deliverInvoice(settled.id);
    return this.status({ paymentId, accessToken });
  }

  async handleWebhook(rawBody: Buffer | undefined, signature: string | undefined, eventIdHeader?: string) {
    if (!rawBody || !signature || !verifyWebhookSignature(rawBody, signature, requiredEnvironment("RAZORPAY_WEBHOOK_SECRET"))) {
      throw new UnauthorizedException();
    }
    let webhookBody: unknown;
    try { webhookBody = JSON.parse(rawBody.toString("utf8")) as unknown; }
    catch { throw new BadRequestException(); }
    const parsed = webhookPayment(webhookBody);
    if (!parsed || !["payment.captured", "order.paid", "payment.failed"].includes(parsed.eventType)) {
      return { accepted: true };
    }
    const eventId = asNonEmptyString(eventIdHeader) ?? sha256(rawBody);
    const database = await this.database();
    const alreadyProcessed = await database.paymentWebhookEvent.findUnique({ where: { eventId } });
    if (alreadyProcessed) return { accepted: true };

    const payment = await database.internshipPayment.findUnique({ where: { gatewayOrderId: parsed.payment.orderId } });
    if (!payment) {
      this.logger.warning({ eventId, eventType: parsed.eventType }, "ignored webhook for unknown order");
      await this.recordWebhook(eventId, parsed.eventType);
      return { accepted: true };
    }
    await this.assertGatewayPaymentMatches(payment, parsed.payment);

    if (parsed.eventType === "payment.failed") {
      try {
        await database.$transaction([
          database.internshipPayment.updateMany({
            where: { id: payment.id, status: { not: "PAID" } },
            data: { status: "FAILED", paymentMethod: parsed.payment.method },
          }),
          database.paymentWebhookEvent.create({ data: { eventId, eventType: parsed.eventType } }),
        ]);
      } catch (error) {
        if (!isUniqueConflict(error)) throw error;
      }
      return { accepted: true };
    }

    if (parsed.payment.status !== "captured") throw new BadRequestException();
    const settled = await this.settlePaid(payment.id, parsed.payment, { eventId, eventType: parsed.eventType });
    await this.deliverInvoice(settled.id);
    return { accepted: true };
  }

  async status(access: PaymentAccess) {
    const payment = await this.authorizedPayment(access);
    if (payment.status !== "PAID") return this.publicStatus(payment);
    const ready = this.trustedPaidInvoice(payment);
    return this.publicStatus(payment, ready.invoiceNumber);
  }

  async completeDemoPayment(access: PaymentAccess) {
    this.requireDemoGateway();
    const payment = await this.authorizedPayment(access);
    this.assertDemoPaymentSession(payment);
    if (payment.status === "FAILED" || payment.status === "REFUNDED") {
      throw new ConflictException("This demo payment cannot be completed.");
    }

    const gatewayPaymentId = payment.gatewayPaymentId ?? `demo_payment_${payment.id}`;
    const settled = await this.settlePaid(payment.id, {
      id: gatewayPaymentId,
      orderId: payment.gatewayOrderId,
      amount: demoPaymentAmountPaise,
      currency: "INR",
      status: "captured",
      method: "demo",
    });
    const refreshed = await this.authorizedPayment(access);
    const ready = this.trustedPaidInvoice(refreshed);
    return {
      success: true,
      status: settled.status,
      amount: ready.amountPaise,
      currency: ready.currency,
    };
  }

  async certificateEligibility(access: PaymentAccess) {
    const payment = await this.authorizedPayment(access);
    if (payment.status !== "PAID") throw new ForbiddenException();
    const ready = this.trustedPaidInvoice(payment);
    return {
      eligible: true,
      invoiceNumber: ready.invoiceNumber,
      fullName: ready.customerName,
      program: ready.program,
      durationDays: ready.durationDays,
      confirmation: { status: ready.status },
    };
  }

  async confirmationLetter(access: PaymentAccess, body: unknown) {
    const input = body && typeof body === "object"
      ? body as Record<string, unknown>
      : {};
    const database = await this.database();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await database.$transaction(
          async (transaction: DatabaseClient) => {
            const payment = await this.authorizedPayment(access, transaction);
            if (payment.status !== "PAID") throw new ForbiddenException();
            this.trustedPaidInvoice(payment);

            const now = this.serverNow();
            const joiningDate = parseJoiningDate(input.joiningDate, {
              applicationCreatedAt: payment.internshipApplication.createdAt,
              paidAt: payment.paidAt,
              now,
            });
            const confirmationFields = [
              payment.confirmationReference,
              payment.confirmationSequence,
              payment.confirmationYear,
              payment.joiningDate,
              payment.confirmationIssuedAt,
            ];
            const assignedCount = confirmationFields.filter(
              (value) => value !== null && value !== undefined,
            ).length;

            let persisted = payment;
            if (assignedCount === confirmationFields.length) {
              if (!sameJoiningDate(payment.joiningDate, joiningDate)) {
                throw new ConflictException(
                  "The date of joining has already been set.",
                );
              }
            } else if (assignedCount !== 0) {
              throw new ConflictException(
                "The confirmation letter is temporarily unavailable.",
              );
            } else {
              const year = now.getUTCFullYear();
              const sequence = await transaction.internshipConfirmationSequence.upsert({
                where: { year },
                create: { year, lastValue: 1 },
                update: { lastValue: { increment: 1 } },
              });
              const reference = confirmationReference(year, sequence.lastValue);
              const claimed = await transaction.internshipPayment.updateMany({
                where: {
                  id: payment.id,
                  status: "PAID",
                  confirmationReference: null,
                  confirmationSequence: null,
                  confirmationYear: null,
                  joiningDate: null,
                  confirmationIssuedAt: null,
                },
                data: {
                  confirmationReference: reference,
                  confirmationSequence: sequence.lastValue,
                  confirmationYear: year,
                  joiningDate,
                  confirmationIssuedAt: now,
                },
              });
              if (claimed.count !== 1) throw new ConfirmationAssignmentRace();
              persisted = await transaction.internshipPayment.findUniqueOrThrow({
                where: { id: payment.id },
                include: { invoice: true, internshipApplication: true },
              });
            }

            const ready = this.trustedConfirmationLetter(persisted);
            return {
              filename: confirmationLetterFilename(ready),
              bytes: await generateInternshipConfirmationPdf(ready),
            };
          },
          { isolationLevel: "Serializable" },
        );
      } catch (error) {
        if (
          attempt < 2 &&
          (error instanceof ConfirmationAssignmentRace ||
            isSerializationConflict(error))
        ) continue;
        if (error instanceof JoiningDateError) {
          throw new BadRequestException("Enter a valid date of joining.");
        }
        if (error instanceof ConfirmationAssignmentRace || isUniqueConflict(error)) {
          throw new ConflictException(
            "The confirmation letter is temporarily unavailable.",
          );
        }
        throw error;
      }
    }

    throw new ConflictException(
      "The confirmation letter is temporarily unavailable.",
    );
  }

  async invoice(access: PaymentAccess) {
    const payment = await this.authorizedPayment(access);
    if (payment.status !== "PAID") throw new ForbiddenException();
    const ready = this.trustedPaidInvoice(payment);
    return {
      filename: `Growblic-Payment-Receipt-${ready.invoiceNumber}.pdf`,
      bytes: await generateInternshipInvoicePdf(ready),
    };
  }

  private async database() {
    this.databaseModule ??= require("@growblic/database/client") as DatabaseModule;
    return this.databaseModule.prisma;
  }

  private async authorizedPayment(access: PaymentAccess, client?: DatabaseClient) {
    const database = client ?? await this.database();
    const payment = await database.internshipPayment.findUnique({
      where: { id: access.paymentId },
      include: { invoice: true, internshipApplication: true },
    });
    if (!payment || !access.accessToken || !this.safeTokenMatch(payment.accessTokenHash, access.accessToken)) {
      throw new NotFoundException();
    }
    return payment;
  }

  private safeTokenMatch(expected: string, token: string) {
    return constantTimeEqual(expected, sha256(token));
  }

  private requireDemoGateway() {
    if (
      process.env.NODE_ENV === "production" ||
      process.env.DEMO_PAYMENT_GATEWAY_ENABLED !== "true"
    ) {
      throw new NotFoundException();
    }
  }

  private assertDemoPaymentSession(payment: DatabaseClient) {
    const application = payment.internshipApplication;
    const plan = trustedPlan(payment.selectedDuration);
    const program = application
      ? trustedProgram(application.internshipSlug)
      : null;
    if (
      !application ||
      payment.gateway !== "DEMO" ||
      !payment.gatewayOrderId?.startsWith("demo_order_") ||
      payment.internshipApplicationId !== application.id ||
      !plan ||
      !program ||
      payment.internshipProgram !== program ||
      payment.amountPaise !== demoPaymentAmountPaise ||
      payment.currency !== "INR" ||
      payment.customerName !== application.candidateName ||
      payment.customerEmail !== application.email ||
      payment.customerPhone !== application.phone
    ) {
      throw new NotFoundException();
    }
  }

  private publicStatus(payment: {
    id: string; status: string; amountPaise: number; currency: string; selectedDuration: number;
    customerName: string; internshipProgram: string; invoice?: { id: string } | null;
  }, invoiceNumber?: string) {
    const paid = payment.status === "PAID" && Boolean(invoiceNumber);
    return {
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amountPaise,
      currency: payment.currency,
      durationDays: payment.selectedDuration,
      certificateEligible: paid,
      invoiceAvailable: paid,
      ...(paid ? { invoiceNumber, fullName: payment.customerName, program: payment.internshipProgram } : {}),
    };
  }

  private trustedPaidInvoice(payment: DatabaseClient) {
    if (!payment.invoice || !payment.internshipApplication) throw new ForbiddenException();
    try {
      return trustedInvoicePdfData(
        trustedPaidPaymentSource(payment, payment.internshipApplication),
        payment.invoice,
      );
    } catch (error) {
      if (error instanceof InvoiceStateError) throw new ConflictException();
      throw error;
    }
  }

  private trustedConfirmationLetter(payment: DatabaseClient) {
    if (!payment.invoice || !payment.internshipApplication) throw new ForbiddenException();
    try {
      return trustedConfirmationLetterData(
        payment,
        payment.internshipApplication,
        payment.invoice,
      );
    } catch (error) {
      if (error instanceof InvoiceStateError) throw new ConflictException();
      throw error;
    }
  }

  private serverNow() {
    return new Date();
  }

  private async assertGatewayPaymentMatches(payment: { gatewayOrderId: string; amountPaise: number; currency: string }, gateway: RazorpayPaymentSnapshot) {
    if (gateway.orderId !== payment.gatewayOrderId || gateway.amount !== payment.amountPaise || gateway.currency !== payment.currency) {
      throw new BadRequestException();
    }
  }

  private async settlePaid(paymentId: string, gateway: RazorpayPaymentSnapshot, webhook?: { eventId: string; eventType: string }) {
    const database = await this.database();
    try {
      return await database.$transaction(async (transaction: DatabaseClient) => {
        const payment = await transaction.internshipPayment.findUnique({
          where: { id: paymentId },
          include: { internshipApplication: true },
        });
        if (!payment) throw new NotFoundException();
        if (!payment.internshipApplication) throw new ConflictException();
        if (payment.gatewayPaymentId && payment.gatewayPaymentId !== gateway.id) throw new ConflictException();
        const paidAt = payment.paidAt ?? new Date();
        let source;
        try {
          source = trustedPaidPaymentSource(
            {
              ...payment,
              status: "PAID",
              paidAt,
              gatewayPaymentId: gateway.id,
              paymentMethod: gateway.method,
            },
            payment.internshipApplication,
          );
        } catch (error) {
          if (error instanceof InvoiceStateError) throw new ConflictException();
          throw error;
        }
        const updated = await transaction.internshipPayment.update({
          where: { id: payment.id },
          data: { status: "PAID", gatewayPaymentId: gateway.id, paymentMethod: gateway.method, paidAt },
        });
        await transaction.invoice.upsert({
          where: { paymentId: payment.id },
          create: {
            paymentId: payment.id,
            invoiceNumber: this.invoiceNumber(payment.id, paidAt),
            issuedAt: paidAt,
            customerName: source.customerName,
            customerEmail: source.customerEmail,
            customerPhone: source.customerPhone,
            description: `${source.program} internship - ${source.durationDays} days`,
            amountPaise: source.amountPaise,
            totalPaise: source.amountPaise,
            currency: source.currency,
          },
          update: {},
        });
        if (webhook) await transaction.paymentWebhookEvent.create({ data: webhook });
        return updated;
      });
    } catch (error) {
      if (webhook && isUniqueConflict(error)) {
        const payment = await database.internshipPayment.findUniqueOrThrow({ where: { id: paymentId } });
        return payment;
      }
      throw error;
    }
  }

  private invoiceNumber(paymentId: string, issuedAt: Date) {
    return `GB-INT-${issuedAt.getUTCFullYear()}-${paymentId.slice(-10).toUpperCase()}`;
  }

  private async recordWebhook(eventId: string, eventType: string) {
    try {
      await (await this.database()).paymentWebhookEvent.create({ data: { eventId, eventType } });
    } catch (error) {
      if (!isUniqueConflict(error)) throw error;
    }
  }

  private async deliverInvoice(paymentId: string) {
    const database = await this.database();
    const staleProcessing = new Date(Date.now() - 10 * 60 * 1000);
    const claimed = await database.invoice.updateMany({
      where: {
        paymentId,
        OR: [
          { deliveryStatus: { in: ["PENDING", "FAILED"] } },
          { deliveryStatus: "PROCESSING", updatedAt: { lt: staleProcessing } },
        ],
      },
      data: { deliveryStatus: "PROCESSING", deliveryError: null },
    });
    if (claimed.count === 0) return;
    const payment = await database.internshipPayment.findUnique({
      where: { id: paymentId },
      include: { invoice: true, internshipApplication: true },
    });
    if (!payment?.invoice || !payment.internshipApplication) return;
    try {
      const ready = this.trustedPaidInvoice(payment);
      const pdf = await generateInternshipInvoicePdf(ready);
      const attachment = { filename: `Growblic-Payment-Receipt-${payment.invoice.invoiceNumber}.pdf`, content: Buffer.from(pdf).toString("base64") };
      const send = async (to: string, audience: "customer" | "admin") => {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            authorization: `Bearer ${requiredEnvironment("RESEND_API_KEY")}`,
            "content-type": "application/json",
            "idempotency-key": `internship-invoice/${payment.invoice?.id}/${audience}`,
          },
          body: JSON.stringify({
            from: requiredEnvironment("INVOICE_FROM_EMAIL"),
            to: [to],
            subject: `Growblic internship payment invoice ${payment.invoice?.invoiceNumber}`,
            html: `<p>Hello ${audience === "customer" ? this.escapeHtml(payment.customerName) : "Growblic Finance"},</p><p>The verified internship payment invoice is attached.</p>`,
            attachments: [attachment],
          }),
        });
        if (!response.ok) throw new Error(`Resend returned ${response.status}`);
      };
      await Promise.all([
        send(payment.customerEmail, "customer"),
        send(requiredEnvironment("INVOICE_ADMIN_EMAIL"), "admin"),
      ]);
      await database.invoice.update({ where: { id: payment.invoice.id }, data: { deliveryStatus: "SENT", deliveredAt: new Date(), deliveryError: null } });
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : "Invoice delivery failed";
      await database.invoice.update({ where: { id: payment.invoice.id }, data: { deliveryStatus: "FAILED", deliveryError: message } });
      this.logger.failure({ paymentId, errorCode: "INVOICE_DELIVERY_FAILED" }, "invoice delivery failed");
    }
  }

  private escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
  }

  private async razorpayRequest(path: string, init: RequestInit = {}) {
    const keyId = razorpayTestKeyId();
    const secret = requiredEnvironment("RAZORPAY_KEY_SECRET");
    const response = await fetch(`https://api.razorpay.com/v1${path}`, {
      ...init,
      headers: { authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`, "content-type": "application/json", ...init.headers },
    });
    if (!response.ok) throw new ServiceUnavailableException();
    return await response.json() as Record<string, unknown>;
  }
}
