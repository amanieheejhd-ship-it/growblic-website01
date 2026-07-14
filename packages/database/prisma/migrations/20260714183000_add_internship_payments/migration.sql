-- Additive payment and invoice foundation. Review and deploy only after explicit approval.
CREATE TYPE "InternshipPaymentStatus" AS ENUM ('CREATED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "InvoiceDeliveryStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

CREATE TABLE "internship_payments" (
    "id" TEXT NOT NULL,
    "internship_application_id" TEXT NOT NULL,
    "access_token_hash" TEXT NOT NULL,
    "gateway" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "gateway_order_id" TEXT NOT NULL,
    "gateway_payment_id" TEXT,
    "selected_duration" INTEGER NOT NULL,
    "internship_program" TEXT NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "InternshipPaymentStatus" NOT NULL DEFAULT 'CREATED',
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "payment_method" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "internship_payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount_paise" INTEGER NOT NULL,
    "total_paise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "delivery_status" "InvoiceDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "delivery_error" TEXT,
    "delivered_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_webhook_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payment_webhook_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "internship_payments_gateway_order_id_key" ON "internship_payments"("gateway_order_id");
CREATE UNIQUE INDEX "internship_payments_gateway_payment_id_key" ON "internship_payments"("gateway_payment_id");
CREATE UNIQUE INDEX "internship_payments_internship_application_id_key" ON "internship_payments"("internship_application_id");
CREATE INDEX "internship_payments_internship_application_id_status_idx" ON "internship_payments"("internship_application_id", "status");
CREATE INDEX "internship_payments_customer_email_idx" ON "internship_payments"("customer_email");
CREATE INDEX "internship_payments_status_created_at_idx" ON "internship_payments"("status", "created_at");
CREATE UNIQUE INDEX "invoices_payment_id_key" ON "invoices"("payment_id");
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");
CREATE INDEX "invoices_issued_at_idx" ON "invoices"("issued_at");
CREATE INDEX "invoices_delivery_status_idx" ON "invoices"("delivery_status");
CREATE UNIQUE INDEX "payment_webhook_events_event_id_key" ON "payment_webhook_events"("event_id");
CREATE INDEX "payment_webhook_events_event_type_idx" ON "payment_webhook_events"("event_type");
CREATE INDEX "payment_webhook_events_created_at_idx" ON "payment_webhook_events"("created_at");

ALTER TABLE "internship_payments" ADD CONSTRAINT "internship_payments_internship_application_id_fkey" FOREIGN KEY ("internship_application_id") REFERENCES "internship_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "internship_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
