-- CreateTable
CREATE TABLE "career_applications" (
    "id" TEXT NOT NULL,
    "submission_key" TEXT NOT NULL,
    "candidate_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "work_links" TEXT[],
    "message" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internship_applications" (
    "id" TEXT NOT NULL,
    "submission_key" TEXT NOT NULL,
    "internship_slug" TEXT NOT NULL,
    "candidate_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "institute_enrollment" TEXT NOT NULL,
    "institute_name" TEXT,
    "course" TEXT,
    "enrollment_number" TEXT,
    "highest_qualification" TEXT,
    "passing_year" TEXT,
    "message" TEXT,
    "status" "JobApplicationStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internship_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_requests" (
    "id" TEXT NOT NULL,
    "submission_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meeting_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_requests" (
    "id" TEXT NOT NULL,
    "submission_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "location" TEXT,
    "service" TEXT,
    "budget" TEXT,
    "requirements" TEXT NOT NULL,
    "calculator_data" JSONB,
    "source" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "career_applications_submission_key_key" ON "career_applications"("submission_key");

-- CreateIndex
CREATE INDEX "career_applications_email_idx" ON "career_applications"("email");

-- CreateIndex
CREATE INDEX "career_applications_role_idx" ON "career_applications"("role");

-- CreateIndex
CREATE INDEX "career_applications_status_idx" ON "career_applications"("status");

-- CreateIndex
CREATE INDEX "career_applications_created_at_idx" ON "career_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "internship_applications_submission_key_key" ON "internship_applications"("submission_key");

-- CreateIndex
CREATE INDEX "internship_applications_email_idx" ON "internship_applications"("email");

-- CreateIndex
CREATE INDEX "internship_applications_internship_slug_idx" ON "internship_applications"("internship_slug");

-- CreateIndex
CREATE INDEX "internship_applications_status_idx" ON "internship_applications"("status");

-- CreateIndex
CREATE INDEX "internship_applications_created_at_idx" ON "internship_applications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_requests_submission_key_key" ON "meeting_requests"("submission_key");

-- CreateIndex
CREATE INDEX "meeting_requests_email_idx" ON "meeting_requests"("email");

-- CreateIndex
CREATE INDEX "meeting_requests_status_idx" ON "meeting_requests"("status");

-- CreateIndex
CREATE INDEX "meeting_requests_created_at_idx" ON "meeting_requests"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "quote_requests_submission_key_key" ON "quote_requests"("submission_key");

-- CreateIndex
CREATE INDEX "quote_requests_email_idx" ON "quote_requests"("email");

-- CreateIndex
CREATE INDEX "quote_requests_status_idx" ON "quote_requests"("status");

-- CreateIndex
CREATE INDEX "quote_requests_created_at_idx" ON "quote_requests"("created_at");
