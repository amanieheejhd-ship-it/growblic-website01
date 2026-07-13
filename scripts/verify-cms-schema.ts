import "dotenv/config";

import { prisma } from "../apps/web/src/lib/prisma";

async function main() {
  const counts = await Promise.all([
    prisma.adminUser.count(),
    prisma.adminRole.count(),
    prisma.adminUserRole.count(),
    prisma.service.count(),
    prisma.product.count(),
    prisma.portfolioProject.count(),
    prisma.testimonial.count(),
    prisma.jobOpening.count(),
    prisma.jobApplication.count(),
    prisma.siteSetting.count(),
    prisma.mediaAsset.count(),
    prisma.auditLog.count(),
  ]);

  const tableCounts = [
    ["AdminUser", counts[0]],
    ["AdminRole", counts[1]],
    ["AdminUserRole", counts[2]],
    ["Service", counts[3]],
    ["Product", counts[4]],
    ["PortfolioProject", counts[5]],
    ["Testimonial", counts[6]],
    ["JobOpening", counts[7]],
    ["JobApplication", counts[8]],
    ["SiteSetting", counts[9]],
    ["MediaAsset", counts[10]],
    ["AuditLog", counts[11]],
  ] as const;

  console.log("CMS schema verification counts:");

  for (const [model, count] of tableCounts) {
    console.log(`${model}: ${count}`);
  }
}

main()
  .catch(() => {
    console.error("CMS schema verification failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
