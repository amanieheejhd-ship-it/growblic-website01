import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { InternshipCertificateInternalService } from "./internship-certificate.internal.service";

describe("internal certificate preview security", () => {
  it("fails closed without configuration and rejects a wrong service token", async () => {
    const previous = process.env.INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN;
    delete process.env.INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN;
    const service = new InternshipCertificateInternalService();
    try {
      await assert.rejects(service.preview("certificate", "token"), ServiceUnavailableException);
      process.env.INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN = "trusted-token";
      await assert.rejects(service.preview("certificate", "wrong-token"), UnauthorizedException);
    } finally {
      if (previous === undefined) delete process.env.INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN;
      else process.env.INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN = previous;
    }
  });
});
