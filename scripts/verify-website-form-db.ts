import "dotenv/config";

import { prisma } from "../src/lib/prisma";

async function main() {
  const [careerApplications, internshipApplications, meetingRequests, quoteRequests] =
    await Promise.all([
      prisma.careerApplication.count(),
      prisma.internshipApplication.count(),
      prisma.meetingRequest.count(),
      prisma.quoteRequest.count(),
    ]);

  console.log(`Career applications: ${careerApplications}`);
  console.log(`Internship applications: ${internshipApplications}`);
  console.log(`Meeting requests: ${meetingRequests}`);
  console.log(`Quote requests: ${quoteRequests}`);
  console.log("Website form database verification passed.");
}

main()
  .catch(() => {
    console.error("Website form database verification failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
