import "dotenv/config";

import { prisma } from "@growblic/database/client";

const allowedFlags = new Set(["--dry-run", "--execute"]);
const protectedNameFragments = [
  "gautam",
  "kavita singh yadav",
  "growblic",
  "rahul",
];
const demoEmailPattern = /^demo-[a-z0-9][a-z0-9._+-]*@example\.com$/i;

function executionMode() {
  const flags = process.argv.slice(2);
  if (
    flags.length !== 1 ||
    !allowedFlags.has(flags[0] ?? "")
  ) {
    throw new Error("Pass exactly one flag: --dry-run or --execute.");
  }
  return flags[0] as "--dry-run" | "--execute";
}

function normalized(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function matchReasons(application: {
  candidateName: string;
  email: string;
  submissionKey: string;
  instituteName: string | null;
  enrollmentNumber: string | null;
}) {
  const candidateName = normalized(application.candidateName);
  if (protectedNameFragments.some((name) => candidateName.includes(name))) {
    return [];
  }

  const email = normalized(application.email);
  const submissionKey = normalized(application.submissionKey);
  const instituteName = normalized(application.instituteName);
  const enrollmentNumber = normalized(application.enrollmentNumber);
  const reasons: string[] = [];

  if (candidateName.includes("demo e2e")) reasons.push("candidate:Demo E2E");
  if (candidateName.includes("synthetic intern")) reasons.push("candidate:Synthetic Intern");
  if (candidateName.includes("admin-submissions-test")) reasons.push("candidate:admin-submissions-test");
  if (email.includes("admin-submissions-test")) reasons.push("email:admin-submissions-test");
  if (demoEmailPattern.test(email)) reasons.push("email:demo-*@example.com");
  if (submissionKey.includes("demo-e2e")) reasons.push("reference:DEMO-E2E");
  if (submissionKey.includes("synthetic-intern")) reasons.push("reference:Synthetic Intern");
  if (submissionKey.includes("admin-submissions-test")) reasons.push("reference:admin-submissions-test");
  if (instituteName.includes("demo test institute")) reasons.push("college:Demo Test Institute");
  if (instituteName.includes("admin-submissions-test")) reasons.push("college:admin-submissions-test");
  if (enrollmentNumber.includes("demo-e2e")) reasons.push("enrollment:DEMO-E2E");
  if (enrollmentNumber.includes("admin-submissions-test")) reasons.push("enrollment:admin-submissions-test");

  return reasons;
}

async function matchingApplications() {
  const applications = await prisma.internshipApplication.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      submissionKey: true,
      candidateName: true,
      email: true,
      phone: true,
      instituteName: true,
      enrollmentNumber: true,
      createdAt: true,
      payment: {
        select: {
          id: true,
          invoice: { select: { id: true } },
        },
      },
      certificate: { select: { id: true } },
    },
  });

  return applications.flatMap((application) => {
    const reasons = matchReasons(application);
    return reasons.length ? [{ ...application, reasons }] : [];
  });
}

function printMatches(matches: Awaited<ReturnType<typeof matchingApplications>>) {
  console.log(`Matched demo/test internship applications: ${matches.length}`);
  console.log(JSON.stringify(matches.map((application) => ({
    id: application.id,
    candidateName: application.candidateName,
    email: application.email,
    phone: application.phone,
    college: application.instituteName,
    createdAt: application.createdAt.toISOString(),
    reasons: application.reasons,
    relatedPaymentId: application.payment?.id ?? null,
    relatedInvoiceId: application.payment?.invoice?.id ?? null,
    relatedCertificateId: application.certificate?.id ?? null,
  })), null, 2));
}

async function main() {
  const mode = executionMode();
  const matches = await matchingApplications();
  printMatches(matches);

  if (mode === "--dry-run") {
    console.log("Dry run complete: no records were deleted.");
    return;
  }
  if (matches.length === 0) {
    console.log("Cleanup complete: 0 internship applications deleted.");
    return;
  }

  const applicationIds = matches.map((application) => application.id);
  const paymentIds = matches.flatMap((application) =>
    application.payment ? [application.payment.id] : [],
  );
  const result = await prisma.$transaction(async (transaction) => {
    const certificates = await transaction.internshipCertificate.deleteMany({
      where: { applicationId: { in: applicationIds } },
    });
    const invoices = await transaction.invoice.deleteMany({
      where: { paymentId: { in: paymentIds } },
    });
    const payments = await transaction.internshipPayment.deleteMany({
      where: { internshipApplicationId: { in: applicationIds } },
    });
    const applications = await transaction.internshipApplication.deleteMany({
      where: { id: { in: applicationIds } },
    });
    return { certificates, invoices, payments, applications };
  });

  console.log(JSON.stringify({
    deletedInternshipApplications: result.applications.count,
    deletedPayments: result.payments.count,
    deletedInvoices: result.invoices.count,
    deletedCertificates: result.certificates.count,
  }, null, 2));
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Demo internship cleanup failed.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
