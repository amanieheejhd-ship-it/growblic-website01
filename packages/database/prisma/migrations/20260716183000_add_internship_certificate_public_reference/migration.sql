-- Add a short, public tracking reference without changing internal identifiers.
ALTER TABLE "internship_certificates"
ADD COLUMN "public_reference" TEXT;

-- Existing records receive a deterministic, collision-free reference per paid year.
-- The eight-digit suffix remains within the required uppercase alphanumeric format.
WITH ranked_certificates AS (
    SELECT
        "id",
        lpad(
            (EXTRACT(YEAR FROM "paid_at")::INTEGER % 100)::TEXT,
            2,
            '0'
        ) AS reference_year,
        row_number() OVER (
            PARTITION BY EXTRACT(YEAR FROM "paid_at")::INTEGER
            ORDER BY "created_at", "id"
        ) AS reference_sequence
    FROM "internship_certificates"
    WHERE "public_reference" IS NULL
)
UPDATE "internship_certificates" AS certificate
SET "public_reference" =
    'GB'
    || ranked.reference_year
    || lpad(ranked.reference_sequence::TEXT, 8, '0')
FROM ranked_certificates AS ranked
WHERE certificate."id" = ranked."id";

ALTER TABLE "internship_certificates"
ALTER COLUMN "public_reference" SET NOT NULL;

ALTER TABLE "internship_certificates"
ADD CONSTRAINT "internship_certificates_public_reference_format_check"
CHECK ("public_reference" ~ '^GB[0-9]{2}[A-Z0-9]{8}$');

CREATE UNIQUE INDEX "internship_certificates_public_reference_key"
ON "internship_certificates"("public_reference");
