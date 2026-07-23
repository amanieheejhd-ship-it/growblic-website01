import { Module } from "@nestjs/common";

import { InternshipCertificateEmailProvider } from "@growblic/internship-shared";
import { InternshipCertificateJobs } from "./internship-certificate.jobs";

@Module({
  providers: [InternshipCertificateEmailProvider, InternshipCertificateJobs],
})
export class CertificateJobsModule {}
