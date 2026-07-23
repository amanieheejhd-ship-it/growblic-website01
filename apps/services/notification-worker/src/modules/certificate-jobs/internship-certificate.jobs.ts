import { createHash, randomUUID } from "node:crypto";
import {
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import { StructuredLogger } from "@growblic/nest-common";
import {
  CERTIFICATE_MAX_EMAIL_ATTEMPTS,
  certificateCanGenerate,
  certificateNumber,
  daysRemaining,
  safeDeliveryError,
} from "@growblic/internship-shared";
import { InternshipCertificateEmailProvider } from "@growblic/internship-shared";
import { generateInternshipCertificatePdf } from "@growblic/internship-shared";

// Lazy loading preserves unit-test isolation from DATABASE_URL.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DatabaseClient = any;
type DatabaseModule = { prisma: DatabaseClient };
const HOUR_MS = 60 * 60 * 1000;
const CLAIM_STALE_MS = 20 * 60 * 1000;

export function certificateJobIntervalMs(
  value = process.env.INTERNSHIP_CERTIFICATE_JOB_INTERVAL_SECONDS,
) {
  if (value === undefined || value.trim() === "") return HOUR_MS;
  const seconds = Number(value);
  if (!Number.isInteger(seconds) || seconds < 15 || seconds > 86_400) {
    throw new Error("Invalid internship certificate job interval.");
  }
  return seconds * 1000;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character] ?? character);
}

function formatCalendarDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

@Injectable()
export class InternshipCertificateJobs
implements OnApplicationBootstrap, OnApplicationShutdown {
  private databaseModule: DatabaseModule | null = null;
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  constructor(
    private readonly email: InternshipCertificateEmailProvider,
    private readonly logger: StructuredLogger,
  ) {}

  onApplicationBootstrap() {
    console.log("=== InternshipCertificateJobs Bootstrapped ===");
    console.log(
      "JOBS_ENABLED =",
      process.env.INTERNSHIP_CERTIFICATE_JOBS_ENABLED,
    );

    // The notification worker exists to run these jobs: they are enabled by
    // default and only an explicit INTERNSHIP_CERTIFICATE_JOBS_ENABLED=false
    // opts out.
    if (process.env.INTERNSHIP_CERTIFICATE_JOBS_ENABLED === "false") return;

    const intervalMs = certificateJobIntervalMs();
    console.log("Certificate job interval ms =", intervalMs);

    void this.runDueJobs();

    this.timer = setInterval(() => {
      console.log("Running certificate jobs...");
      void this.runDueJobs();
    }, intervalMs);

    this.timer.unref();
  }

  onApplicationShutdown() {
    if (this.timer) clearInterval(this.timer);
  }

  async runDueJobs(now = new Date()) {
    if (this.running) return;
    this.running = true;
    try {
      await this.runReminders(now);
      await this.runCompletions(now);
    } catch (error) {
      console.error("INTERNSHIP CERTIFICATE JOB ACTUAL ERROR:", error);

      this.logger.failure(
        {
          errorCode: "INTERNSHIP_CERTIFICATE_JOB_FAILED",
          error:
            error instanceof Error
              ? {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                }
              : String(error),
        },
        "internship certificate job failed",
      );
    } finally {
      this.running = false;
    }
  }

  private async database() {
    this.databaseModule ??=
      require("@growblic/database/client") as DatabaseModule;

    if (!this.databaseModule.prisma) {
      throw new Error("Prisma database client is unavailable.");
    }

    return this.databaseModule.prisma;
  }

  private async runReminders(now: Date) {
    console.log("Checking reminders at", now.toISOString());
    const database = await this.database();
    const stale = new Date(now.getTime() - CLAIM_STALE_MS);
    const due = await database.internshipCertificate.findMany({
      where: {
        reminderDueAt: { lte: now },
        reminderSentAt: null,
        completionDate: { gt: now },
        OR: [
          { reminderStatus: { in: ["PENDING", "FAILED"] } },
          { reminderStatus: "PROCESSING", reminderClaimedAt: { lt: stale } },
        ],
      },
      select: { id: true },
      take: 50,
    });

    console.log("Due reminders:", due.length);

    for (const item of due) await this.sendReminder(item.id, now, stale);
  }

  private async sendReminder(id: string, now: Date, stale: Date) {
    const database = await this.database();
    const token = randomUUID();
    const claimed = await database.internshipCertificate.updateMany({
      where: {
        id,
        reminderSentAt: null,
        OR: [
          { reminderStatus: { in: ["PENDING", "FAILED"] } },
          { reminderStatus: "PROCESSING", reminderClaimedAt: { lt: stale } },
        ],
      },
      data: {
        reminderStatus: "PROCESSING",
        reminderClaimToken: token,
        reminderClaimedAt: now,
        reminderAttemptCount: { increment: 1 },
        reminderLastError: null,
      },
    });
    if (claimed.count !== 1) return;
    const certificate = await database.internshipCertificate.findFirst({
      where: { id, reminderClaimToken: token },
      include: { application: true, payment: true, skills: true },
    });
    if (!certificate?.completionDate) return;
    const recipient = process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL?.trim();
    console.log("Sending reminder to:", recipient);
    try {
      if (!recipient) throw new Error("Certificate admin email is not configured");
      const remaining = daysRemaining(certificate.completionDate, now);
      const adminBase = process.env.INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL?.trim();
      if (!adminBase) throw new Error("Certificate admin URL is not configured");
      const key = `internship-certificate/reminder/${certificate.id}`;
      const result = await this.email.send({
        to: recipient,
        idempotencyKey: key,
        subject: `Internship certificate details required — ${certificate.application.candidateName}`,
        html: `<p>Certificate details are due soon.</p>
<ul><li>Candidate: ${escapeHtml(certificate.application.candidateName)}</li>
<li>Email: ${escapeHtml(certificate.application.email)}</li>
<li>Phone: ${escapeHtml(certificate.application.phone)}</li>
<li>Application reference: ${escapeHtml(certificate.publicReference)}</li>
<li>Program: ${escapeHtml(certificate.payment.internshipProgram)}</li>
<li>Duration: ${certificate.durationDays} days</li>
<li>Joining date: ${formatCalendarDate(certificate.joiningDate)}</li>
<li>Completion date: ${formatCalendarDate(certificate.completionDate)}</li>
<li>Remaining time: ${remaining} days</li>
<li>Skills status: ${certificate.skills.length === 0 ? "Pending" : "Done"}</li></ul>
<p>Please open the Growblic Admin panel and add the candidate’s verified internship skills and completion details.</p>
<p><a href="${adminBase.replace(/\/$/, "")}/internship-certificates/?search=${encodeURIComponent(certificate.publicReference)}">Open certificate record</a></p>`,
      });
      console.log("Reminder email provider returned successfully");

      await database.$transaction([
        database.internshipCertificateEmailAttempt.create({
          data: {
            certificateId: id, kind: "ADMIN_REMINDER", idempotencyKey: key,
            recipient, successful: true, providerId: result.providerId,
          },
        }),
        database.internshipCertificate.updateMany({
          where: { id, reminderClaimToken: token, reminderSentAt: null },
          data: {
            reminderStatus: "SENT", reminderSentAt: now,
            reminderClaimToken: null, reminderClaimedAt: null,
          },
        }),
      ]);
    } catch (error) {
      const safeError = safeDeliveryError(error);
      this.logger.failure(
        { errorCode: "INTERNSHIP_CERTIFICATE_REMINDER_DELIVERY_FAILED" },
        "internship certificate reminder delivery failed",
      );
      try {
        await database.internshipCertificateEmailAttempt.create({
          data: {
            certificateId: id,
            kind: "ADMIN_REMINDER",
            idempotencyKey: `internship-certificate/reminder/${id}/attempt/${certificate.reminderAttemptCount}`,
            recipient: recipient ?? "unconfigured",
            successful: false,
            safeError,
          },
        });
      } catch {
        // Lifecycle state remains authoritative if audit insertion itself fails.
      }
      await database.internshipCertificate.updateMany({
        where: { id, reminderClaimToken: token },
        data: {
          reminderStatus: "FAILED", reminderLastError: safeError,
          reminderClaimToken: null, reminderClaimedAt: null,
        },
      });
    }
  }

  private async runCompletions(now: Date) {
    const database = await this.database();
    const stale = new Date(now.getTime() - CLAIM_STALE_MS);
    const due = await database.internshipCertificate.findMany({
      where: {
        completionDate: { lte: now },
        emailedAt: null,
        emailAttemptCount: { lt: CERTIFICATE_MAX_EMAIL_ATTEMPTS },
        OR: [
          { emailStatus: { in: ["PENDING", "FAILED"] }, nextEmailAttemptAt: null },
          { emailStatus: { in: ["PENDING", "FAILED"] }, nextEmailAttemptAt: { lte: now } },
          { emailStatus: "PROCESSING", emailClaimedAt: { lt: stale } },
        ],
      },
      select: { id: true },
      take: 50,
    });
    for (const item of due) await this.completeCertificate(item.id, now, stale);
  }

  private async completeCertificate(id: string, now: Date, stale: Date) {
    const database = await this.database();
    const token = randomUUID();
    const claimed = await database.internshipCertificate.updateMany({
      where: {
        id, emailedAt: null,
        emailAttemptCount: { lt: CERTIFICATE_MAX_EMAIL_ATTEMPTS },
        OR: [
          { emailStatus: { in: ["PENDING", "FAILED"] } },
          { emailStatus: "PROCESSING", emailClaimedAt: { lt: stale } },
        ],
      },
      data: {
        emailStatus: "PROCESSING", emailClaimToken: token, emailClaimedAt: now,
        emailLastError: null,
      },
    });
    if (claimed.count !== 1) return;
    let certificate = await database.internshipCertificate.findFirst({
      where: { id, emailClaimToken: token },
      include: { application: true, payment: true, skills: { orderBy: { position: "asc" } } },
    });
    if (!certificate) return;

    const trustedReady = certificateCanGenerate({
      paymentStatus: certificate.payment.status,
      applicationMatches:
        certificate.applicationId === certificate.payment.internshipApplicationId,
      joiningDate: certificate.joiningDate,
      completionDate: certificate.completionDate,
      status: certificate.status,
      skillCount: certificate.skills.length,
      emailedAt: certificate.emailedAt,
      now,
    });
    const trustedGenerated =
      certificate.payment.status === "PAID" &&
      certificate.applicationId === certificate.payment.internshipApplicationId &&
      Boolean(certificate.joiningDate && certificate.completionDate && certificate.completionDate <= now) &&
      certificate.skills.length > 0 &&
      Boolean(certificate.pdfBytes && certificate.generatedAt && certificate.certificateNumber) &&
      !certificate.emailedAt &&
      certificate.status === "GENERATED";
    if (!trustedReady && !trustedGenerated) {
      await database.internshipCertificate.updateMany({
        where: { id, emailClaimToken: token },
        data: {
          status: certificate.skills.length ? certificate.status : "PENDING_SKILLS",
          emailStatus: "PENDING", emailClaimToken: null, emailClaimedAt: null,
          nextEmailAttemptAt: new Date(now.getTime() + 24 * HOUR_MS),
        },
      });
      await this.alertBlocked(certificate, now);
      return;
    }

    try {
      await database.internshipCertificate.updateMany({
        where: { id, emailClaimToken: token },
        data: { emailAttemptCount: { increment: 1 } },
      });
      if (!certificate.pdfBytes) {
        certificate = await database.$transaction(async (transaction: DatabaseClient) => {
          const current = await transaction.internshipCertificate.findUniqueOrThrow({
            where: { id },
            include: { application: true, payment: true, skills: { orderBy: { position: "asc" } } },
          });
          let sequence = current.certificateSequence;
          let year = current.certificateYear;
          let number = current.certificateNumber;
          if (!number || !sequence || !year) {
            year = now.getUTCFullYear();
            const allocated = await transaction.internshipCertificateSequence.upsert({
              where: { year }, create: { year, lastValue: 1 },
              update: { lastValue: { increment: 1 } },
            });
            sequence = allocated.lastValue;
            number = certificateNumber(year, sequence);
          }
          const bytes = await generateInternshipCertificatePdf({
            certificateNumber: number,
            issueDate: now,
            candidateName: current.application.candidateName,
            program: current.payment.internshipProgram,
            designation: current.designation ?? current.payment.internshipProgram,
            durationDays: current.durationDays,
            joiningDate: current.joiningDate,
            completionDate: current.completionDate,
            skills: current.skills.map((skill: { name: string }) => skill.name),
            projectWork: current.projectWork,
            performanceSummary: current.performanceSummary,
            verificationReference: current.publicReference,
          });
          await transaction.internshipCertificate.update({
            where: { id },
            data: {
              certificateNumber: number, certificateSequence: sequence,
              certificateYear: year, issuedAt: now, generatedAt: now,
              pdfBytes: Buffer.from(bytes),
              pdfSha256: createHash("sha256").update(bytes).digest("hex"),
              status: "GENERATED",
            },
          });
          return transaction.internshipCertificate.findUniqueOrThrow({
            where: { id },
            include: { application: true, payment: true, skills: true },
          });
        }, { isolationLevel: "Serializable" });
      }
      const key = `internship-certificate/candidate/${certificate.id}`;
      const result = await this.email.send({
        to: certificate.application.email,
        idempotencyKey: key,
        subject: "Your Growblic Internship Certificate",
        html: `<p>Hello ${escapeHtml(certificate.application.candidateName)},</p>
<p>Congratulations on completing your ${certificate.durationDays}-day ${escapeHtml(certificate.payment.internshipProgram)} internship. Your Growblic Internship Certificate is attached.</p>
<p>Completion date: ${formatCalendarDate(certificate.completionDate)}</p>
<p>For support, contact hello@growblic.com.</p>`,
        attachment: {
          filename: `Growblic-Internship-Certificate-${certificate.certificateNumber}.pdf`,
          content: Buffer.from(certificate.pdfBytes).toString("base64"),
        },
      });
      await database.$transaction([
        database.internshipCertificateEmailAttempt.create({
          data: {
            certificateId: id, kind: "CANDIDATE_CERTIFICATE",
            idempotencyKey: key, recipient: certificate.application.email,
            successful: true, providerId: result.providerId,
          },
        }),
        database.internshipCertificate.updateMany({
          where: { id, emailClaimToken: token, emailedAt: null },
          data: {
            status: "EMAILED", emailStatus: "SENT", emailedAt: now,
            emailClaimToken: null, emailClaimedAt: null, nextEmailAttemptAt: null,
          },
        }),
      ]);
    } catch (error) {
      const safeError = safeDeliveryError(error);
      const retryAt = new Date(now.getTime() + 6 * HOUR_MS);
      try {
        await database.internshipCertificateEmailAttempt.create({
          data: {
            certificateId: id,
            kind: "CANDIDATE_CERTIFICATE",
            idempotencyKey: `internship-certificate/candidate/${id}/attempt/${certificate.emailAttemptCount + 1}`,
            recipient: certificate.application.email,
            successful: false,
            safeError,
          },
        });
      } catch {
        // Lifecycle state remains authoritative if audit insertion itself fails.
      }
      await database.internshipCertificate.updateMany({
        where: { id, emailClaimToken: token },
        data: {
          status: "EMAIL_FAILED", emailStatus: "FAILED",
          emailLastError: safeError, emailClaimToken: null,
          emailClaimedAt: null, nextEmailAttemptAt: retryAt,
        },
      });
    }
  }

  private async alertBlocked(certificate: DatabaseClient, now: Date) {
    if (certificate.blockedAlertSentAt) return;
    const recipient = process.env.INTERNSHIP_CERTIFICATE_ADMIN_EMAIL?.trim();
    if (!recipient) return;
    const database = await this.database();
    const key = `internship-certificate/blocked/${certificate.id}`;
    try {
      const result = await this.email.send({
        to: recipient, idempotencyKey: key,
        subject: `Internship certificate blocked — ${certificate.application.candidateName}`,
        html: `<p>The internship has completed, but required certificate skills/details are not ready.</p>`,
      });
      await database.$transaction([
        database.internshipCertificateEmailAttempt.create({
          data: {
            certificateId: certificate.id, kind: "ADMIN_BLOCKED",
            idempotencyKey: key, recipient, successful: true,
            providerId: result.providerId,
          },
        }),
        database.internshipCertificate.updateMany({
          where: { id: certificate.id, blockedAlertSentAt: null },
          data: { blockedAlertSentAt: now },
        }),
      ]);
    } catch {
      // The bounded daily lifecycle recheck will retry this alert safely.
    }
  }
}
