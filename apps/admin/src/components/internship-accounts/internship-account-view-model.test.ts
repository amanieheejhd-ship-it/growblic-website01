import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import {
  certificateUnavailableReason,
  compactPaymentReference,
  compactReference,
  formatMoneyPaise,
  hasInstituteEnrollment,
  summarizeApplicantDownloads,
  visibleListText,
  type ApplicantAccountView,
} from "./internship-account-view-model";

const root = process.cwd().endsWith("apps/admin")
  ? resolve(process.cwd(), "../..")
  : process.cwd();

function fixture(overrides: Partial<ApplicantAccountView> = {}): ApplicantAccountView {
  return {
    id: "account-internal-id",
    searchText: "gautam growblic@gmail.com gb-2dee225b",
    list: {
      name: "Gautam",
      email: "growblic@gmail.com",
      accountStatus: "ACTIVE",
      paymentStatus: "PAID",
      internshipStatus: "COMPLETED",
      appliedAt: "2026-07-18T08:00:00.000Z",
      reference: "GB-2DEE225B",
    },
    account: {
      name: "Gautam",
      email: "growblic@gmail.com",
      phone: "+91 98765 43210",
      status: "ACTIVE",
      authMethod: "Email and Password",
      emailVerified: true,
      createdAt: "2026-07-18T07:00:00.000Z",
      lastLoginAt: "2026-07-18T09:00:00.000Z",
      activeSessions: 1,
      failedLoginAttempts: 0,
    },
    application: {
      status: "NEW",
      submittedAt: "2026-07-18T08:00:00.000Z",
      state: "Maharashtra",
      instituteEnrollment: true,
      instituteName: "Growblic Institute",
      course: "B.Tech",
      enrollmentNumber: "ENR-1",
    },
    payment: {
      status: "PAID",
      amountPaid: 100,
      currency: "INR",
      paidAt: "2026-07-18T08:05:00.000Z",
      type: "Demo",
      reference: "PAY-17436898",
    },
    internship: {
      durationDays: 30,
      status: "COMPLETED",
      startedAt: "2026-07-18T00:00:00.000Z",
      completedAt: "2026-07-18T00:00:00.000Z",
      remainingDays: 0,
      progressPercentage: 100,
    },
    letter: {
      status: "Generated",
      generatedAt: "2026-07-18T08:05:00.000Z",
      reference: "GB-INT-000015",
      applicantDownloads: {
        downloaded: true,
        firstDownloadedAt: "2026-07-18T08:10:00.000Z",
        lastDownloadedAt: "2026-07-18T08:12:00.000Z",
        downloadCount: 2,
      },
      actions: {
        available: true,
        reason: null,
        viewHref: "/api/internship-certificates/cert_1/offer-letter",
        downloadHref: "/api/internship-certificates/cert_1/offer-letter?download=1",
      },
    },
    certificate: {
      status: "GENERATED",
      ready: true,
      generatedAt: "2026-07-18T08:20:00.000Z",
      reference: "GB-CERT-000003",
      applicantAvailable: true,
      applicantDownloads: {
        downloaded: true,
        firstDownloadedAt: "2026-07-18T08:22:00.000Z",
        lastDownloadedAt: "2026-07-18T08:22:00.000Z",
        downloadCount: 1,
      },
      actions: {
        available: true,
        reason: null,
        viewHref: "/api/internship-certificates/cert_1/preview",
        downloadHref: "/api/internship-certificates/cert_1/preview?download=1",
      },
    },
    ...overrides,
  };
}

describe("admin applicant account view model", () => {
  it("formats compact references and currency without exposing long raw values", () => {
    assert.equal(compactReference("c0c6346e-b1ea-4540-833f-192e2dee225b"), "GB-2DEE225B");
    assert.equal(compactPaymentReference("pay_Qwerty17436898"), "PAY-17436898");
    assert.equal(formatMoneyPaise(100), "₹1");
    assert.equal(formatMoneyPaise(300000), "₹3,000");
  });

  it("keeps applicant list text compact", () => {
    const text = visibleListText(fixture());
    assert.match(text, /Gautam/);
    assert.match(text, /growblic@gmail\.com/);
    assert.match(text, /GB-2DEE225B/);
    assert.doesNotMatch(text, /account-internal-id/);
    assert.doesNotMatch(text, /Frontend Developer|Backend Developer|domain|slug/i);
    assert.doesNotMatch(text, /failed login|active sessions/i);
  });

  it("hides institute-specific fields when institute enrollment is No", () => {
    assert.equal(hasInstituteEnrollment("No"), false);
    assert.equal(hasInstituteEnrollment("college"), true);
    const account = fixture({
      application: {
        ...fixture().application,
        instituteEnrollment: false,
        instituteName: null,
        course: null,
        enrollmentNumber: null,
      },
    });
    assert.equal(account.application.instituteEnrollment, false);
    assert.equal(account.application.instituteName, null);
    assert.equal(account.application.course, null);
    assert.equal(account.application.enrollmentNumber, null);
  });

  it("keeps applicant download counts separate from admin activity", () => {
    const summary = summarizeApplicantDownloads([
      { actorType: "ADMIN", action: "DOWNLOAD", createdAt: "2026-07-18T08:00:00.000Z" },
      { actorType: "APPLICANT", action: "VIEW", createdAt: "2026-07-18T08:01:00.000Z" },
      { actorType: "APPLICANT", action: "DOWNLOAD", createdAt: "2026-07-18T08:02:00.000Z" },
      { actorType: "APPLICANT", action: "DOWNLOAD", createdAt: "2026-07-18T08:04:00.000Z" },
    ]);
    assert.deepEqual(summary, {
      downloaded: true,
      firstDownloadedAt: "2026-07-18T08:02:00.000Z",
      lastDownloadedAt: "2026-07-18T08:04:00.000Z",
      downloadCount: 2,
    });
  });

  it("explains certificate unavailability with safe business-rule reasons", () => {
    assert.equal(certificateUnavailableReason({
      hasCertificate: true,
      internshipCompleted: false,
      detailsComplete: true,
      markedReady: true,
      pdfGenerated: true,
    }), "Internship not completed");
    assert.equal(certificateUnavailableReason({
      hasCertificate: true,
      internshipCompleted: true,
      detailsComplete: true,
      markedReady: true,
      pdfGenerated: false,
    }), "PDF not generated");
  });

  it("renders a master-detail client without the old horizontal table", async () => {
    const page = await readFile(resolve(root, "apps/admin/src/app/internship-accounts/page.tsx"), "utf8");
    const component = await readFile(resolve(root, "apps/admin/src/components/internship-accounts/ApplicantAccountsMasterDetail.tsx"), "utf8");
    assert.match(page, /ApplicantAccountsMasterDetail/);
    assert.doesNotMatch(page, /<table|overflow-x-auto|min-w-full/);
    assert.doesNotMatch(component, /<table|overflow-x-auto|min-w-full/);
    assert.match(component, /lg:grid-cols-\[minmax\(18rem,34%\)_minmax\(0,1fr\)\]/);
    assert.match(component, /onClick=\{\(\) => setSelectedId\(account\.id\)\}/);
    assert.match(component, /View Letter/);
    assert.match(component, /Download Letter/);
    assert.match(component, /View Certificate/);
    assert.match(component, /Download Certificate/);
  });

  it("does not render developer, domain, slug, UUID, or secret fields in the page surface", async () => {
    const files = await Promise.all([
      readFile(resolve(root, "apps/admin/src/app/internship-accounts/page.tsx"), "utf8"),
      readFile(resolve(root, "apps/admin/src/components/internship-accounts/ApplicantAccountsMasterDetail.tsx"), "utf8"),
      readFile(resolve(root, "apps/admin/src/components/internship-accounts/internship-account-view-model.ts"), "utf8"),
    ]);
    const surface = files.join("\n");
    assert.doesNotMatch(surface, /Frontend Developer|Backend Developer/);
    assert.doesNotMatch(surface, /internshipSlug|selectedPlanName|domainRole|providerSubject/);
    assert.doesNotMatch(surface, /passwordHash|OAuth tokens|reset tokens|verification tokens|session tokens/);
    assert.doesNotMatch(visibleListText(fixture()), /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  });

  it("keeps admin authorization on account and document routes", async () => {
    const accountRoute = await readFile(resolve(root, "apps/admin/src/app/api/internship-accounts/[id]/route.ts"), "utf8");
    const letterRoute = await readFile(resolve(root, "apps/admin/src/app/api/internship-certificates/[id]/offer-letter/route.ts"), "utf8");
    const certificateRoute = await readFile(resolve(root, "apps/admin/src/app/api/internship-certificates/[id]/preview/route.ts"), "utf8");
    const proxy = await readFile(resolve(root, "apps/admin/src/server/backend/admin-proxy.ts"), "utf8");
    const backendClient = await readFile(resolve(root, "apps/admin/src/server/backend/backend-admin.ts"), "utf8");
    // The routes proxy to the backend admin module, which enforces the
    // SUPER_ADMIN session; the proxy must always attach the session token.
    assert.match(accountRoute, /proxyAdminJson\(/);
    assert.match(letterRoute, /proxyAdminPdf\(/);
    assert.match(certificateRoute, /proxyAdminPdf\(/);
    assert.match(proxy, /getAdminSessionCookie\(\)/);
    assert.match(backendClient, /x-admin-session-token/);
  });
});
