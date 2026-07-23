import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";

import type { PublicSubmissionKind } from "./public-submission.core";
import { PublicSubmissionsService } from "./public-submissions.service";

@Controller("public-submissions")
export class PublicSubmissionsController {
  constructor(private readonly submissions: PublicSubmissionsService) {}

  @Post("contact")
  contact(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.submit("contact", body, response);
  }

  @Post("project-requests")
  projectRequest(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.submit("project-request", body, response);
  }

  @Post("price-calculator")
  priceCalculator(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.submit("price-calculator", body, response);
  }

  @Post("meetups")
  meetup(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.submit("meetup", body, response);
  }

  @Post("career-applications")
  careerApplication(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.submit("career-application", body, response);
  }

  @Post("internship-applications")
  internshipApplication(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    return this.submit("internship-application", body, response);
  }

  private async submit(kind: PublicSubmissionKind, body: unknown, response: Response) {
    const result = await this.submissions.submit(kind, body);
    response.setHeader("Cache-Control", "no-store, max-age=0");
    response.status(result.status);
    return result.body;
  }
}
