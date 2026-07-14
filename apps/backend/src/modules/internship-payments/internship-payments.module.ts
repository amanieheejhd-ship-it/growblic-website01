import { Module } from "@nestjs/common";

import { InternshipPaymentService } from "./internship-payment.service";
import { InternshipPaymentsController } from "./internship-payments.controller";

@Module({
  controllers: [InternshipPaymentsController],
  providers: [InternshipPaymentService],
})
export class InternshipPaymentsModule {}
