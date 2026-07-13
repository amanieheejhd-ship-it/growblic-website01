import "dotenv/config";
import { Prisma, prisma } from "@growblic/database/client";

const calculator = {
  OR: [
    { source: "price-calculator" },
    {
      AND: [
        { source: null },
        { calculatorData: { not: Prisma.DbNull } },
        { calculatorData: { not: Prisma.JsonNull } },
      ],
    },
  ],
} as const;
async function printStatus(label: string, values: Array<{ status: string; _count: { _all: number } }>) { console.log(`${label}: ${values.map((value) => `${value.status}=${value._count._all}`).join(", ") || "none"}`); }
async function main() {
  const [contact, projects, calculatorLeads, meetups, careers, internships, statusAuditEvents] = await Promise.all([
    prisma.contactEnquiry.count(), prisma.quoteRequest.count({ where: { NOT: calculator } }), prisma.quoteRequest.count({ where: calculator }), prisma.meetingRequest.count(), prisma.careerApplication.count(), prisma.internshipApplication.count(),
    prisma.auditLog.count({ where: { action: "ADMIN_SUBMISSION_STATUS_CHANGED" } }),
  ]);
  console.log(`Contact messages: ${contact}`); console.log(`Project requests: ${projects}`); console.log(`Price calculator leads: ${calculatorLeads}`); console.log(`Meetup requests: ${meetups}`); console.log(`Career applications: ${careers}`); console.log(`Internship applications: ${internships}`);
  await printStatus("Contact statuses", await prisma.contactEnquiry.groupBy({ by: ["status"], _count: { _all: true } }));
  await printStatus("Project statuses", await prisma.quoteRequest.groupBy({ by: ["status"], where: { NOT: calculator }, _count: { _all: true } }));
  await printStatus("Calculator statuses", await prisma.quoteRequest.groupBy({ by: ["status"], where: calculator, _count: { _all: true } }));
  await printStatus("Meetup statuses", await prisma.meetingRequest.groupBy({ by: ["status"], _count: { _all: true } }));
  await printStatus("Career statuses", await prisma.careerApplication.groupBy({ by: ["status"], _count: { _all: true } }));
  await printStatus("Internship statuses", await prisma.internshipApplication.groupBy({ by: ["status"], _count: { _all: true } }));
  console.log(`Submission status audit events: ${statusAuditEvents}`);
  if (statusAuditEvents < 1) throw new Error("Expected at least one submission status audit event.");
  console.log("Admin submissions database verification passed.");
}
main().catch(() => { console.error("Admin submissions database verification failed."); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
