-- Repair deployments where the lifecycle table exists without its public reference.
-- pgcrypto provides PostgreSQL's cryptographically secure random byte generator.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE "internship_certificates"
ADD COLUMN IF NOT EXISTS "public_reference" TEXT;

-- Enforce collision handling while nullable records are being backfilled.
CREATE UNIQUE INDEX IF NOT EXISTS "internship_certificates_public_reference_key"
ON "internship_certificates"("public_reference");

DO $$
DECLARE
    certificate RECORD;
    candidate TEXT;
BEGIN
    FOR certificate IN
        SELECT "id", "paid_at", "created_at"
        FROM "internship_certificates"
        WHERE "public_reference" IS NULL
              OR "public_reference" !~ '^GB[0-9]{2}[A-Z0-9]{8}$'
        ORDER BY "created_at", "id"
    LOOP
        LOOP
            candidate :=
                'GB'
             || to_char(
    COALESCE(certificate."paid_at", certificate."created_at", CURRENT_TIMESTAMP),
    'YY'
)
                || upper(substr(encode(gen_random_bytes(16), 'hex'), 1, 8));
            BEGIN
                UPDATE "internship_certificates"
                SET "public_reference" = candidate
                WHERE "id" = certificate."id"
                  AND (
    "public_reference" IS NULL
    OR "public_reference" !~ '^GB[0-9]{2}[A-Z0-9]{8}$'
);
                EXIT;
            EXCEPTION
                WHEN unique_violation THEN
                    -- A cryptographically improbable collision is retried safely.
            END;
        END LOOP;
    END LOOP;
END
$$;

ALTER TABLE "internship_certificates"
ALTER COLUMN "public_reference" SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'internship_certificates_public_reference_format_check'
          AND conrelid = 'internship_certificates'::regclass
    ) THEN
        ALTER TABLE "internship_certificates"
        ADD CONSTRAINT "internship_certificates_public_reference_format_check"
        CHECK ("public_reference" ~ '^GB[0-9]{2}[A-Z0-9]{8}$');
    END IF;
END
$$;

-- Database-side assignment protects future inserts outside the application service.
CREATE OR REPLACE FUNCTION "assign_internship_certificate_public_reference"()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    candidate TEXT;
BEGIN
    IF NEW."public_reference" IS NOT NULL THEN
        RETURN NEW;
    END IF;

    LOOP
        candidate :=
            'GB'
            || to_char(
    COALESCE(
        NEW."paid_at",
        NEW."created_at",
        CURRENT_TIMESTAMP
    ),
    'YY'
)
            || upper(substr(encode(gen_random_bytes(16), 'hex'), 1, 8));
        EXIT WHEN NOT EXISTS (
            SELECT 1
            FROM "internship_certificates"
            WHERE "public_reference" = candidate
        );
    END LOOP;

    NEW."public_reference" := candidate;
    RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS "internship_certificates_assign_public_reference"
ON "internship_certificates";

CREATE TRIGGER "internship_certificates_assign_public_reference"
BEFORE INSERT ON "internship_certificates"
FOR EACH ROW
EXECUTE FUNCTION "assign_internship_certificate_public_reference"();

