import {
  isInternshipCertificateDomainRole,
  type InternshipCertificateDraft,
  type InternshipCertificateListItem,
} from "@growblic/contracts";
import { adminDatabase } from "./admin-database";
import {
  scheduleCertificateReminderTest,
  type ReminderTestDatabase,
} from "./internship-certificate-reminder-test";

const DAY_MS = 86_400_000;

type InternshipCertificateListRow = InternshipCertificateListItem & {
  paymentAmountPaise: number;
  paymentGateway: string;
};

export type CertificateListQuery = {
  page: number; pageSize: number; search: string; status: string | null; filter: string | null;
};

type WhereInput = Record<string, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CertificateRecord = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminTransaction = any;

function whereFor(query: CertificateListQuery, now: Date): WhereInput {
  const filter: WhereInput =
    query.filter === "ending-soon" ? { completionDate: { gte: now, lte: new Date(now.getTime() + 7 * DAY_MS) } }
      : query.filter === "skills-pending" ? { skills: { none: {} } }
        : query.filter === "ready" ? { status: "READY" }
          : query.filter === "emailed" ? { emailedAt: { not: null } }
            : query.filter === "email-failed" ? { emailStatus: "FAILED" } : {};
  return {
    ...(query.search ? { OR: [
      { application: { candidateName: { contains: query.search, mode: "insensitive" } } },
      { application: { email: { contains: query.search, mode: "insensitive" } } },
      { publicReference: { contains: query.search, mode: "insensitive" } },
      { application: { submissionKey: { contains: query.search, mode: "insensitive" } } },
    ] } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...filter,
  };
}

export async function listInternshipCertificates(query: CertificateListQuery, now = new Date()) {
  const prisma = adminDatabase();
  const where = whereFor(query, now);
  const [rows, total] = await Promise.all([
    prisma.internshipCertificate.findMany({
      where, orderBy: [{ completionDate: "asc" }, { createdAt: "desc" }],
      skip: (query.page - 1) * query.pageSize, take: query.pageSize,
      include: { application: true, payment: true, _count: { select: { skills: true } } },
    }),
    prisma.internshipCertificate.count({ where }),
  ]);
  const items: InternshipCertificateListRow[] = rows.map((row: CertificateRecord) => ({
    id: row.id, candidateName: row.application.candidateName,
    email: row.application.email, phone: row.application.phone,
    applicationReference: row.publicReference,
    program: row.payment.internshipProgram, durationDays: row.durationDays,
    joiningDate: row.joiningDate?.toISOString() ?? null,
    completionDate: row.completionDate?.toISOString() ?? null,
    paymentStatus: row.payment.status,
    paymentAmountPaise: row.payment.amountPaise,
    paymentGateway: row.payment.gateway,
    status: row.status,
    daysRemaining: row.completionDate
      ? Math.max(0, Math.ceil((row.completionDate.getTime() - now.getTime()) / DAY_MS)) : null,
    reminderStatus: row.reminderStatus, skillsCompleted: row._count.skills > 0,
    emailStatus: row.emailStatus, emailedAt: row.emailedAt?.toISOString() ?? null,
  }));
  return { items, pagination: {
    page: query.page, pageSize: query.pageSize, total: total as number,
    totalPages: Math.max(1, Math.ceil((total as number) / query.pageSize)),
  } };
}

function isoOrNull(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

// The detail payload is JSON-serialized for the admin app; dates become ISO
// strings and the raw PDF bytes are intentionally excluded from the response.
export type AdminCertificateDetail = {
  certificate: {
    id: string;
    status: string;
    domainRole: string | null;
    designation: string | null;
    projectWork: string | null;
    performanceSummary: string | null;
    conductNote: string | null;
    remarks: string | null;
    durationDays: number;
    joiningDate: string | null;
    completionDate: string | null;
    generatedAt: string | null;
    issuedAt: string | null;
    emailedAt: string | null;
    emailStatus: string;
    reminderStatus: string;
    publicReference: string | null;
    certificateNumber: string | null;
    skills: Array<{ id: string; name: string; position: number }>;
    emailAttempts: Array<{
      id: string;
      kind: string;
      successful: boolean;
      attemptedAt: string;
    }>;
    application: {
      candidateName: string;
      email: string;
      phone: string;
      submissionKey: string;
      applicantAccount: {
        emailDisplay: string;
        status: string;
        lastLoginAt: string | null;
        createdAt: string;
      } | null;
    };
    payment: {
      status: string;
      internshipProgram: string;
      internshipStartedAt: string | null;
      joiningDate: string | null;
      expectedCompletionAt: string | null;
      offerLetterGeneratedAt: string | null;
      confirmationIssuedAt: string | null;
      certificateAvailableAt: string | null;
    };
  };
  audits: Array<{ id: string; action: string; createdAt: string }>;
};

export async function getInternshipCertificate(id: string): Promise<AdminCertificateDetail | null> {
  const prisma = adminDatabase();
  const certificate: CertificateRecord | null = await prisma.internshipCertificate.findUnique({
    where: { id },
    include: {
      application: { include: { applicantAccount: true } },
      payment: true,
      skills: { orderBy: { position: "asc" } },
      emailAttempts: { orderBy: { attemptedAt: "desc" }, take: 50 },
    },
  });
  if (!certificate) return null;
  const audits: CertificateRecord[] = await prisma.auditLog.findMany({
    where: { entityType: "internship-certificate", entityId: id },
    orderBy: { createdAt: "desc" }, take: 50,
  });
  return {
    certificate: {
      id: certificate.id,
      status: certificate.status,
      domainRole: certificate.domainRole,
      designation: certificate.designation,
      projectWork: certificate.projectWork,
      performanceSummary: certificate.performanceSummary,
      conductNote: certificate.conductNote,
      remarks: certificate.remarks,
      durationDays: certificate.durationDays,
      joiningDate: isoOrNull(certificate.joiningDate),
      completionDate: isoOrNull(certificate.completionDate),
      generatedAt: isoOrNull(certificate.generatedAt),
      issuedAt: isoOrNull(certificate.issuedAt),
      emailedAt: isoOrNull(certificate.emailedAt),
      emailStatus: certificate.emailStatus,
      reminderStatus: certificate.reminderStatus,
      publicReference: certificate.publicReference,
      certificateNumber: certificate.certificateNumber,
      skills: certificate.skills.map((skill: { id: string; name: string; position: number }) => ({
        id: skill.id, name: skill.name, position: skill.position,
      })),
      emailAttempts: certificate.emailAttempts.map((attempt: {
        id: string; kind: string; successful: boolean; attemptedAt: Date;
      }) => ({
        id: attempt.id,
        kind: attempt.kind,
        successful: attempt.successful,
        attemptedAt: attempt.attemptedAt.toISOString(),
      })),
      application: {
        candidateName: certificate.application.candidateName,
        email: certificate.application.email,
        phone: certificate.application.phone,
        submissionKey: certificate.application.submissionKey,
        applicantAccount: certificate.application.applicantAccount
          ? {
              emailDisplay: certificate.application.applicantAccount.emailDisplay,
              status: certificate.application.applicantAccount.status,
              lastLoginAt: isoOrNull(certificate.application.applicantAccount.lastLoginAt),
              createdAt: certificate.application.applicantAccount.createdAt.toISOString(),
            }
          : null,
      },
      payment: {
        status: certificate.payment.status,
        internshipProgram: certificate.payment.internshipProgram,
        internshipStartedAt: isoOrNull(certificate.payment.internshipStartedAt),
        joiningDate: isoOrNull(certificate.payment.joiningDate),
        expectedCompletionAt: isoOrNull(certificate.payment.expectedCompletionAt),
        offerLetterGeneratedAt: isoOrNull(certificate.payment.offerLetterGeneratedAt),
        confirmationIssuedAt: isoOrNull(certificate.payment.confirmationIssuedAt),
        certificateAvailableAt: isoOrNull(certificate.payment.certificateAvailableAt),
      },
    },
    audits: audits.map((audit) => ({
      id: audit.id,
      action: audit.action,
      createdAt: audit.createdAt.toISOString(),
    })),
  };
}

export async function saveInternshipCertificateDraft(
  id: string, draft: InternshipCertificateDraft, adminUserId: string,
): Promise<{ status: string } | null> {
  return adminDatabase().$transaction(async (transaction: AdminTransaction) => {
    const current = await transaction.internshipCertificate.findUnique({ where: { id } });
    if (!current) return null;
    if (current.generatedAt || current.emailedAt) throw new Error("IMMUTABLE_CERTIFICATE");
    await transaction.internshipCertificateSkill.deleteMany({ where: { certificateId: id } });
    if (draft.skills.length) await transaction.internshipCertificateSkill.createMany({
      data: draft.skills.map((name, position) => ({ certificateId: id, name, position })),
    });
    const updated = await transaction.internshipCertificate.update({
      where: { id },
      data: {
        domainRole: draft.domainRole,
        designation: draft.designation, projectWork: draft.projectWork,
        performanceSummary: draft.performanceSummary, conductNote: draft.conductNote,
        remarks: draft.remarks,
        status: current.joiningDate ? "PENDING_SKILLS" : "PENDING_START_DATE",
      },
    });
    await transaction.auditLog.create({ data: {
      adminUserId, action: "INTERNSHIP_CERTIFICATE_DRAFT_SAVED",
      entityType: "internship-certificate", entityId: id,
      metadata: { skillCount: draft.skills.length },
    } });
    return updated;
  });
}

export async function markInternshipCertificateReady(
  id: string, adminUserId: string,
): Promise<{ status: string } | null> {
  return adminDatabase().$transaction(async (transaction: AdminTransaction) => {
    const current = await transaction.internshipCertificate.findUnique({
      where: { id }, include: { _count: { select: { skills: true } }, payment: true },
    });
    if (!current) return null;
    if (!current.joiningDate || !current.completionDate || current.payment.status !== "PAID") {
      throw new Error("CERTIFICATE_NOT_ELIGIBLE");
    }
    if (!isInternshipCertificateDomainRole(current.domainRole)) {
      throw new Error("CERTIFICATE_DOMAIN_REQUIRED");
    }
    if (current._count.skills === 0) throw new Error("CERTIFICATE_SKILLS_REQUIRED");
    if (current.generatedAt || current.emailedAt) throw new Error("IMMUTABLE_CERTIFICATE");
    const updated = await transaction.internshipCertificate.update({
      where: { id }, data: { status: "READY", emailStatus: "PENDING", nextEmailAttemptAt: null },
    });
    await transaction.auditLog.create({ data: {
      adminUserId, action: "INTERNSHIP_CERTIFICATE_MARKED_READY",
      entityType: "internship-certificate", entityId: id,
    } });
    return updated;
  });
}

export async function retryInternshipCertificateEmail(
  id: string, adminUserId: string,
): Promise<{ status: string } | null> {
  return adminDatabase().$transaction(async (transaction: AdminTransaction) => {
    const recentRetries = await transaction.auditLog.count({
      where: {
        adminUserId,
        action: "INTERNSHIP_CERTIFICATE_EMAIL_RETRY_REQUESTED",
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      },
    });
    if (recentRetries >= 3) throw new Error("CERTIFICATE_RETRY_RATE_LIMITED");
    const current = await transaction.internshipCertificate.findUnique({ where: { id } });
    if (!current) return null;
    if (current.emailedAt || current.emailStatus !== "FAILED") {
      throw new Error("CERTIFICATE_RETRY_NOT_ALLOWED");
    }
    const updated = await transaction.internshipCertificate.update({
      where: { id }, data: {
        status: current.pdfBytes ? "GENERATED" : "READY", emailStatus: "PENDING",
        emailLastError: null, nextEmailAttemptAt: new Date(),
      },
    });
    await transaction.auditLog.create({ data: {
      adminUserId, action: "INTERNSHIP_CERTIFICATE_EMAIL_RETRY_REQUESTED",
      entityType: "internship-certificate", entityId: id,
    } });
    return updated;
  });
}

export async function scheduleInternshipCertificateReminderTest(
  id: string,
  adminUserId: string,
  now = new Date(),
) {
  const database: ReminderTestDatabase = {
    $transaction: (callback) =>
      adminDatabase().$transaction((transaction: AdminTransaction) => callback(transaction)),
  };
  return scheduleCertificateReminderTest(database, id, adminUserId, now, process.env);
}
