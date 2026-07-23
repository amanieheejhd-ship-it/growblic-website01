import {
  authMethodLabel,
  certificateUnavailableReason,
  compactPaymentReference,
  compactReference,
  hasInstituteEnrollment,
  summarizeApplicantDownloads,
  type ApplicantAccountView,
} from "@growblic/contracts";
import { adminDatabase } from "./admin-database";

const DAY_MS = 86_400_000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AccountRecord = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminTransaction = any;

export async function listInternshipApplicantAccounts(): Promise<ApplicantAccountView[]> {
  const accounts = await adminDatabase().internshipApplicantAccount.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      emailNormalized: true,
      emailDisplay: true,
      status: true,
      emailVerifiedAt: true,
      createdAt: true,
      lastLoginAt: true,
      failedLoginCount: true,
      applications: {
        orderBy: { createdAt: "desc" },
        select: {
          submissionKey: true,
          candidateName: true,
          email: true,
          phone: true,
          state: true,
          instituteEnrollment: true,
          instituteName: true,
          course: true,
          enrollmentNumber: true,
          status: true,
          createdAt: true,
          selectedPlanDuration: true,
          selectedPlanCurrency: true,
          payment: {
            select: {
              id: true,
              gateway: true,
              gatewayOrderId: true,
              gatewayPaymentId: true,
              paymentMethod: true,
              amountPaise: true,
              currency: true,
              status: true,
              paidAt: true,
              internshipStartedAt: true,
              expectedCompletionAt: true,
              completedAt: true,
              offerLetterGeneratedAt: true,
              confirmationReference: true,
              confirmationIssuedAt: true,
              selectedDuration: true,
            },
          },
          certificate: {
            select: {
              id: true,
              status: true,
              joiningDate: true,
              completionDate: true,
              generatedAt: true,
              issuedAt: true,
              pdfSha256: true,
              publicReference: true,
              certificateNumber: true,
              _count: { select: { skills: true } },
            },
          },
        },
      },
      sessions: {
        where: { revokedAt: null, expiresAt: { gt: new Date() } },
        select: { id: true },
      },
      oauthIdentities: {
        select: { provider: true },
      },
      documentAccesses: {
        where: { actorType: "APPLICANT", action: "DOWNLOAD" },
        orderBy: { createdAt: "asc" },
        select: {
          documentType: true,
          documentId: true,
          actorType: true,
          action: true,
          createdAt: true,
        },
      },
    },
  });
  const now = new Date();
  return accounts.map((account: AccountRecord): ApplicantAccountView => {
    const application = account.applications[0] ?? null;
    const payment = application?.payment ?? null;
    const certificate = application?.certificate ?? null;
    const startedAt = payment?.internshipStartedAt ?? payment?.paidAt ?? null;
    const completedAt = payment?.completedAt ?? payment?.expectedCompletionAt ?? certificate?.completionDate ?? null;
    const durationDays = payment?.selectedDuration ?? application?.selectedPlanDuration ?? null;
    const internshipCompleted = Boolean(
      payment?.status === "PAID" &&
      ((completedAt && completedAt <= now) || certificate?.status === "GENERATED" || certificate?.status === "EMAILED"),
    );
    const internshipStatus = payment?.status === "PAID"
      ? internshipCompleted ? "COMPLETED" : "ACTIVE"
      : "NOT_STARTED";
    const remainingDays = completedAt && payment?.status === "PAID"
      ? Math.max(0, Math.ceil((completedAt.getTime() - now.getTime()) / DAY_MS))
      : null;
    const progressPercentage = payment?.status === "PAID" && startedAt && completedAt && durationDays
      ? internshipCompleted
        ? 100
        : Math.min(99, Math.max(0, Math.round(((now.getTime() - startedAt.getTime()) / DAY_MS / durationDays) * 100)))
      : null;
    const applicantAccesses = account.documentAccesses.map((access: {
      documentType: string;
      documentId: string | null;
      actorType: string;
      action: string;
      createdAt: Date;
    }) => ({
      documentType: access.documentType,
      documentId: access.documentId,
      actorType: access.actorType,
      action: access.action,
      createdAt: access.createdAt.toISOString(),
    }));
    const letterDownloads = summarizeApplicantDownloads(applicantAccesses.filter(
      (access: { documentType: string; documentId: string | null }) =>
        access.documentType === "INTERNSHIP_LETTER" && access.documentId === payment?.id,
    ));
    const certificateDownloads = summarizeApplicantDownloads(applicantAccesses.filter(
      (access: { documentType: string; documentId: string | null }) =>
        access.documentType === "CERTIFICATE" && access.documentId === certificate?.id,
    ));
    const instituteEnrollment = hasInstituteEnrollment(application?.instituteEnrollment);
    const letterAvailable = Boolean(
      payment?.status === "PAID" &&
      (payment.offerLetterGeneratedAt ?? payment.confirmationIssuedAt) &&
      certificate?.id,
    );
    const certificateReady = Boolean(certificate && ["READY", "GENERATED", "EMAILED"].includes(certificate.status));
    const certificatePdfGenerated = Boolean(certificate?.pdfSha256 || certificate?.generatedAt);
    const certificateReason = certificateUnavailableReason({
      hasCertificate: Boolean(certificate),
      internshipCompleted,
      detailsComplete: Boolean(certificate?.joiningDate && certificate?.completionDate && certificate._count.skills > 0),
      markedReady: certificateReady,
      pdfGenerated: certificatePdfGenerated,
    });
    const certificateAvailable = !certificateReason;
    const reference = compactReference(application?.submissionKey, "GB");
    const name = application?.candidateName ?? account.emailDisplay;
    const email = application?.email ?? account.emailDisplay;
    const paymentStatus = payment?.status ?? "NOT_CREATED";
    const searchText = [
      name,
      email,
      account.emailNormalized,
      application?.submissionKey,
      reference,
    ].filter(Boolean).join(" ").toLowerCase();

    return {
      id: account.id,
      searchText,
      list: {
        name,
        email,
        accountStatus: account.status,
        paymentStatus,
        internshipStatus,
        appliedAt: application?.createdAt.toISOString() ?? account.createdAt.toISOString(),
        reference,
      },
      account: {
        name,
        email,
        phone: application?.phone ?? null,
        status: account.status,
        authMethod: authMethodLabel(
          account.oauthIdentities.map((identity: { provider: string }) => identity.provider),
          true,
        ),
        emailVerified: Boolean(account.emailVerifiedAt),
        createdAt: account.createdAt.toISOString(),
        lastLoginAt: account.lastLoginAt?.toISOString() ?? null,
        activeSessions: account.sessions.length,
        failedLoginAttempts: account.failedLoginCount ?? 0,
      },
      application: {
        status: application?.status ?? null,
        submittedAt: application?.createdAt.toISOString() ?? null,
        state: application?.state ?? null,
        instituteEnrollment,
        instituteName: instituteEnrollment ? application?.instituteName ?? null : null,
        course: instituteEnrollment ? application?.course ?? null : null,
        enrollmentNumber: instituteEnrollment ? application?.enrollmentNumber ?? null : null,
      },
      payment: {
        status: paymentStatus,
        amountPaid: payment?.status === "PAID" ? payment.amountPaise : null,
        currency: payment?.currency ?? application?.selectedPlanCurrency ?? "INR",
        paidAt: payment?.paidAt?.toISOString() ?? null,
        type: payment ? (payment.gateway === "DEMO" || payment.paymentMethod === "DEMO" ? "Demo" : "Real") : "Pending",
        reference: compactPaymentReference(payment?.gatewayPaymentId ?? payment?.gatewayOrderId),
      },
      internship: {
        durationDays,
        status: internshipStatus,
        startedAt: startedAt?.toISOString() ?? null,
        completedAt: completedAt?.toISOString() ?? null,
        remainingDays,
        progressPercentage,
      },
      letter: {
        status: letterAvailable ? "Generated" : "Unavailable",
        generatedAt: (payment?.offerLetterGeneratedAt ?? payment?.confirmationIssuedAt)?.toISOString() ?? null,
        reference: payment?.confirmationReference ?? null,
        applicantDownloads: letterDownloads,
        actions: {
          available: letterAvailable,
          reason: letterAvailable ? null : payment?.status === "PAID" ? "Offer letter is not generated yet." : "Payment is not paid.",
          viewHref: letterAvailable ? `/api/internship-certificates/${certificate?.id}/offer-letter` : null,
          downloadHref: letterAvailable ? `/api/internship-certificates/${certificate?.id}/offer-letter?download=1` : null,
        },
      },
      certificate: {
        status: certificate?.status ?? "NOT_STARTED",
        ready: certificateReady,
        generatedAt: certificate?.generatedAt?.toISOString() ?? certificate?.issuedAt?.toISOString() ?? null,
        reference: certificate?.certificateNumber ?? certificate?.publicReference ?? null,
        applicantAvailable: certificateAvailable,
        applicantDownloads: certificateDownloads,
        actions: {
          available: certificateAvailable,
          reason: certificateReason,
          viewHref: certificateAvailable ? `/api/internship-certificates/${certificate?.id}/preview` : null,
          downloadHref: certificateAvailable ? `/api/internship-certificates/${certificate?.id}/preview?download=1` : null,
        },
      },
    };
  });
}

export async function updateInternshipApplicantAccountStatus(
  accountId: string,
  status: "ACTIVE" | "DISABLED",
  adminUserId: string,
): Promise<{ id: string; status: string }> {
  return adminDatabase().$transaction(async (transaction: AdminTransaction) => {
    const account = await transaction.internshipApplicantAccount.update({
      where: { id: accountId },
      data: { status },
      select: { id: true, status: true },
    });
    if (status !== "ACTIVE") {
      await transaction.internshipApplicantSession.updateMany({
        where: { accountId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    await transaction.auditLog.create({
      data: {
        adminUserId,
        action: "ADMIN_INTERNSHIP_APPLICANT_STATUS_CHANGED",
        entityType: "InternshipApplicantAccount",
        entityId: accountId,
        metadata: { status },
      },
    });
    return account;
  });
}

export async function revokeInternshipApplicantSessions(
  accountId: string,
  adminUserId: string,
): Promise<{ count: number }> {
  return adminDatabase().$transaction(async (transaction: AdminTransaction) => {
    const result = await transaction.internshipApplicantSession.updateMany({
      where: { accountId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await transaction.auditLog.create({
      data: {
        adminUserId,
        action: "ADMIN_INTERNSHIP_APPLICANT_SESSIONS_REVOKED",
        entityType: "InternshipApplicantAccount",
        entityId: accountId,
        metadata: { count: result.count },
      },
    });
    return result;
  });
}
