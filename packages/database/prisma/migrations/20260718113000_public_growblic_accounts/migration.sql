ALTER TYPE "InternshipApplicantAccountStatus" ADD VALUE IF NOT EXISTS 'DISABLED';

ALTER TABLE "internship_applicant_accounts"
    ADD COLUMN IF NOT EXISTS "failed_login_count" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS "internship_applicant_password_reset_tokens" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,
    CONSTRAINT "internship_applicant_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "internship_applicant_email_verification_tokens" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,
    CONSTRAINT "internship_applicant_email_verification_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "internship_applicant_password_reset_tokens_token_hash_key"
    ON "internship_applicant_password_reset_tokens"("token_hash");
CREATE UNIQUE INDEX IF NOT EXISTS "internship_applicant_email_verification_tokens_token_hash_key"
    ON "internship_applicant_email_verification_tokens"("token_hash");

CREATE INDEX IF NOT EXISTS "internship_applicant_password_reset_tokens_account_id_idx"
    ON "internship_applicant_password_reset_tokens"("account_id");
CREATE INDEX IF NOT EXISTS "internship_applicant_password_reset_tokens_expires_at_idx"
    ON "internship_applicant_password_reset_tokens"("expires_at");
CREATE INDEX IF NOT EXISTS "internship_applicant_password_reset_tokens_used_at_idx"
    ON "internship_applicant_password_reset_tokens"("used_at");
CREATE INDEX IF NOT EXISTS "internship_applicant_password_reset_tokens_created_at_idx"
    ON "internship_applicant_password_reset_tokens"("created_at");

CREATE INDEX IF NOT EXISTS "internship_applicant_email_verification_tokens_account_id_idx"
    ON "internship_applicant_email_verification_tokens"("account_id");
CREATE INDEX IF NOT EXISTS "internship_applicant_email_verification_tokens_expires_at_idx"
    ON "internship_applicant_email_verification_tokens"("expires_at");
CREATE INDEX IF NOT EXISTS "internship_applicant_email_verification_tokens_used_at_idx"
    ON "internship_applicant_email_verification_tokens"("used_at");
CREATE INDEX IF NOT EXISTS "internship_applicant_email_verification_tokens_created_at_idx"
    ON "internship_applicant_email_verification_tokens"("created_at");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'internship_applicant_password_reset_tokens_account_id_fkey'
    ) THEN
        ALTER TABLE "internship_applicant_password_reset_tokens"
            ADD CONSTRAINT "internship_applicant_password_reset_tokens_account_id_fkey"
            FOREIGN KEY ("account_id") REFERENCES "internship_applicant_accounts"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'internship_applicant_email_verification_tokens_account_id_fkey'
    ) THEN
        ALTER TABLE "internship_applicant_email_verification_tokens"
            ADD CONSTRAINT "internship_applicant_email_verification_tokens_account_id_fkey"
            FOREIGN KEY ("account_id") REFERENCES "internship_applicant_accounts"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
