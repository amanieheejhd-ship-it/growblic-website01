import { Injectable } from "@nestjs/common";

import type { PreparedPublicSubmission } from "./public-submission.core";

// Prisma is loaded lazily so unit tests do not require a database connection.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublicSubmissionDatabase = any;

export const PUBLIC_SUBMISSION_STORE = Symbol("PUBLIC_SUBMISSION_STORE");

export type PublicSubmissionStore = {
  save(submission: PreparedPublicSubmission): Promise<void>;
};

export async function persistPublicSubmission(
  database: PublicSubmissionDatabase,
  submission: PreparedPublicSubmission,
) {
  switch (submission.kind) {
    case "contact": {
      const id = `contact_${submission.submissionKey}`;
      await database.contactEnquiry.upsert({
        where: { id },
        update: { id },
        create: { id, ...submission.data },
        select: { id: true },
      });
      return;
    }
    case "project-request":
    case "price-calculator":
      await database.quoteRequest.upsert({
        where: { submissionKey: submission.data.submissionKey },
        update: { submissionKey: submission.data.submissionKey },
        create: submission.data,
        select: { id: true },
      });
      return;
    case "meetup":
      await database.meetingRequest.upsert({
        where: { submissionKey: submission.data.submissionKey },
        update: { submissionKey: submission.data.submissionKey },
        create: submission.data,
        select: { id: true },
      });
      return;
    case "career-application":
      await database.careerApplication.upsert({
        where: { submissionKey: submission.data.submissionKey },
        update: { submissionKey: submission.data.submissionKey },
        create: submission.data,
        select: { id: true },
      });
      return;
    case "internship-application":
      await database.internshipApplication.upsert({
        where: { submissionKey: submission.data.submissionKey },
        update: { submissionKey: submission.data.submissionKey },
        create: submission.data,
        select: { id: true },
      });
  }
}

@Injectable()
export class PrismaPublicSubmissionStore implements PublicSubmissionStore {
  private databaseModule: { prisma: PublicSubmissionDatabase } | null = null;

  async save(submission: PreparedPublicSubmission) {
    this.databaseModule ??= require("@growblic/database/client") as {
      prisma: PublicSubmissionDatabase;
    };
    await persistPublicSubmission(this.databaseModule.prisma, submission);
  }
}
