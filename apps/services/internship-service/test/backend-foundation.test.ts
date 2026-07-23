import "reflect-metadata";

import { Controller, Get, Module, Post } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import request from "supertest";
import { hmacSha256 } from "@growblic/internship-shared";

import { AppModule } from "../src/app.module";
import type { BackendConfig } from "@growblic/nest-common";
import {
  closeApplicationWithTimeout,
  configureBackendApplication,
  loadBackendConfig,
} from "@growblic/nest-common";
import {
  DATABASE_READINESS_PROBE,
  type ReadinessProbe,
} from "../src/modules/health/database-readiness.probe";

@Controller("__foundation-test")
class FoundationTestController {
  @Get("error")
  error(): never {
    throw new Error("password=not-for-output databaseUrl=not-for-output");
  }

  @Post("body")
  body() {
    return { accepted: true };
  }
}

@Module({ controllers: [FoundationTestController] })
class FoundationTestModule {}

const apps: INestApplication[] = [];

function testConfig(overrides: Partial<BackendConfig> = {}) {
  return {
    ...loadBackendConfig({ NODE_ENV: "test", LOG_LEVEL: "silent" }),
    requestBodyLimit: 1_024,
    databaseReadinessTimeoutMs: 25,
    ...overrides,
  };
}

async function createApp(probe: ReadinessProbe, config = testConfig()) {
  const testingModule = await Test.createTestingModule({
    imports: [AppModule.register(config), FoundationTestModule],
  })
    .overrideProvider(DATABASE_READINESS_PROBE)
    .useValue(probe)
    .compile();
  const app = testingModule.createNestApplication({ bodyParser: false });
  configureBackendApplication(app, config, {
    rawBodyRoutes: ["/internship-payments/webhooks/razorpay"],
  });
  await app.init();
  apps.push(app);
  return app;
}

function httpTarget(app: INestApplication) {
  const handler = app.getHttpAdapter().getInstance();
  return (request: unknown, response: unknown) => handler(request, response);
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe("backend foundation", () => {
  it("returns liveness", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app)).get("/health/live").expect(200);
    assert.equal(response.body.status, "ok");
    assert.equal(response.body.service, "growblic-internship-service");
  });

  it("does not touch the database for liveness", async () => {
    let checks = 0;
    const app = await createApp({ check: async () => { checks += 1; throw new Error("must not run"); } });
    await request(httpTarget(app)).get("/health/live").expect(200);
    assert.equal(checks, 0);
  });

  it("returns ready when the database probe succeeds", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app)).get("/health/ready").expect(200);
    assert.equal(response.body.dependencies.database, "ready");
  });

  it("returns 503 when the database probe fails", async () => {
    const app = await createApp({ check: async () => { throw new Error("database detail"); } });
    const response = await request(httpTarget(app)).get("/health/ready").expect(503);
    assert.equal(response.body.dependencies.database, "unavailable");
    assert.doesNotMatch(JSON.stringify(response.body), /database detail/i);
  });

  it("returns 503 when the database probe times out", async () => {
    const app = await createApp({ check: () => new Promise<void>(() => undefined) });
    await request(httpTarget(app)).get("/health/ready").expect(503);
  });

  it("generates a request ID", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app)).get("/health/live").expect(200);
    assert.match(response.headers["x-request-id"], /^[0-9a-f-]{36}$/);
    assert.equal(response.body.requestId, response.headers["x-request-id"]);
  });

  it("preserves a bounded safe inbound request ID", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app))
      .get("/health/live")
      .set("x-request-id", "safe-id_123:child")
      .expect(200);
    assert.equal(response.headers["x-request-id"], "safe-id_123:child");
  });

  it("replaces a malformed inbound request ID", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app))
      .get("/health/live")
      .set("x-request-id", "unsafe id with spaces")
      .expect(200);
    assert.notEqual(response.headers["x-request-id"], "unsafe id with spaces");
    assert.match(response.headers["x-request-id"], /^[0-9a-f-]{36}$/);
  });

  it("returns a safe unknown-route response", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app)).get("/does-not-exist").expect(404);
    assert.equal(response.body.error.code, "NOT_FOUND");
    assert.doesNotMatch(JSON.stringify(response.body), /Cannot GET|stack/i);
  });

  it("returns a generic safe response for an unhandled exception", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app)).get("/__foundation-test/error").expect(500);
    const serialized = JSON.stringify(response.body);
    assert.equal(response.body.error.code, "INTERNAL_ERROR");
    assert.doesNotMatch(serialized, /password|databaseUrl|not-for-output|stack/i);
  });

  it("closes gracefully and enforces the shutdown bound", async () => {
    let closed = false;
    await closeApplicationWithTimeout({ close: async () => { closed = true; } } as Pick<INestApplication, "close">, 50);
    assert.equal(closed, true);
    await assert.rejects(
      closeApplicationWithTimeout({ close: () => new Promise<void>(() => undefined) } as Pick<INestApplication, "close">, 10),
      /timed out/i,
    );
  });

  it("rejects an oversized request body safely", async () => {
    const app = await createApp({ check: async () => undefined });
    const response = await request(httpTarget(app))
      .post("/__foundation-test/body")
      .send({ value: "x".repeat(2_000) })
      .expect(413);
    assert.equal(response.body.error.code, "PAYLOAD_TOO_LARGE");
    assert.equal(response.body.requestId, response.headers["x-request-id"]);
    assert.doesNotMatch(JSON.stringify(response.body), /entity too large|stack/i);
  });
});

describe("raw Razorpay webhook body", () => {
  it("rejects a webhook whose raw-body signature is invalid", async () => {
    const app = await createApp({ check: async () => undefined });
    const body = JSON.stringify({ event: "payment.captured", payload: {} });
    const previous = process.env.RAZORPAY_WEBHOOK_SECRET;
    process.env.RAZORPAY_WEBHOOK_SECRET = "test_webhook_secret";
    try {
      await request(httpTarget(app))
        .post("/internship-payments/webhooks/razorpay")
        .set("content-type", "application/json")
        .set("x-razorpay-signature", hmacSha256(`${body} `, "test_webhook_secret"))
        .send(body)
        .expect(401);
    } finally {
      if (previous === undefined) delete process.env.RAZORPAY_WEBHOOK_SECRET;
      else process.env.RAZORPAY_WEBHOOK_SECRET = previous;
    }
  });
});
