import { Module } from "@nestjs/common";

import {
  PrismaPublicSubmissionStore,
  PUBLIC_SUBMISSION_STORE,
} from "./public-submission.store";
import { PublicSubmissionsController } from "./public-submissions.controller";
import { PublicSubmissionsService } from "./public-submissions.service";

@Module({
  controllers: [PublicSubmissionsController],
  providers: [
    PublicSubmissionsService,
    PrismaPublicSubmissionStore,
    {
      provide: PUBLIC_SUBMISSION_STORE,
      useExisting: PrismaPublicSubmissionStore,
    },
  ],
})
export class PublicSubmissionsModule {}
