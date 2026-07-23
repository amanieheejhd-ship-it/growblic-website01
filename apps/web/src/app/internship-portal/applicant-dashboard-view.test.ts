import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  applicantDashboardLayout,
  buildApplicantDashboardView,
  formatAmount,
  formatReference,
  friendlyStatus,
  isInternshipDemoPaymentEnabled,
} from "./applicant-dashboard-view";

const fullUuid = "2080f992-b448-4d0a-90f1-2607292ce069";
const clientSource = readFileSync(
  new URL("./InternshipPortalClient.tsx", import.meta.url),
  "utf8",
);

function dashboard(overrides: Record<string, unknown> = {}) {
  return {
    account: { email: "applicant@example.test" },
    application: {
      reference: fullUuid,
      status: "NEW",
      submittedAt: "2026-07-18T08:24:35.000Z",
    },
    applicant: {
      name: "Aarav Applicant",
      email: "applicant@example.test",
      phone: "+91 98765 43210",
      originalApplicationDetails: {
        reference: fullUuid,
        internshipSlug: "frontend-developer",
        developerRole: "Backend Developer",
        state: "Maharashtra",
        instituteEnrollment: "No",
        instituteName: "Hidden Institute",
        course: "Hidden Course",
        enrollmentNumber: "Hidden Enrollment",
        selectedPlan: "Frontend Developer",
        selectedPlanDuration: 30,
        selectedPlanAmountPaise: 300000,
        selectedPlanCurrency: "INR",
        message: "",
        submittedAt: "2026-07-18T08:24:35.000Z",
      },
    },
    internship: {
      selectedPlan: "Frontend Developer",
      durationDays: 30,
      status: "NOT_STARTED",
      startedAt: null,
      expectedCompletionAt: null,
      totalDays: null,
      elapsedDays: null,
      remainingDays: null,
      progressPercentage: null,
    },
    payment: {
      status: "NOT_CREATED",
      method: null,
      amountPaise: 300000,
      currency: "INR",
    },
    ...overrides,
  };
}

describe("applicant dashboard presentation mapping", () => {
  it("shows only institute enrollment when the submitted value is No", () => {
    const view = buildApplicantDashboardView(dashboard());
    assert.deepEqual(view.instituteRows, [
      { label: "Institute enrollment", value: "No" },
    ]);
    assert.equal(JSON.stringify(view).includes("Hidden Institute"), false);
    assert.equal(JSON.stringify(view).includes("Hidden Course"), false);
    assert.equal(JSON.stringify(view).includes("Hidden Enrollment"), false);
  });

  it("shows populated institute fields when the submitted value is Yes and hides empty fields", () => {
    const view = buildApplicantDashboardView(dashboard({
      applicant: {
        name: "Aarav Applicant",
        email: "applicant@example.test",
        phone: "+91 98765 43210",
        originalApplicationDetails: {
          state: "Maharashtra",
          instituteEnrollment: "YES",
          instituteName: "Growblic Institute",
          course: "",
          enrollmentNumber: "ENR-2026",
        },
      },
    }));
    assert.deepEqual(view.instituteRows, [
      { label: "Institute enrollment", value: "Yes" },
      { label: "Institute name", value: "Growblic Institute" },
      { label: "Enrollment number", value: "ENR-2026" },
    ]);
  });

  it("does not expose raw internal fields or raw UUIDs", () => {
    const text = JSON.stringify(buildApplicantDashboardView(dashboard()));
    assert.equal(text.includes("frontend-developer"), false);
    assert.equal(text.includes("Frontend Developer"), false);
    assert.equal(text.includes("Backend Developer"), false);
    assert.equal(text.includes("Selected plan"), false);
    assert.equal(text.includes("Selected Plan"), false);
    assert.equal(text.includes("300000"), false);
    assert.equal(text.includes("INR"), false);
    assert.equal(text.includes("2026-07-18T08:24:35.000Z"), false);
    assert.equal(text.includes(fullUuid), false);
  });

  it("keeps duration and formatted amount while hiding plan/domain names", () => {
    const view = buildApplicantDashboardView(dashboard());
    assert.deepEqual(view.internshipRows, [
      { label: "Duration", value: "30 days" },
      { label: "Amount", value: "₹3,000" },
      { label: "Payment status", value: "Not started" },
      { label: "Internship status", value: "Not started" },
    ]);
  });

  it("formats amount and reference for applicant display", () => {
    assert.equal(formatAmount(300000), "₹3,000");
    assert.equal(formatReference(fullUuid), "GB-2080F992");
  });

  it("displays raw enums as friendly labels", () => {
    assert.equal(friendlyStatus("NOT_CREATED"), "Not started");
    assert.equal(friendlyStatus("NOT_STARTED"), "Not started");
    assert.equal(friendlyStatus("NEW"), "New");
    assert.equal(friendlyStatus("PAID"), "Paid");
    assert.equal(friendlyStatus("ACTIVE"), "Active");
    assert.equal(friendlyStatus("COMPLETED"), "Completed");
  });

  it("keeps payment below the dashboard with desktop details-left QR-right layout", () => {
    assert.equal(applicantDashboardLayout.paymentPlacement, "below-dashboard");
    assert.equal(applicantDashboardLayout.paymentSideBySide, false);
    assert.equal(applicantDashboardLayout.paymentDensity, "compact");
    assert.equal(applicantDashboardLayout.paymentCardLayout, "desktop-details-left-qr-right");
    assert.deepEqual(applicantDashboardLayout.paymentSummary, [
      "Duration",
      "Amount",
      "Payment status",
    ]);
    assert.equal(applicantDashboardLayout.demoButtonPlacement, "below-qr");
    assert.equal(applicantDashboardLayout.demoTestModeLabel, "Test mode — no real payment will be charged");
    assert.equal(applicantDashboardLayout.qrPlacement, "right-column-level-with-summary");
    assert.equal(applicantDashboardLayout.qrCardWidth, "280-320px");
    assert.equal(applicantDashboardLayout.qrImageSize, "190-220px");
    assert.equal(applicantDashboardLayout.paymentSuccessPlacement, "below-payment");
    assert.equal(applicantDashboardLayout.progressPlacement, "below-letter-controls");
  });

  it("renders payment details left and QR/buttons right on desktop while stacking on mobile", () => {
    assert.match(clientSource, /data-payment-card-layout=\{applicantDashboardLayout\.paymentCardLayout\}/);
    assert.match(clientSource, /md:grid-cols-\[minmax\(0,1fr\)_minmax\(260px,304px\)\]/);
    assert.match(clientSource, /data-payment-details-placement="left"/);
    assert.match(clientSource, /PaymentDetail label="Duration"/);
    assert.match(clientSource, /data-qr-placement=\{applicantDashboardLayout\.qrPlacement\}/);
    assert.match(clientSource, /QRCodeSVG[\s\S]*Demo ₹1 Payment/);
    assert.match(clientSource, /Open secure checkout/);
  });

  it("renders demo controls only when frontend and backend demo flags are both enabled", () => {
    assert.match(clientSource, /demoControlsEnabled = demoPaymentEnabled && dashboard\.demoPayment\?\.enabled === true/);
    assert.match(clientSource, /demoControlsEnabled && !paid/);
    assert.match(clientSource, /demoControlsEnabled && dashboard\.payment\?\.method === "DEMO"/);
    assert.match(clientSource, /Complete Demo Internship/);
  });

  it("enables applicant demo payment only through explicit local/test flags", () => {
    assert.equal(isInternshipDemoPaymentEnabled("true"), true);
    assert.equal(isInternshipDemoPaymentEnabled("false"), false);
    assert.equal(isInternshipDemoPaymentEnabled(undefined), false);
    assert.equal(isInternshipDemoPaymentEnabled(undefined, "true"), true);
    assert.equal(isInternshipDemoPaymentEnabled("false", "true"), true);
  });

  it("builds the post-payment timer from backend-stored dates and counters", () => {
    const view = buildApplicantDashboardView(dashboard({
      internship: {
        selectedPlan: "Frontend Developer",
        durationDays: 30,
        status: "ACTIVE",
        startedAt: "2026-07-18T10:00:00.000Z",
        expectedCompletionAt: "2026-08-17T10:00:00.000Z",
        totalDays: 30,
        elapsedDays: 1,
        remainingDays: 29,
        progressPercentage: 3,
      },
      payment: {
        status: "PAID",
        method: "DEMO",
        amountPaise: 100,
        currency: "INR",
      },
    }));

    assert.deepEqual(view.progress, {
      startDate: "18 Jul 2026",
      completionDate: "17 Aug 2026",
      totalDuration: "30 days",
      elapsedDays: "1 day",
      remainingDays: "29 days",
      progressPercentage: 3,
      status: "Active",
    });
    assert.equal(JSON.stringify(view).includes("Frontend Developer"), false);
    assert.equal(JSON.stringify(view).includes(fullUuid), false);
  });
});
