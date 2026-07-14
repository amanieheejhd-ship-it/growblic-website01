import { Inject, Injectable } from "@nestjs/common";

import { StructuredLogger } from "../../common/logging/structured-logger.service";
import {
  preparePublicSubmission,
  PublicSubmissionValidationError,
  type PublicSubmissionKind,
} from "./public-submission.core";
import {
  PUBLIC_SUBMISSION_STORE,
  type PublicSubmissionStore,
} from "./public-submission.store";

const SUCCESS_MESSAGE = "Thank you. Your request has been received.";

export type PublicSubmissionResult = {
  status: 201 | 400 | 500;
  body: {
    success: boolean;
    message: string;
    fieldErrors?: Record<string, string>;
  };
};

@Injectable()
export class PublicSubmissionsService {
  constructor(
    @Inject(PUBLIC_SUBMISSION_STORE) private readonly store: PublicSubmissionStore,
    private readonly logger: StructuredLogger,
  ) {}

  async submit(kind: PublicSubmissionKind, body: unknown): Promise<PublicSubmissionResult> {
    try {
      const prepared = await preparePublicSubmission(kind, body);
      if (!prepared.honeypot) await this.store.save(prepared.submission);
      return { status: 201, body: { success: true, message: SUCCESS_MESSAGE } };
    } catch (error) {
      if (error instanceof PublicSubmissionValidationError) {
        return {
          status: 400,
          body: {
            success: false,
            message: error.message,
            ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
          },
        };
      }

      this.logger.failure(
        { submissionType: kind, errorCode: "PUBLIC_SUBMISSION_SAVE_FAILED" },
        "public submission could not be saved",
      );
      return {
        status: 500,
        body: { success: false, message: "Unable to submit your request right now." },
      };
    }
  }
}
