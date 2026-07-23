import { ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import assert from "node:assert/strict";
import { mock } from "node:test";
import { describe, it } from "node:test";

import { InternshipPortalService } from "./internship-portal.service";
import { verifyApplicantPassword } from "./internship-portal.crypto";

type Account = {
  id: string;
  emailNormalized: string;
  emailDisplay: string;
  passwordHash: string | null;
  status: "ACTIVE" | "SUSPENDED" | "DISABLED";
  emailVerifiedAt: Date | null;
  failedLoginCount: number;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type Session = {
  id: string;
  accountId: string;
  tokenHash: string;
  expiresAt: Date;
  lastSeenAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  account?: Account;
};

type Application = {
  id: string;
  submissionKey: string;
  internshipSlug: string;
  candidateName: string;
  email: string;
  phone: string;
  state: string;
  instituteEnrollment: string;
  instituteName: string | null;
  course: string | null;
  enrollmentNumber: string | null;
  highestQualification: string | null;
  passingYear: string | null;
  message: string | null;
  status: "NEW";
  createdAt: Date;
  updatedAt: Date;
  applicantAccountId: string | null;
  selectedPlanId: string | null;
  selectedPlanName: string | null;
  selectedPlanDuration: number | null;
  selectedPlanAmountPaise: number | null;
  selectedPlanCurrency: string | null;
  planSelectedAt: Date | null;
  payment?: null;
  certificate?: null;
};

type AuthFlow = {
  id: string;
  tokenHash: string;
  applicationId: string;
  selectedPlanId: string;
  selectedPlanName: string;
  selectedPlanDuration: number;
  selectedPlanAmountPaise: number;
  selectedPlanCurrency: string;
  provider: string | null;
  oauthStateHash: string | null;
  oauthCodeVerifier: string | null;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  application?: Application;
};

type OAuthIdentity = {
  id: string;
  accountId: string;
  provider: string;
  providerSubject: string;
  providerEmail: string;
  providerEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
};

function createPortalDatabase() {
  let id = 0;
  const accounts = new Map<string, Account>();
  const applications = new Map<string, Application>();
  const authFlows = new Map<string, AuthFlow>();
  const identities: OAuthIdentity[] = [];
  const sessions: Session[] = [];
  const attempts: unknown[] = [];

  const nextId = (prefix: string) => `${prefix}_${++id}`;

  const client = {
    internshipApplicantAccount: {
      findUnique: async ({ where, include }: { where: { emailNormalized?: string; id?: string }; include?: { oauthIdentities?: boolean } }) => {
        let account: Account | null = null;
        if (where.emailNormalized) {
          account = accounts.get(where.emailNormalized) ?? null;
        } else {
          account = [...accounts.values()].find((candidate) => candidate.id === where.id) ?? null;
        }
        return include?.oauthIdentities && account
          ? { ...account, oauthIdentities: identities.filter((identity) => identity.accountId === account.id) }
          : account;
      },
      create: async ({ data, include }: { data: Partial<Account>; include?: { oauthIdentities?: boolean } }) => {
        const now = new Date();
        const account = {
          id: nextId("account"),
          status: "ACTIVE",
          emailVerifiedAt: null,
          failedLoginCount: 0,
          createdAt: now,
          updatedAt: now,
          ...data,
        } as Account;
        accounts.set(account.emailNormalized, account);
        return include?.oauthIdentities ? { ...account, oauthIdentities: [] } : account;
      },
      update: async ({ where, data, include }: { where: { id: string }; data: Record<string, unknown>; include?: { oauthIdentities?: boolean } }) => {
        const account = [...accounts.values()].find((item) => item.id === where.id);
        if (!account) throw new Error("Account not found");
        applyData(account, data);
        account.updatedAt = new Date();
        return include?.oauthIdentities
          ? { ...account, oauthIdentities: identities.filter((identity) => identity.accountId === account.id) }
          : account;
      },
    },
    internshipApplication: {
      findUnique: async ({ where, include, select }: { where: { id?: string; submissionKey?: string }; include?: { payment?: boolean }; select?: { applicantAccountId?: boolean } }) => {
        const application = where.submissionKey
          ? applications.get(where.submissionKey) ?? null
          : [...applications.values()].find((item) => item.id === where.id) ?? null;
        if (!application) return null;
        if (select?.applicantAccountId) return { applicantAccountId: application.applicantAccountId };
        return include?.payment ? { ...application, payment: null } : application;
      },
      findFirst: async ({ where, include }: { where: Record<string, any>; include?: Record<string, unknown> }) => {
        const reference = where.submissionKey as string | undefined;
        const accountId = where.OR?.[0]?.applicantAccountId;
        const email = where.OR?.[1]?.email?.equals;
        const application = [...applications.values()].find((item) =>
          (!reference || item.submissionKey === reference) &&
          (item.applicantAccountId === accountId || item.email.toLowerCase() === String(email).toLowerCase())
        ) ?? null;
        return application && include ? { ...application, payment: null, certificate: null } : application;
      },
      update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        const application = [...applications.values()].find((item) => item.id === where.id);
        if (!application) throw new Error("Application not found");
        applyData(application as unknown as Record<string, unknown>, data);
        application.updatedAt = new Date();
        return application;
      },
      updateMany: async ({ where, data }: { where?: Record<string, any>; data?: Record<string, unknown> } = {}) => {
        let count = 0;
        for (const application of applications.values()) {
          if (!where?.email?.equals || application.email.toLowerCase() === String(where.email.equals).toLowerCase()) {
            if (data) applyData(application as unknown as Record<string, unknown>, data);
            count += 1;
          }
        }
        return { count };
      },
    },
    internshipApplicantAuthFlow: {
      create: async ({ data }: { data: Omit<AuthFlow, "id" | "createdAt"> }) => {
        const flow = {
          id: nextId("flow"),
          createdAt: new Date(),
          ...data,
        } as AuthFlow;
        flow.provider ??= null;
        flow.oauthStateHash ??= null;
        flow.oauthCodeVerifier ??= null;
        flow.consumedAt ??= null;
        authFlows.set(flow.tokenHash, flow);
        return flow;
      },
      findFirst: async ({ where, include }: { where: Record<string, any>; include?: { application?: boolean } }) => {
        const flow = [...authFlows.values()].find((item) =>
          (!where.tokenHash || item.tokenHash === where.tokenHash) &&
          (!where.oauthStateHash || item.oauthStateHash === where.oauthStateHash) &&
          (!where.provider || item.provider === where.provider) &&
          item.consumedAt === where.consumedAt &&
          item.expiresAt > where.expiresAt.gt
        ) ?? null;
        if (!flow) return null;
        const application = [...applications.values()].find((item) => item.id === flow.applicationId);
        return include?.application ? { ...flow, application } : flow;
      },
      update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        const flow = [...authFlows.values()].find((item) => item.id === where.id);
        if (!flow) throw new Error("Flow not found");
        applyData(flow as unknown as Record<string, unknown>, data);
        return flow;
      },
    },
    internshipApplicantOAuthIdentity: {
      findUnique: async ({ where, include }: { where: { provider_providerSubject: { provider: string; providerSubject: string } }; include?: { account?: boolean } }) => {
        const identity = identities.find((item) =>
          item.provider === where.provider_providerSubject.provider &&
          item.providerSubject === where.provider_providerSubject.providerSubject
        ) ?? null;
        if (!identity) return null;
        const account = [...accounts.values()].find((item) => item.id === identity.accountId);
        return include?.account ? { ...identity, account } : identity;
      },
      create: async ({ data }: { data: Omit<OAuthIdentity, "id" | "createdAt" | "updatedAt"> }) => {
        const now = new Date();
        const identity = { id: nextId("identity"), createdAt: now, updatedAt: now, ...data };
        identities.push(identity);
        return identity;
      },
    },
    internshipApplicantEmailVerificationToken: {
      create: async () => ({ id: nextId("verification") }),
    },
    internshipApplicantSession: {
      create: async ({ data }: { data: Omit<Session, "id" | "createdAt"> }) => {
        const session = {
          id: nextId("session"),
          createdAt: new Date(),
          ...data,
        } as Session;
        session.revokedAt ??= null;
        sessions.push(session);
        return session;
      },
      findFirst: async ({ where, include }: { where: Record<string, unknown>; include?: { account?: boolean } }) => {
        const session = sessions.find((item) =>
          item.tokenHash === where.tokenHash &&
          item.revokedAt === null &&
          item.expiresAt > (where.expiresAt as { gt: Date }).gt,
        );
        if (!session) return null;
        const account = [...accounts.values()].find((item) => item.id === session.accountId);
        if (!account || account.status !== "ACTIVE") return null;
        const accountWithIdentities = { ...account, oauthIdentities: identities.filter((identity) => identity.accountId === account.id) };
        return include?.account ? { ...session, account: accountWithIdentities } : session;
      },
      updateMany: async ({ where, data }: { where?: Record<string, unknown>; data?: Record<string, unknown> } = {}) => {
        let count = 0;
        for (const session of sessions) {
          if (!where?.tokenHash || session.tokenHash === where.tokenHash) {
            applyData(session as unknown as Record<string, unknown>, data ?? {});
            count += 1;
          }
        }
        return { count };
      },
    },
    internshipApplicantAuthAttempt: {
      count: async () => 0,
      create: async ({ data }: { data: unknown }) => {
        attempts.push(data);
        return { id: nextId("attempt") };
      },
    },
    auditLog: {
      create: async () => ({ id: nextId("audit") }),
    },
    $transaction: async (input: unknown) => {
      if (typeof input === "function") {
        return input(client);
      }
      return Promise.all(input as Promise<unknown>[]);
    },
  };

  return {
    prisma: client,
    accounts,
    applications,
    authFlows,
    identities,
    attempts,
  };
}

function applyData(target: Record<string, unknown>, data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && "increment" in value) {
      target[key] = Number(target[key] ?? 0) + Number(value.increment);
    } else {
      target[key] = value;
    }
  }
}

function serviceWithDatabase(prisma: object) {
  const service = new InternshipPortalService();
  Object.defineProperty(service, "databaseModule", {
    value: { prisma },
    writable: true,
  });
  return service;
}

function addApplication(database: ReturnType<typeof createPortalDatabase>, overrides: Partial<Application> = {}) {
  const now = new Date("2026-07-18T10:00:00.000Z");
  const application: Application = {
    id: `application_${database.applications.size + 1}`,
    submissionKey: `application-reference-${database.applications.size + 1}`,
    internshipSlug: "frontend-developer",
    candidateName: "OAuth Fixture Applicant",
    email: "oauth.fixture@example.test",
    phone: "+91 98765 43210",
    state: "Maharashtra",
    instituteEnrollment: "college",
    instituteName: "Fixture Institute",
    course: "B.Tech",
    enrollmentNumber: "ENR-1",
    highestQualification: "Undergraduate",
    passingYear: "2026",
    message: "Ready to learn.",
    status: "NEW",
    createdAt: now,
    updatedAt: now,
    applicantAccountId: null,
    selectedPlanId: null,
    selectedPlanName: null,
    selectedPlanDuration: null,
    selectedPlanAmountPaise: null,
    selectedPlanCurrency: null,
    planSelectedAt: null,
    payment: null,
    certificate: null,
    ...overrides,
  };
  database.applications.set(application.submissionKey, application);
  return application;
}

describe("InternshipPortalService authentication", () => {
  it("registers with normalized email, stores an Argon2 hash, logs in, and rejects duplicates", async () => {
    const database = createPortalDatabase();
    const service = serviceWithDatabase(database.prisma);
    const password = "GrowblicTestPassword123!";
    const email = "  Applicant.Auth+Fixture@Example.TEST  ";

    const registered = await service.register({ email, password }, {});
    assert.equal(registered.account.email, "Applicant.Auth+Fixture@Example.TEST");
    assert.equal(registered.account.emailVerified, false);

    const stored = database.accounts.get("applicant.auth+fixture@example.test");
    assert.ok(stored);
    assert.equal(stored.emailNormalized, "applicant.auth+fixture@example.test");
    assert.equal(stored.emailDisplay, "Applicant.Auth+Fixture@Example.TEST");
    assert.equal(typeof stored.passwordHash, "string");
    const passwordHash = stored.passwordHash ?? "";
    assert.match(passwordHash, /^\$argon2id\$/);
    assert.equal(await verifyApplicantPassword(passwordHash, password), true);

    const activeSession = await service.session(registered.token);
    assert.equal(activeSession.account.email, "Applicant.Auth+Fixture@Example.TEST");
    const emptyDashboard = await service.dashboard(registered.token);
    assert.equal(emptyDashboard.application, null);
    assert.equal(emptyDashboard.applicant, null);

    const loggedIn = await service.login({
      email: "  APPLICANT.AUTH+FIXTURE@EXAMPLE.TEST  ",
      password,
    }, {});
    assert.equal(loggedIn.account.email, "Applicant.Auth+Fixture@Example.TEST");
    assert.equal(loggedIn.account.failedLoginCount, 0);

    await assert.rejects(
      service.login({ email: "applicant.auth+fixture@example.test", password: "WrongPassword123!" }, {}),
      (error) => {
        assert.ok(error instanceof UnauthorizedException);
        assert.equal(error.message, "Invalid email or password.");
        return true;
      },
    );

    await assert.rejects(
      service.register({ email: "  APPLICANT.AUTH+FIXTURE@EXAMPLE.TEST  ", password }, {}),
      (error) => {
        assert.ok(error instanceof ConflictException);
        assert.equal(error.message, "An account already exists for this email. Please sign in.");
        return true;
      },
    );

    await service.logout(loggedIn.token);
    await assert.rejects(service.session(loggedIn.token), UnauthorizedException);
  });

  it("stores a selected plan, completes GitHub OAuth, links the pending application, and rejects flow reuse", async () => {
    const database = createPortalDatabase();
    const application = addApplication(database);
    const service = serviceWithDatabase(database.prisma);
    process.env.GITHUB_CLIENT_ID = "github-client-fixture";
    process.env.GITHUB_CLIENT_SECRET = "github-secret-fixture";
    process.env.GITHUB_CALLBACK_URL = "http://localhost:4000/internship-portal/auth/oauth/github/callback";
    process.env.FRONTEND_URL = "http://localhost:3002";

    const pending = await service.createPendingAuthFlow({
      applicationReference: application.submissionKey,
      duration: 60,
    }, {});
    assert.equal(pending.selectedPlanName, "Frontend Developer");
    assert.equal(pending.durationDays, 60);
    assert.equal(database.applications.get(application.submissionKey)?.selectedPlanDuration, 60);

    const redirectUrl = await service.startOAuth("github", { flowToken: pending.flowToken }, {});
    const state = new URL(redirectUrl).searchParams.get("state");
    assert.ok(state);

    const fetchMock = mock.method(globalThis, "fetch", (async (url: string | URL) => {
      const href = String(url);
      if (href === "https://github.com/login/oauth/access_token") {
        return Response.json({ access_token: "github-access-token" });
      }
      if (href === "https://api.github.com/user") {
        return Response.json({ id: 12345 });
      }
      if (href === "https://api.github.com/user/emails") {
        return Response.json([
          { email: "oauth.fixture@example.test", primary: true, verified: true },
        ]);
      }
      return Response.json({ error: "unexpected" }, { status: 500 });
    }) as typeof fetch);
    try {
      const completed = await service.completeOAuth("github", { code: "provider-code", state }, {});
      assert.equal(completed.account.email, "oauth.fixture@example.test");
      assert.equal(completed.account.emailVerified, true);
      assert.match(completed.redirectUrl, /applicationReference=application-reference-1/);
      const stored = database.accounts.get("oauth.fixture@example.test");
      assert.ok(stored);
      assert.equal(stored.passwordHash, null);
      assert.equal(database.identities.length, 1);
      assert.equal(database.applications.get(application.submissionKey)?.applicantAccountId, stored.id);

      await assert.rejects(
        service.completeOAuth("github", { code: "provider-code", state }, {}),
        /invalid or expired/,
      );
    } finally {
      fetchMock.mock.restore();
    }
  });
});

describe("InternshipPortalService demo certificate completion", () => {
  async function withDemoFlag<T>(
    environment: string,
    enabled: string | undefined,
    run: () => Promise<T>,
  ) {
    const previousEnvironment = process.env.NODE_ENV;
    const previousEnabled = process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED;
    process.env.NODE_ENV = environment;
    if (enabled === undefined) delete process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED;
    else process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED = enabled;
    try {
      return await run();
    } finally {
      if (previousEnvironment === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousEnvironment;
      if (previousEnabled === undefined) delete process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED;
      else process.env.INTERNSHIP_DEMO_PAYMENT_ENABLED = previousEnabled;
    }
  }

  function demoCompletionFixture(overrides: Record<string, unknown> = {}) {
    const application = {
      id: "application_demo_certificate",
      submissionKey: "application-demo-certificate",
      internshipSlug: "frontend-developer",
      candidateName: "Demo Certificate Applicant",
      email: "demo.certificate@example.test",
      phone: "+91 98765 43210",
    };
    const payment = {
      id: "payment_demo_certificate",
      status: "PAID",
      gateway: "DEMO",
      paymentMethod: "DEMO",
      amountPaise: 100,
      internshipApplicationId: application.id,
      internshipProgram: "Frontend Developer",
      selectedDuration: 30,
      paidAt: new Date("2026-07-18T10:00:00.000Z"),
      internshipStartedAt: new Date("2026-07-18T00:00:00.000Z"),
      joiningDate: new Date("2026-07-18T00:00:00.000Z"),
      expectedCompletionAt: new Date("2026-08-16T00:00:00.000Z"),
      ...overrides,
    };
    const certificate: {
      id: string;
      applicationId: string;
      paymentId: string;
      durationDays: number;
      paidAt: Date;
      publicReference: string;
      joiningDate: Date | null;
      completionDate: Date | null;
      reminderDueAt: Date | null;
      status: string;
      domainRole: string | null;
      designation: string | null;
      projectWork: string | null;
      performanceSummary: string | null;
      certificateNumber: string | null;
      certificateSequence: number | null;
      certificateYear: number | null;
      issuedAt: Date | null;
      generatedAt: Date | null;
      pdfBytes: Buffer | null;
      pdfSha256: string | null;
      skills: Array<{ name: string; position: number }>;
      application: typeof application;
      payment: typeof payment;
    } = {
      id: "certificate_demo",
      applicationId: application.id,
      paymentId: payment.id,
      durationDays: 30,
      paidAt: payment.paidAt,
      publicReference: "GB26DEMOREF",
      joiningDate: payment.joiningDate,
      completionDate: payment.expectedCompletionAt,
      reminderDueAt: payment.expectedCompletionAt,
      status: "PENDING_SKILLS",
      domainRole: null,
      designation: null,
      projectWork: null,
      performanceSummary: null,
      certificateNumber: null,
      certificateSequence: null,
      certificateYear: null,
      issuedAt: null,
      generatedAt: null,
      pdfBytes: null,
      pdfSha256: null,
      skills: [] as Array<{ name: string; position: number }>,
      application,
      payment,
    };
    const transaction = {
      internshipCertificate: {
        findUniqueOrThrow: async () => certificate,
        update: async ({ data }: { data: Record<string, unknown> }) => {
          Object.assign(certificate, data);
          return certificate;
        },
      },
      internshipCertificateSkill: {
        createMany: async ({ data }: { data: Array<{ name: string; position: number }> }) => {
          certificate.skills = data;
          return { count: data.length };
        },
      },
      internshipCertificateSequence: {
        upsert: async () => ({ year: 2026, lastValue: 7 }),
      },
      internshipPayment: {
        update: async ({ data }: { data: Record<string, unknown> }) => {
          Object.assign(payment, data);
          return payment;
        },
      },
      auditLog: { create: async () => ({ id: "audit_demo" }) },
    };
    const prisma = {
      $transaction: async <T>(callback: (client: typeof transaction) => Promise<T>) =>
        callback(transaction),
    };
    return { application: { ...application, payment, certificate }, payment, certificate, prisma };
  }

  it("rejects local demo internship completion in production", async () => {
    const service = serviceWithDatabase({});
    await withDemoFlag("production", "true", async () => {
      await assert.rejects(
        service.completeDemoInternship("session", {}),
        NotFoundException,
      );
    });
  });

  it("rejects another applicant or non-demo payment before generating a certificate", async () => {
    const service = serviceWithDatabase({});
    await withDemoFlag("test", "true", async () => {
      Object.defineProperty(service, "requireAccount", { value: async () => ({ id: "account_1" }), configurable: true });
      Object.defineProperty(service, "ownedApplication", { value: async () => { throw new NotFoundException(); }, configurable: true });
      await assert.rejects(
        service.completeDemoInternship("session", { applicationReference: "other" }),
        NotFoundException,
      );

      const fixture = demoCompletionFixture({ paymentMethod: "card", gateway: "RAZORPAY", amountPaise: 300000 });
      Object.defineProperty(service, "ownedApplication", { value: async () => fixture.application, configurable: true });
      await assert.rejects(
        service.completeDemoInternship("session", { applicationReference: fixture.application.submissionKey }),
        NotFoundException,
      );
    });
  });

  it("generates a ready demo certificate for the authenticated applicant's own paid demo internship", async () => {
    const fixture = demoCompletionFixture();
    const service = serviceWithDatabase(fixture.prisma);
    Object.defineProperty(service, "requireAccount", { value: async () => ({ id: "account_1" }), configurable: true });
    Object.defineProperty(service, "ownedApplication", { value: async () => fixture.application, configurable: true });
    Object.defineProperty(service, "certificateStatus", {
      value: async () => ({
        eligible: true,
        available: Boolean(fixture.certificate.pdfBytes),
        status: fixture.certificate.status,
      }),
      configurable: true,
    });

    await withDemoFlag("test", "true", async () => {
      const result = await service.completeDemoInternship("session", {
        applicationReference: fixture.application.submissionKey,
      });

      const today = new Date();
      const expectedCompletionAt = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
      )).toISOString();
      assert.equal(result.success, true);
      assert.equal(fixture.payment.selectedDuration, 30);
      assert.equal(fixture.payment.expectedCompletionAt?.toISOString(), expectedCompletionAt);
      assert.equal(fixture.certificate.status, "GENERATED");
      assert.equal(fixture.certificate.certificateNumber, "GB-CERT-2026-000007");
      assert.equal(fixture.certificate.domainRole, "Frontend Development");
      assert.ok(fixture.certificate.pdfBytes instanceof Buffer);
      assert.ok(fixture.certificate.pdfBytes.length > 1000);
      assert.equal(fixture.certificate.skills.length, 3);
      assert.deepEqual(result.certificate, {
        eligible: true,
        available: true,
        status: "GENERATED",
      });
    });
  });
});

describe("InternshipPortalService document download tracking", () => {
  it("records applicant certificate downloads without counting views", async () => {
    const accesses: unknown[] = [];
    const service = serviceWithDatabase({
      internshipApplicantDocumentAccess: {
        create: async ({ data }: { data: unknown }) => {
          accesses.push(data);
          return { id: "access_1" };
        },
      },
    });
    const application = {
      id: "application_download_tracking",
      payment: {
        status: "PAID",
        expectedCompletionAt: new Date("2026-07-17T00:00:00.000Z"),
      },
      certificate: {
        id: "certificate_download_tracking",
        status: "GENERATED",
        certificateNumber: "GB-CERT-2026-000003",
        publicReference: "GB26CERTREF",
        pdfBytes: Buffer.from("%PDF-1.4 tracked certificate"),
      },
    };
    Object.defineProperty(service, "requireAccount", { value: async () => ({ id: "account_1" }), configurable: true });
    Object.defineProperty(service, "ownedApplication", { value: async () => application, configurable: true });

    await service.certificate("session", false);
    assert.equal(accesses.length, 0);

    await service.certificate("session", true);
    assert.deepEqual(accesses, [{
      accountId: "account_1",
      documentType: "CERTIFICATE",
      documentId: "certificate_download_tracking",
      actorType: "APPLICANT",
      action: "DOWNLOAD",
    }]);
  });
});

describe("InternshipPortalService SSO from public", () => {
  const PASSWORD = "GrowblicTestPassword123!";

  // Stub the server-to-server call to accounts-service's internal identity
  // endpoint. `identity` is what accounts-service reports for the validated
  // public session — the ONLY source of the email.
  function stubPublicIdentity(identity: unknown) {
    return mock.method(globalThis, "fetch", (async (url: string | URL) => {
      if (String(url).endsWith("/internal/public-user-identity")) {
        return Response.json(identity as Record<string, unknown>);
      }
      return Response.json({ error: "unexpected" }, { status: 500 });
    }) as typeof fetch);
  }

  async function withBridgeToken(run: () => Promise<void>) {
    const previous = process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
    process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN = "bridge-token";
    try {
      await run();
    } finally {
      if (previous === undefined) delete process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
      else process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN = previous;
    }
  }

  it("mints a normal applicant session when the public email matches an ACTIVE applicant account", async () => {
    const database = createPortalDatabase();
    const service = serviceWithDatabase(database.prisma);
    await service.register({ email: "linked@example.test", password: PASSWORD }, {});
    const fetchMock = stubPublicIdentity({
      authenticated: true,
      id: "pub_1",
      emailNormalized: "linked@example.test",
    });
    try {
      await withBridgeToken(async () => {
        const result = await service.ssoFromPublic("public-session-token", {});
        assert.equal(result.linked, true);
        if (!result.linked) throw new Error("unreachable");
        assert.ok(result.token);
        // The minted session authenticates as the matched account — identical
        // to a password login.
        const session = await service.session(result.token);
        assert.equal(session.account.email, "linked@example.test");
        // A successful SSO auth attempt was recorded.
        assert.ok(
          database.attempts.some(
            (a) => (a as { action?: string; successful?: boolean }).action === "SSO_FROM_PUBLIC" &&
              (a as { successful?: boolean }).successful === true,
          ),
        );
      });
    } finally {
      fetchMock.mock.restore();
    }
  });

  it("does NOT mint a session when no internship account matches the public email", async () => {
    const database = createPortalDatabase();
    const service = serviceWithDatabase(database.prisma);
    const fetchMock = stubPublicIdentity({
      authenticated: true,
      id: "pub_2",
      emailNormalized: "nomatch@example.test",
    });
    try {
      await withBridgeToken(async () => {
        const result = await service.ssoFromPublic("public-session-token", {});
        assert.equal(result.linked, false);
        assert.equal(database.attempts.filter((a) => (a as { successful?: boolean }).successful).length, 0);
      });
    } finally {
      fetchMock.mock.restore();
    }
  });

  it("email-match safety: a public session can NEVER reach an account it does not own", async () => {
    // A victim owns an internship account. An attacker's public session resolves
    // to the attacker's OWN email (server-derived). Because the endpoint takes
    // no email input and matches only the session owner's email, the attacker
    // reaches nothing.
    const database = createPortalDatabase();
    const service = serviceWithDatabase(database.prisma);
    await service.register({ email: "victim@example.test", password: PASSWORD }, {});
    const fetchMock = stubPublicIdentity({
      authenticated: true,
      id: "pub_attacker",
      emailNormalized: "attacker@example.test",
    });
    try {
      await withBridgeToken(async () => {
        const result = await service.ssoFromPublic("attacker-session", {});
        assert.equal(result.linked, false);
      });
    } finally {
      fetchMock.mock.restore();
    }
  });

  it("returns linked=false for an invalid/expired public session", async () => {
    const database = createPortalDatabase();
    const service = serviceWithDatabase(database.prisma);
    await service.register({ email: "linked@example.test", password: PASSWORD }, {});
    const fetchMock = stubPublicIdentity({ authenticated: false });
    try {
      await withBridgeToken(async () => {
        const result = await service.ssoFromPublic("bad-session", {});
        assert.equal(result.linked, false);
      });
    } finally {
      fetchMock.mock.restore();
    }
  });

  it("returns linked=false when the bridge token is not configured (fails safe)", async () => {
    const database = createPortalDatabase();
    const service = serviceWithDatabase(database.prisma);
    await service.register({ email: "linked@example.test", password: PASSWORD }, {});
    const previous = process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
    delete process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
    // fetch must never even be called when unconfigured.
    const fetchMock = mock.method(globalThis, "fetch", (async () => {
      throw new Error("fetch should not be called when the bridge is unconfigured");
    }) as typeof fetch);
    try {
      const result = await service.ssoFromPublic("public-session-token", {});
      assert.equal(result.linked, false);
      assert.equal(fetchMock.mock.calls.length, 0);
    } finally {
      fetchMock.mock.restore();
      if (previous === undefined) delete process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN;
      else process.env.PUBLIC_IDENTITY_INTERNAL_TOKEN = previous;
    }
  });
});
