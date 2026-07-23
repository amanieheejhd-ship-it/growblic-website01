-- Preserve existing applicant accounts and allow future social-only accounts.
ALTER TABLE "internship_applicant_accounts" ALTER COLUMN "password_hash" DROP NOT NULL;

ALTER TABLE "internship_applications"
  ADD COLUMN "selected_plan_id" TEXT,
  ADD COLUMN "selected_plan_name" TEXT,
  ADD COLUMN "selected_plan_duration" INTEGER,
  ADD COLUMN "selected_plan_amount_paise" INTEGER,
  ADD COLUMN "selected_plan_currency" TEXT,
  ADD COLUMN "plan_selected_at" TIMESTAMP(3);

CREATE INDEX "internship_applications_selected_plan_duration_idx"
  ON "internship_applications"("selected_plan_duration");

CREATE TABLE "internship_applicant_oauth_identities" (
  "id" TEXT NOT NULL,
  "account_id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_subject" TEXT NOT NULL,
  "provider_email" TEXT,
  "provider_email_verified" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "internship_applicant_oauth_identities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "internship_applicant_oauth_identities_provider_provider_subject_key"
  ON "internship_applicant_oauth_identities"("provider", "provider_subject");
CREATE INDEX "internship_applicant_oauth_identities_account_id_idx"
  ON "internship_applicant_oauth_identities"("account_id");
CREATE INDEX "internship_applicant_oauth_identities_provider_email_idx"
  ON "internship_applicant_oauth_identities"("provider_email");

ALTER TABLE "internship_applicant_oauth_identities"
  ADD CONSTRAINT "internship_applicant_oauth_identities_account_id_fkey"
  FOREIGN KEY ("account_id") REFERENCES "internship_applicant_accounts"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "internship_applicant_auth_flows" (
  "id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "application_id" TEXT NOT NULL,
  "selected_plan_id" TEXT NOT NULL,
  "selected_plan_name" TEXT NOT NULL,
  "selected_plan_duration" INTEGER NOT NULL,
  "selected_plan_amount_paise" INTEGER NOT NULL,
  "selected_plan_currency" TEXT NOT NULL DEFAULT 'INR',
  "provider" TEXT,
  "oauth_state_hash" TEXT,
  "oauth_code_verifier" TEXT,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ip_address" TEXT,
  "user_agent" TEXT,

  CONSTRAINT "internship_applicant_auth_flows_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "internship_applicant_auth_flows_token_hash_key"
  ON "internship_applicant_auth_flows"("token_hash");
CREATE UNIQUE INDEX "internship_applicant_auth_flows_oauth_state_hash_key"
  ON "internship_applicant_auth_flows"("oauth_state_hash");
CREATE INDEX "internship_applicant_auth_flows_application_id_idx"
  ON "internship_applicant_auth_flows"("application_id");
CREATE INDEX "internship_applicant_auth_flows_expires_at_idx"
  ON "internship_applicant_auth_flows"("expires_at");
CREATE INDEX "internship_applicant_auth_flows_consumed_at_idx"
  ON "internship_applicant_auth_flows"("consumed_at");
CREATE INDEX "internship_applicant_auth_flows_provider_idx"
  ON "internship_applicant_auth_flows"("provider");

ALTER TABLE "internship_applicant_auth_flows"
  ADD CONSTRAINT "internship_applicant_auth_flows_application_id_fkey"
  FOREIGN KEY ("application_id") REFERENCES "internship_applications"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
