-- Additive, trusted confirmation-letter issuance state. Create only; deploy separately.
ALTER TABLE "internship_payments"
    ADD COLUMN "confirmation_reference" TEXT,
    ADD COLUMN "confirmation_sequence" INTEGER,
    ADD COLUMN "confirmation_year" INTEGER,
    ADD COLUMN "joining_date" TIMESTAMP(3),
    ADD COLUMN "confirmation_issued_at" TIMESTAMP(3);

CREATE TABLE "internship_confirmation_sequences" (
    "year" INTEGER NOT NULL,
    "last_value" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "internship_confirmation_sequences_pkey" PRIMARY KEY ("year"),
    CONSTRAINT "internship_confirmation_sequences_last_value_check"
        CHECK ("last_value" BETWEEN 1 AND 999999)
);

CREATE UNIQUE INDEX "internship_payments_confirmation_reference_key"
    ON "internship_payments"("confirmation_reference");
CREATE UNIQUE INDEX "internship_payments_confirmation_year_confirmation_sequence_key"
    ON "internship_payments"("confirmation_year", "confirmation_sequence");
CREATE INDEX "internship_payments_confirmation_issued_at_idx"
    ON "internship_payments"("confirmation_issued_at");

ALTER TABLE "internship_payments"
    ADD CONSTRAINT "internship_payments_confirmation_sequence_check"
        CHECK ("confirmation_sequence" IS NULL OR "confirmation_sequence" BETWEEN 1 AND 999999),
    ADD CONSTRAINT "internship_payments_confirmation_year_check"
        CHECK ("confirmation_year" IS NULL OR "confirmation_year" BETWEEN 2000 AND 9999),
    ADD CONSTRAINT "internship_payments_confirmation_fields_complete_check"
        CHECK (
            ("confirmation_reference" IS NULL
                AND "confirmation_sequence" IS NULL
                AND "confirmation_year" IS NULL
                AND "joining_date" IS NULL
                AND "confirmation_issued_at" IS NULL)
            OR
            ("confirmation_reference" IS NOT NULL
                AND "confirmation_sequence" IS NOT NULL
                AND "confirmation_year" IS NOT NULL
                AND "joining_date" IS NOT NULL
                AND "confirmation_issued_at" IS NOT NULL)
        );
