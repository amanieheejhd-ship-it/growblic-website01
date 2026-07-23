import "reflect-metadata";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import request from "supertest";

import { AppModule } from "../../app.module";
import { configureBackendApplication } from "@growblic/nest-common";
import { loadBackendConfig } from "@growblic/nest-common";
import { DATABASE_READINESS_PROBE } from "../health/database-readiness.probe";
import { PUBLIC_USER_DATABASE } from "./public-auth.database";
import { PublicAuthEmailProvider } from "./public-auth.email";

// ---- in-memory fake of the (subset of) Prisma client the service uses -------

type Row = Record<string, unknown>;

function matches(row: Row, where: Row): boolean {
  for (const [key, condition] of Object.entries(where)) {
    const value = row[key];
    if (condition && typeof condition === "object" && !(condition instanceof Date)) {
      const c = condition as Record<string, unknown>;
      if ("gt" in c && !(value instanceof Date && value > (c.gt as Date))) return false;
      if ("gte" in c && !(value instanceof Date && value >= (c.gte as Date))) return false;
    } else if (value !== condition) {
      return false;
    }
  }
  return true;
}

function createFakeDatabase() {
  let counter = 0;
  const nextId = (prefix: string) => `${prefix}_${(counter += 1)}`;
  const accounts: Row[] = [];
  const sessions: Row[] = [];
  const resetTokens: Row[] = [];
  const attempts: Row[] = [];
  const audits: Row[] = [];

  const table = (rows: Row[], prefix: string, defaults: () => Row) => ({
    async create({ data }: { data: Row }) {
      const row = { id: nextId(prefix), ...defaults(), ...data };
      rows.push(row);
      return row;
    },
    async findUnique({ where, select }: { where: Row; select?: Record<string, boolean> }) {
      const row = rows.find((candidate) => matches(candidate, where));
      if (!row) return null;
      if (!select) return { ...row };
      const picked: Row = {};
      for (const key of Object.keys(select)) picked[key] = row[key];
      return picked;
    },
    async findFirst({ where }: { where: Row }) {
      const row = rows.find((candidate) => matches(candidate, where));
      return row ? { ...row } : null;
    },
    async update({ where, data }: { where: Row; data: Row }) {
      const row = rows.find((candidate) => matches(candidate, where));
      if (!row) throw new Error("record not found");
      for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === "object" && "increment" in (value as Row)) {
          row[key] = (Number(row[key]) || 0) + Number((value as Row).increment);
        } else {
          row[key] = value;
        }
      }
      return { ...row };
    },
    async updateMany({ where, data }: { where: Row; data: Row }) {
      let count = 0;
      for (const row of rows) {
        if (matches(row, where)) {
          Object.assign(row, data);
          count += 1;
        }
      }
      return { count };
    },
    async count({ where }: { where: Row }) {
      return rows.filter((row) => matches(row, where)).length;
    },
  });

  const prisma = {
    publicUserAccount: table(accounts, "acct", () => ({
      status: "ACTIVE",
      failedLoginCount: 0,
      displayName: null,
      fullName: null,
      phone: null,
      company: null,
      lastLoginAt: null,
      createdAt: new Date(),
    })),
    publicUserSession: table(sessions, "sess", () => ({
      revokedAt: null,
      lastSeenAt: null,
      createdAt: new Date(),
    })),
    publicUserPasswordResetToken: table(resetTokens, "reset", () => ({
      usedAt: null,
      createdAt: new Date(),
    })),
    publicUserAuthAttempt: table(attempts, "att", () => ({ createdAt: new Date() })),
    auditLog: table(audits, "audit", () => ({ createdAt: new Date() })),
    async $transaction(arg: unknown) {
      if (typeof arg === "function") {
        return (arg as (tx: unknown) => Promise<unknown>)(prisma);
      }
      return Promise.all(arg as Promise<unknown>[]);
    },
  };

  return { prisma, stores: { accounts, sessions, resetTokens, attempts, audits } };
}

// ---- test harness -----------------------------------------------------------

const apps: INestApplication[] = [];

function testConfig() {
  return loadBackendConfig({
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
    CORS_ALLOWED_ORIGINS: "https://growblic.com",
  });
}

async function createApp() {
  const fake = createFakeDatabase();
  const capturedResetUrls: string[] = [];
  const config = testConfig();
  const module = await Test.createTestingModule({
    imports: [AppModule.register(config)],
  })
    .overrideProvider(DATABASE_READINESS_PROBE)
    .useValue({ check: async () => undefined })
    .overrideProvider(PUBLIC_USER_DATABASE)
    .useValue({ client: async () => fake.prisma })
    .overrideProvider(PublicAuthEmailProvider)
    .useValue({
      sendPasswordReset: async (_email: string, url: string) => {
        capturedResetUrls.push(url);
      },
    })
    .compile();
  const app = module.createNestApplication({ bodyParser: false });
  configureBackendApplication(app, config);
  await app.init();
  apps.push(app);
  return { app, stores: fake.stores, capturedResetUrls };
}

function agent(app: INestApplication) {
  return (request as unknown as (h: unknown) => request.SuperTest<request.Test>)(
    app.getHttpAdapter().getInstance(),
  );
}

function cookieFrom(response: request.Response) {
  const raw = response.headers["set-cookie"];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.map((entry) => entry.split(";")[0]).join("; ");
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

const PASSWORD = "correct horse battery staple";
const EMAIL = "user@example.com";

describe("public-auth HTTP API", () => {
  it("registers, sets a session cookie, and stores only hashes", async () => {
    const { app, stores } = await createApp();
    const response = await agent(app)
      .post("/public-auth/register")
      .send({ email: EMAIL, password: PASSWORD, displayName: "Jane" })
      .expect(201);

    assert.equal(response.body.success, true);
    assert.equal(response.body.user.email, EMAIL);
    assert.equal(response.headers["cache-control"], "no-store, max-age=0");
    const setCookie = String(response.headers["set-cookie"]);
    assert.match(setCookie, /growblic_user_session=/);
    assert.match(setCookie, /HttpOnly/i);
    assert.doesNotMatch(setCookie, /growblic_applicant_session|growblic_admin_session/);

    // password stored as argon2id; session token stored as sha256 only
    assert.equal(stores.accounts.length, 1);
    assert.match(String(stores.accounts[0].passwordHash), /^\$argon2id\$/);
    assert.equal(stores.accounts[0].passwordHash === PASSWORD, false);
    assert.match(String(stores.sessions[0].tokenHash), /^[0-9a-f]{64}$/);
    assert.ok(stores.audits.some((a) => a.action === "PUBLIC_USER_REGISTER"));
  });

  it("rejects a duplicate email with 409", async () => {
    const { app } = await createApp();
    await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);
    await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(409);
  });

  it("logs in, returns the session, and logs out", async () => {
    const { app } = await createApp();
    const reg = await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);
    // logout to test a fresh login
    await agent(app).post("/public-auth/logout").set("Cookie", cookieFrom(reg)).expect(201);

    const login = await agent(app).post("/public-auth/login").send({ email: EMAIL, password: PASSWORD }).expect(201);
    const cookie = cookieFrom(login);
    const session = await agent(app).get("/public-auth/session").set("Cookie", cookie).expect(200);
    assert.equal(session.body.user.email, EMAIL);

    await agent(app).post("/public-auth/logout").set("Cookie", cookie).expect(201);
    await agent(app).get("/public-auth/session").set("Cookie", cookie).expect(401);
  });

  it("gives an identical generic error for wrong password and unknown user (no enumeration)", async () => {
    const { app } = await createApp();
    await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);

    const wrong = await agent(app).post("/public-auth/login").send({ email: EMAIL, password: "wrong password 123" }).expect(401);
    const unknown = await agent(app).post("/public-auth/login").send({ email: "ghost@example.com", password: "wrong password 123" }).expect(401);
    assert.equal(wrong.body.error.message, unknown.body.error.message);
    assert.match(wrong.body.error.message, /invalid email or password/i);
  });

  it("throttles after repeated failures", async () => {
    const { app } = await createApp();
    await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);
    for (let i = 0; i < 8; i += 1) {
      await agent(app).post("/public-auth/login").send({ email: EMAIL, password: "bad password 000" }).expect(401);
    }
    await agent(app).post("/public-auth/login").send({ email: EMAIL, password: "bad password 000" }).expect(403);
  });

  it("returns the same generic message for forgot-password whether the email exists or not", async () => {
    const { app } = await createApp();
    await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);

    const real = await agent(app).post("/public-auth/forgot-password").send({ email: EMAIL }).expect(201);
    const fake = await agent(app).post("/public-auth/forgot-password").send({ email: "nobody@example.com" }).expect(201);
    assert.deepEqual(real.body, fake.body);
    assert.equal(real.body.success, true);
    assert.match(real.body.message, /if an account exists/i);
  });

  it("resets the password with a valid token, revoking old sessions", async () => {
    const { app, capturedResetUrls } = await createApp();
    const reg = await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);
    const oldCookie = cookieFrom(reg);

    await agent(app).post("/public-auth/forgot-password").send({ email: EMAIL }).expect(201);
    assert.equal(capturedResetUrls.length, 1);
    const token = new URL(capturedResetUrls[0]).searchParams.get("token");
    assert.ok(token);

    const NEW_PASSWORD = "brand new password 999";
    await agent(app).post("/public-auth/reset-password").send({ token, password: NEW_PASSWORD }).expect(201);

    // old session revoked
    await agent(app).get("/public-auth/session").set("Cookie", oldCookie).expect(401);
    // token is single-use
    await agent(app).post("/public-auth/reset-password").send({ token, password: NEW_PASSWORD }).expect(400);
    // can log in with the new password; old password fails
    await agent(app).post("/public-auth/login").send({ email: EMAIL, password: PASSWORD }).expect(401);
    await agent(app).post("/public-auth/login").send({ email: EMAIL, password: NEW_PASSWORD }).expect(201);
  });

  it("reads and updates the profile when authenticated", async () => {
    const { app } = await createApp();
    const reg = await agent(app).post("/public-auth/register").send({ email: EMAIL, password: PASSWORD }).expect(201);
    const cookie = cookieFrom(reg);

    const me = await agent(app).get("/public-auth/me").set("Cookie", cookie).expect(200);
    assert.equal(me.body.user.email, EMAIL);

    const patched = await agent(app)
      .patch("/public-auth/me")
      .set("Cookie", cookie)
      .send({ displayName: "Jane Doe", fullName: "Jane A. Doe", company: "Growblic" })
      .expect(200);
    assert.equal(patched.body.user.displayName, "Jane Doe");
    assert.equal(patched.body.user.fullName, "Jane A. Doe");
    assert.equal(patched.body.user.company, "Growblic");

    // unauthenticated profile access is rejected
    await agent(app).get("/public-auth/me").expect(401);
  });
});
