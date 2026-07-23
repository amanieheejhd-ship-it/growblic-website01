-- Persist the admin-selected internship domain without changing existing records.
ALTER TABLE "internship_certificates"
ADD COLUMN "domain_role" TEXT;

ALTER TABLE "internship_certificate_skills"
DROP CONSTRAINT "internship_certificate_skills_position_check";

ALTER TABLE "internship_certificate_skills"
ADD CONSTRAINT "internship_certificate_skills_position_check"
CHECK ("position" BETWEEN 0 AND 24);
