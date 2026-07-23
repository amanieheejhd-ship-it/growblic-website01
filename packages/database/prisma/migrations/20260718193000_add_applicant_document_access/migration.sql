CREATE TYPE "InternshipApplicantDocumentType" AS ENUM (
  'INTERNSHIP_LETTER',
  'CERTIFICATE'
);

CREATE TYPE "InternshipApplicantDocumentActorType" AS ENUM (
  'APPLICANT',
  'ADMIN'
);

CREATE TYPE "InternshipApplicantDocumentAction" AS ENUM (
  'VIEW',
  'DOWNLOAD'
);

CREATE TABLE "internship_applicant_document_accesses" (
  "id" TEXT NOT NULL,
  "account_id" TEXT NOT NULL,
  "document_type" "InternshipApplicantDocumentType" NOT NULL,
  "document_id" TEXT NOT NULL,
  "actor_type" "InternshipApplicantDocumentActorType" NOT NULL,
  "action" "InternshipApplicantDocumentAction" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "internship_applicant_document_accesses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "internship_applicant_document_access_account_doc_actor_action"
  ON "internship_applicant_document_accesses"("account_id", "document_type", "actor_type", "action", "created_at");
CREATE INDEX "internship_applicant_document_accesses_document_type_document_id_idx"
  ON "internship_applicant_document_accesses"("document_type", "document_id");
CREATE INDEX "internship_applicant_document_accesses_created_at_idx"
  ON "internship_applicant_document_accesses"("created_at");

ALTER TABLE "internship_applicant_document_accesses"
  ADD CONSTRAINT "internship_applicant_document_accesses_account_id_fkey"
  FOREIGN KEY ("account_id") REFERENCES "internship_applicant_accounts"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
