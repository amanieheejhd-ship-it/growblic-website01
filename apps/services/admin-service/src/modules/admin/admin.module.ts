import { Module } from "@nestjs/common";

import { AdminAuthController } from "./admin-auth.controller";
import { AdminInternshipAccountsController } from "./admin-internship-accounts.controller";
import { AdminInternshipCertificatesController } from "./admin-internship-certificates.controller";
import { AdminSubmissionsController } from "./admin-submissions.controller";
import { InternshipCertificateProxyService } from "./internship-certificate-proxy.service";

@Module({
  controllers: [
    AdminAuthController,
    AdminSubmissionsController,
    AdminInternshipAccountsController,
    AdminInternshipCertificatesController,
  ],
  providers: [InternshipCertificateProxyService],
})
export class AdminModule {}
