import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Req,
  StreamableFile,
} from "@nestjs/common";
import type { Request } from "express";

import { InternshipPaymentService } from "./internship-payment.service";

type RawBodyRequest = Request & { rawBody?: Buffer };

@Controller("internship-payments")
export class InternshipPaymentsController {
  constructor(private readonly payments: InternshipPaymentService) {}

  @Post("orders")
  createOrder(@Body() body: unknown) {
    return this.payments.createOrder(body);
  }

  @Post("demo-sessions")
  createDemoSession(@Body() body: unknown) {
    return this.payments.createDemoSession(body);
  }

  @Post("verify")
  verify(@Body() body: unknown) {
    return this.payments.verifyCheckout(body);
  }

  @Post("webhooks/razorpay")
  webhook(
    @Req() request: RawBodyRequest,
    @Headers("x-razorpay-signature") signature?: string,
    @Headers("x-razorpay-event-id") eventId?: string,
  ) {
    if (!request.rawBody) throw new BadRequestException();
    return this.payments.handleWebhook(request.rawBody, signature, eventId);
  }

  @Get(":id/status")
  status(@Param("id") paymentId: string, @Headers("x-payment-access-token") accessToken = "") {
    return this.payments.status({ paymentId, accessToken });
  }

  @Post(":id/demo-complete")
  completeDemoPayment(
    @Param("id") paymentId: string,
    @Headers("x-payment-access-token") accessToken = "",
  ) {
    return this.payments.completeDemoPayment({ paymentId, accessToken });
  }

  @Get(":id/invoice")
  async invoice(@Param("id") paymentId: string, @Headers("x-payment-access-token") accessToken = "") {
    const invoice = await this.payments.invoice({ paymentId, accessToken });
    return new StreamableFile(Buffer.from(invoice.bytes), {
      type: "application/pdf",
      disposition: `attachment; filename="${invoice.filename}"`,
    });
  }

  @Get(":id/certificate-eligibility")
  certificateEligibility(
    @Param("id") paymentId: string,
    @Headers("x-payment-access-token") accessToken = "",
  ) {
    return this.payments.certificateEligibility({ paymentId, accessToken });
  }

  @Post(":id/confirmation-letter")
  @Header("Cache-Control", "no-store")
  async confirmationLetter(
    @Param("id") paymentId: string,
    @Headers("x-payment-access-token") accessToken = "",
    @Body() body: unknown,
  ) {
    const letter = await this.payments.confirmationLetter(
      { paymentId, accessToken },
      body,
    );
    return new StreamableFile(Buffer.from(letter.bytes), {
      type: "application/pdf",
      disposition: `attachment; filename="${letter.filename}"`,
    });
  }
}
