CREATE TYPE "InternshipApplicantAccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

CREATE TABLE "internship_applicant_accounts" (
    "id" TEXT NOT NULL,
    "email_normalized" TEXT NOT NULL,
    "email_display" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "status" "InternshipApplicantAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "internship_applicant_accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "internship_applicant_sessions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,
    CONSTRAINT "internship_applicant_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "internship_applicant_auth_attempts" (
    "id" TEXT NOT NULL,
    "email_hash" TEXT NOT NULL,
    "ip_address_hash" TEXT,
    "action" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internship_applicant_auth_attempts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "internship_applications"
    ADD COLUMN "applicant_account_id" TEXT;

ALTER TABLE "internship_payments"
    ADD COLUMN "internship_started_at" TIMESTAMP(3),
    ADD COLUMN "expected_completion_at" TIMESTAMP(3),
    ADD COLUMN "completed_at" TIMESTAMP(3),
    ADD COLUMN "offer_letter_generated_at" TIMESTAMP(3),
    ADD COLUMN "certificate_available_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "internship_applicant_accounts_email_normalized_key"
    ON "internship_applicant_accounts"("email_normalized");
CREATE UNIQUE INDEX "internship_applicant_sessions_token_hash_key"
    ON "internship_applicant_sessions"("token_hash");

CREATE INDEX "internship_applicant_accounts_status_idx"
    ON "internship_applicant_accounts"("status");
CREATE INDEX "internship_applicant_accounts_created_at_idx"
    ON "internship_applicant_accounts"("created_at");
CREATE INDEX "internship_applicant_sessions_account_id_idx"
    ON "internship_applicant_sessions"("account_id");
CREATE INDEX "internship_applicant_sessions_expires_at_idx"
    ON "internship_applicant_sessions"("expires_at");
CREATE INDEX "internship_applicant_sessions_revoked_at_idx"
    ON "internship_applicant_sessions"("revoked_at");
CREATE INDEX "internship_applicant_sessions_created_at_idx"
    ON "internship_applicant_sessions"("created_at");
CREATE INDEX "internship_applicant_auth_attempts_email_hash_action_successful_created_at_idx"
    ON "internship_applicant_auth_attempts"("email_hash", "action", "successful", "created_at");
CREATE INDEX "internship_applicant_auth_attempts_ip_address_hash_action_successful_created_at_idx"
    ON "internship_applicant_auth_attempts"("ip_address_hash", "action", "successful", "created_at");
CREATE INDEX "internship_applicant_auth_attempts_created_at_idx"
    ON "internship_applicant_auth_attempts"("created_at");
CREATE INDEX "internship_applications_applicant_account_id_idx"
    ON "internship_applications"("applicant_account_id");

ALTER TABLE "internship_applicant_sessions"
    ADD CONSTRAINT "internship_applicant_sessions_account_id_fkey"
    FOREIGN KEY ("account_id") REFERENCES "internship_applicant_accounts"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "internship_applications"
    ADD CONSTRAINT "internship_applications_applicant_account_id_fkey"
    FOREIGN KEY ("applicant_account_id") REFERENCES "internship_applicant_accounts"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
