import { Module } from "@nestjs/common";

import { InternshipPaymentService } from "./internship-payment.service";
import { InternshipPaymentsController } from "./internship-payments.controller";
import { InternshipCertificateEmailProvider } from "@growblic/internship-shared";
import { InternshipCertificateInternalController } from "./internship-certificate.internal.controller";
import { InternshipCertificateInternalService } from "./internship-certificate.internal.service";

@Module({
  controllers: [
    InternshipPaymentsController,
    InternshipCertificateInternalController,
  ],
  providers: [
    InternshipPaymentService,
    InternshipCertificateEmailProvider,
    InternshipCertificateInternalService,
  ],
  exports: [InternshipCertificateInternalService],
})
export class InternshipPaymentsModule {}
