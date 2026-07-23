-- Additive internship certificate lifecycle. Existing paid payments are backfilled
-- without guessing joining dates or generating certificates.
CREATE TYPE "InternshipCertificateStatus" AS ENUM (
    'PENDING_START_DATE', 'PENDING_SKILLS', 'READY', 'GENERATED',
    'EMAILED', 'EMAIL_FAILED', 'CANCELLED'
);
CREATE TYPE "InternshipCertificateReminderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');
CREATE TYPE "InternshipCertificateEmailStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');
CREATE TYPE "InternshipCertificateEmailKind" AS ENUM ('ADMIN_REMINDER', 'ADMIN_BLOCKED', 'CANDIDATE_CERTIFICATE');

CREATE TABLE "internship_certificates" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "joining_date" TIMESTAMP(3),
    "completion_date" TIMESTAMP(3),
    "reminder_due_at" TIMESTAMP(3),
    "status" "InternshipCertificateStatus" NOT NULL DEFAULT 'PENDING_START_DATE',
    "designation" TEXT,
    "project_work" TEXT,
    "performance_summary" TEXT,
    "conduct_note" TEXT,
    "remarks" TEXT,
    "certificate_number" TEXT,
    "certificate_sequence" INTEGER,
    "certificate_year" INTEGER,
    "issued_at" TIMESTAMP(3),
    "generated_at" TIMESTAMP(3),
    "pdf_bytes" BYTEA,
    "pdf_sha256" TEXT,
    "reminder_status" "InternshipCertificateReminderStatus" NOT NULL DEFAULT 'PENDING',
    "reminder_attempt_count" INTEGER NOT NULL DEFAULT 0,
    "reminder_sent_at" TIMESTAMP(3),
    "reminder_last_error" TEXT,
    "reminder_claim_token" TEXT,
    "reminder_claimed_at" TIMESTAMP(3),
    "email_status" "InternshipCertificateEmailStatus" NOT NULL DEFAULT 'PENDING',
    "email_attempt_count" INTEGER NOT NULL DEFAULT 0,
    "emailed_at" TIMESTAMP(3),
    "email_last_error" TEXT,
    "email_claim_token" TEXT,
    "email_claimed_at" TIMESTAMP(3),
    "next_email_attempt_at" TIMESTAMP(3),
    "blocked_alert_sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internship_certificates_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "internship_certificates_duration_check" CHECK ("duration_days" IN (30, 45, 60, 90, 180)),
    CONSTRAINT "internship_certificates_dates_complete_check" CHECK (
        ("joining_date" IS NULL AND "completion_date" IS NULL AND "reminder_due_at" IS NULL)
        OR
        ("joining_date" IS NOT NULL AND "completion_date" IS NOT NULL AND "reminder_due_at" IS NOT NULL)
    ),
    CONSTRAINT "internship_certificates_number_complete_check" CHECK (
        ("certificate_number" IS NULL AND "certificate_sequence" IS NULL AND "certificate_year" IS NULL)
        OR
        ("certificate_number" IS NOT NULL AND "certificate_sequence" IS NOT NULL AND "certificate_year" IS NOT NULL)
    ),
    CONSTRAINT "internship_certificates_application_id_fkey" FOREIGN KEY ("application_id")
        REFERENCES "internship_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "internship_certificates_payment_id_fkey" FOREIGN KEY ("payment_id")
        REFERENCES "internship_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "internship_certificate_skills" (
    "id" TEXT NOT NULL,
    "certificate_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internship_certificate_skills_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "internship_certificate_skills_position_check" CHECK ("position" BETWEEN 0 AND 19),
    CONSTRAINT "internship_certificate_skills_name_check" CHECK (char_length(btrim("name")) BETWEEN 1 AND 120),
    CONSTRAINT "internship_certificate_skills_certificate_id_fkey" FOREIGN KEY ("certificate_id")
        REFERENCES "internship_certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "internship_certificate_email_attempts" (
    "id" TEXT NOT NULL,
    "certificate_id" TEXT NOT NULL,
    "kind" "InternshipCertificateEmailKind" NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "provider_id" TEXT,
    "safe_error" TEXT,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internship_certificate_email_attempts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "internship_certificate_email_attempts_certificate_id_fkey" FOREIGN KEY ("certificate_id")
        REFERENCES "internship_certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "internship_certificate_sequences" (
    "year" INTEGER NOT NULL,
    "last_value" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internship_certificate_sequences_pkey" PRIMARY KEY ("year"),
    CONSTRAINT "internship_certificate_sequences_last_value_check" CHECK ("last_value" BETWEEN 1 AND 999999)
);

CREATE UNIQUE INDEX "internship_certificates_application_id_key" ON "internship_certificates"("application_id");
CREATE UNIQUE INDEX "internship_certificates_payment_id_key" ON "internship_certificates"("payment_id");
CREATE UNIQUE INDEX "internship_certificates_certificate_number_key" ON "internship_certificates"("certificate_number");
CREATE UNIQUE INDEX "internship_certificates_certificate_year_certificate_sequence_key"
    ON "internship_certificates"("certificate_year", "certificate_sequence");
CREATE INDEX "internship_certificates_status_idx" ON "internship_certificates"("status");
CREATE INDEX "internship_certificates_completion_date_idx" ON "internship_certificates"("completion_date");
CREATE INDEX "internship_certificates_reminder_due_at_idx" ON "internship_certificates"("reminder_due_at");
CREATE INDEX "internship_certificates_emailed_at_idx" ON "internship_certificates"("emailed_at");
CREATE INDEX "internship_certificates_reminder_status_reminder_due_at_idx"
    ON "internship_certificates"("reminder_status", "reminder_due_at");
CREATE INDEX "internship_certificates_email_status_completion_date_next_email_attempt_at_idx"
    ON "internship_certificates"("email_status", "completion_date", "next_email_attempt_at");
CREATE UNIQUE INDEX "internship_certificate_skills_certificate_id_position_key"
    ON "internship_certificate_skills"("certificate_id", "position");
CREATE INDEX "internship_certificate_skills_certificate_id_idx" ON "internship_certificate_skills"("certificate_id");
CREATE UNIQUE INDEX "internship_certificate_email_attempts_idempotency_key_key"
    ON "internship_certificate_email_attempts"("idempotency_key");
CREATE INDEX "internship_certificate_email_attempts_certificate_id_kind_attempted_at_idx"
    ON "internship_certificate_email_attempts"("certificate_id", "kind", "attempted_at");
CREATE INDEX "internship_certificate_email_attempts_successful_attempted_at_idx"
    ON "internship_certificate_email_attempts"("successful", "attempted_at");

INSERT INTO "internship_certificates" (
    "id", "application_id", "payment_id", "duration_days", "paid_at",
    "joining_date", "completion_date", "reminder_due_at", "status"
)
SELECT
    'cert_' || md5(p."id"), p."internship_application_id", p."id",
    p."selected_duration", p."paid_at",
    p."joining_date",
    CASE WHEN p."joining_date" IS NULL THEN NULL
         ELSE p."joining_date" + (p."selected_duration" - 1) * INTERVAL '1 day' END,
    CASE WHEN p."joining_date" IS NULL THEN NULL
         ELSE p."joining_date" + (p."selected_duration" - 6) * INTERVAL '1 day' END,
    CASE WHEN p."joining_date" IS NULL THEN 'PENDING_START_DATE'::"InternshipCertificateStatus"
         ELSE 'PENDING_SKILLS'::"InternshipCertificateStatus" END
FROM "internship_payments" p
WHERE p."status" = 'PAID' AND p."paid_at" IS NOT NULL
ON CONFLICT ("payment_id") DO NOTHING;
