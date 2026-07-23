import {
  Controller,
  Get,
  Headers,
  Param,
  StreamableFile,
} from "@nestjs/common";
import { InternshipCertificateInternalService } from "./internship-certificate.internal.service";

@Controller("internal/internship-certificates")
export class InternshipCertificateInternalController {
  constructor(private readonly certificates: InternshipCertificateInternalService) {}

  @Get(":id/preview")
  async preview(
    @Param("id") id: string,
    @Headers("x-internship-certificate-internal-token") token = "",
  ) {
    const certificate = await this.certificates.preview(id, token);
    return new StreamableFile(Buffer.from(certificate.bytes), {
      type: "application/pdf",
      disposition: `inline; filename="${certificate.filename}"`,
    });
  }

  @Get(":id/offer-letter")
  async offerLetter(
    @Param("id") id: string,
    @Headers("x-internship-certificate-internal-token") token = "",
  ) {
    const document = await this.certificates.offerLetter(id, token);
    return new StreamableFile(Buffer.from(document.bytes), {
      type: "application/pdf",
      disposition: `inline; filename="${document.filename}"`,
    });
  }
}
