-- CreateEnum
CREATE TYPE "PublicUserAccountStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "public_user_accounts" (
    "id" TEXT NOT NULL,
    "email_normalized" TEXT NOT NULL,
    "email_display" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" TEXT,
    "full_name" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "status" "PublicUserAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "failed_login_count" INTEGER NOT NULL DEFAULT 0,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "public_user_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_user_sessions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "public_user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_user_password_reset_tokens" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "public_user_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_user_auth_attempts" (
    "id" TEXT NOT NULL,
    "email_hash" TEXT NOT NULL,
    "ip_address_hash" TEXT,
    "action" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_user_auth_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_user_accounts_email_normalized_key" ON "public_user_accounts"("email_normalized");

-- CreateIndex
CREATE INDEX "public_user_accounts_status_idx" ON "public_user_accounts"("status");

-- CreateIndex
CREATE INDEX "public_user_accounts_created_at_idx" ON "public_user_accounts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "public_user_sessions_token_hash_key" ON "public_user_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "public_user_sessions_account_id_idx" ON "public_user_sessions"("account_id");

-- CreateIndex
CREATE INDEX "public_user_sessions_expires_at_idx" ON "public_user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "public_user_sessions_revoked_at_idx" ON "public_user_sessions"("revoked_at");

-- CreateIndex
CREATE INDEX "public_user_sessions_created_at_idx" ON "public_user_sessions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "public_user_password_reset_tokens_token_hash_key" ON "public_user_password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "public_user_password_reset_tokens_account_id_idx" ON "public_user_password_reset_tokens"("account_id");

-- CreateIndex
CREATE INDEX "public_user_password_reset_tokens_expires_at_idx" ON "public_user_password_reset_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "public_user_auth_attempts_email_hash_action_created_at_idx" ON "public_user_auth_attempts"("email_hash", "action", "created_at");

-- CreateIndex
CREATE INDEX "public_user_auth_attempts_ip_address_hash_action_created_at_idx" ON "public_user_auth_attempts"("ip_address_hash", "action", "created_at");

-- AddForeignKey
ALTER TABLE "public_user_sessions" ADD CONSTRAINT "public_user_sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public_user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_user_password_reset_tokens" ADD CONSTRAINT "public_user_password_reset_tokens_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public_user_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
