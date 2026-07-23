import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { constantTimeEqual, sha256 } from "@growblic/internship-shared";
import { generateInternshipCertificatePdf } from "@growblic/internship-shared";
import {
  confirmationLetterFilename,
  trustedConfirmationLetterData,
} from "@growblic/internship-shared";
import { generateInternshipConfirmationPdf } from "@growblic/internship-shared";

// Lazy loading preserves unit-test isolation from DATABASE_URL.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DatabaseClient = any;
type DatabaseModule = { prisma: DatabaseClient };

@Injectable()
export class InternshipCertificateInternalService {
  private databaseModule: DatabaseModule | null = null;

  async preview(id: string, suppliedToken: string) {
    this.authorize(suppliedToken);
    return this.previewById(id);
  }

  // Used by the in-process admin module; callers must authenticate the admin
  // session themselves before invoking this.
  async previewById(id: string) {
    if (!/^(?:c[a-z0-9]{20,}|cert_[a-f0-9]{32})$/.test(id)) throw new NotFoundException();
    const certificate = await (await this.database()).internshipCertificate.findUnique({
      where: { id },
      include: {
        application: true,
        payment: true,
        skills: { orderBy: { position: "asc" } },
      },
    });
    if (!certificate) throw new NotFoundException();
    if (certificate.pdfBytes) {
      return {
        filename: `Growblic-Internship-Certificate-${certificate.certificateNumber}.pdf`,
        bytes: certificate.pdfBytes,
      };
    }
    if (!certificate.joiningDate || !certificate.completionDate || certificate.skills.length === 0) {
      throw new NotFoundException();
    }
    return {
      filename: "Growblic-Internship-Certificate-Preview.pdf",
      bytes: await generateInternshipCertificatePdf({
        certificateNumber: certificate.certificateNumber ?? "GB-CERT-PREVIEW",
        issueDate: new Date(),
        candidateName: certificate.application.candidateName,
        program: certificate.payment.internshipProgram,
        designation: certificate.designation ?? certificate.payment.internshipProgram,
        durationDays: certificate.durationDays,
        joiningDate: certificate.joiningDate,
        completionDate: certificate.completionDate,
        skills: certificate.skills.map((skill: { name: string }) => skill.name),
        projectWork: certificate.projectWork,
        performanceSummary: certificate.performanceSummary,
        verificationReference: certificate.publicReference,
      }),
    };
  }

  async offerLetter(id: string, suppliedToken: string) {
    this.authorize(suppliedToken);
    return this.offerLetterById(id);
  }

  // Used by the in-process admin module; callers must authenticate the admin
  // session themselves before invoking this.
  async offerLetterById(id: string) {
    if (!/^(?:c[a-z0-9]{20,}|cert_[a-f0-9]{32})$/.test(id)) throw new NotFoundException();
    const certificate = await (await this.database()).internshipCertificate.findUnique({
      where: { id },
      include: {
        application: true,
        payment: { include: { invoice: true } },
      },
    });
    if (!certificate?.payment?.invoice || certificate.payment.status !== "PAID") {
      throw new NotFoundException();
    }
    const ready = trustedConfirmationLetterData(
      certificate.payment,
      certificate.application,
      certificate.payment.invoice,
    );
    return {
      filename: confirmationLetterFilename(ready),
      bytes: await generateInternshipConfirmationPdf(ready),
    };
  }

  private authorize(suppliedToken: string) {
    const expected = process.env.INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN?.trim();
    if (!expected) throw new ServiceUnavailableException();
    if (!suppliedToken || !constantTimeEqual(sha256(expected), sha256(suppliedToken))) {
      throw new UnauthorizedException();
    }
  }

  private async database() {
    this.databaseModule ??= require("@growblic/database/client") as DatabaseModule;
    return this.databaseModule.prisma;
  }
}
