import "reflect-metadata";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import request from "supertest";

import { AppModule } from "../../app.module";
import { configureBackendApplication, isAllowedCorsOrigin } from "../../bootstrap";
import type { BackendConfig } from "../../common/config/backend-config";
import { loadBackendConfig } from "../../common/config/backend-config";
import {
  DATABASE_READINESS_PROBE,
} from "../health/database-readiness.probe";
import {
  PUBLIC_SUBMISSION_STORE,
  type PublicSubmissionStore,
} from "./public-submission.store";

const apps: INestApplication[] = [];

function testConfig(overrides: Partial<BackendConfig> = {}) {
  return {
    ...loadBackendConfig({
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      CORS_ALLOWED_ORIGINS: "https://amanieheejhd-ship-it.github.io,https://growblic.com",
    }),
    ...overrides,
  };
}

async function createApp(store: PublicSubmissionStore, config = testConfig()) {
  const module = await Test.createTestingModule({
    imports: [AppModule.register(config)],
  })
    .overrideProvider(DATABASE_READINESS_PROBE)
    .useValue({ check: async () => undefined })
    .overrideProvider(PUBLIC_SUBMISSION_STORE)
    .useValue(store)
    .compile();
  const app = module.createNestApplication({ bodyParser: false });
  configureBackendApplication(app, config);
  await app.init();
  apps.push(app);
  return app;
}

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

const requests = [
  ["/public-submissions/contact", {
    submissionKey: "contact-http-001",
    name: "Synthetic Contact",
    email: "contact@example.com",
    message: "Synthetic contact request",
  }],
  ["/public-submissions/project-requests", {
    submissionKey: "project-http-001",
    name: "Synthetic Project",
    requirements: "Synthetic project request",
    source: "start-project-page",
  }],
  ["/public-submissions/price-calculator", {
    submissionKey: "calculator-http-001",
    name: "Synthetic Calculator",
    requirements: "Synthetic calculator request",
    calculatorData: { category: "Synthetic" },
  }],
  ["/public-submissions/meetups", {
    submissionKey: "meetup-http-001",
    name: "Synthetic Meetup",
    message: "Synthetic meetup request",
  }],
  ["/public-submissions/career-applications", {
    submissionKey: "career-http-001",
    fullName: "Synthetic Candidate",
    email: "career@example.com",
    phone: "9000000000",
    role: "Frontend Developer",
    experience: "1-3 years",
    workLinks: ["https://example.com/portfolio"],
    message: "Synthetic career application",
  }],
  ["/public-submissions/internship-applications", {
    submissionKey: "internship-http-001",
    internshipSlug: "frontend-developer",
    fullName: "Synthetic Intern",
    email: "intern@example.com",
    phone: "9000000000",
    state: "Delhi",
    instituteEnrollment: "No",
    highestQualification: "BCA",
    passingYear: "2026",
  }],
] as const;

describe("public submission HTTP API", () => {
  it("confirms success only after persistence completes for all six endpoints", async () => {
    const saved: string[] = [];
    const app = await createApp({
      save: async (submission) => { saved.push(submission.kind); },
    });

    for (const [path, body] of requests) {
      const response = await request(app.getHttpServer()).post(path).send(body).expect(201);
      assert.equal(response.body.success, true, path);
      assert.equal(response.headers["cache-control"], "no-store, max-age=0", path);
    }
    assert.equal(saved.length, requests.length);
  });

  it("does not report success when persistence fails and does not expose the failure", async () => {
    const app = await createApp({
      save: async () => { throw new Error("customer email and database detail"); },
    });
    const response = await request(app.getHttpServer())
      .post(requests[0][0])
      .send(requests[0][1])
      .expect(500);

    assert.equal(response.body.success, false);
    assert.doesNotMatch(JSON.stringify(response.body), /customer email|database detail/i);
  });

  it("returns generic success for a honeypot without persisting", async () => {
    let saves = 0;
    const app = await createApp({ save: async () => { saves += 1; } });
    const response = await request(app.getHttpServer())
      .post("/public-submissions/contact")
      .send({ website: "bot-filled" })
      .expect(201);

    assert.equal(response.body.success, true);
    assert.equal(saves, 0);
  });

  it("emits CORS access for the GitHub Pages and Growblic origins", async () => {
    const app = await createApp({ save: async () => undefined });
    for (const origin of [
      "https://amanieheejhd-ship-it.github.io",
      "https://growblic.com",
    ]) {
      const response = await request(app.getHttpServer())
        .options("/public-submissions/contact")
        .set("origin", origin)
        .set("access-control-request-method", "POST")
        .expect(204);
      assert.equal(response.headers["access-control-allow-origin"], origin);
    }
  });

  it("allows localhost only outside production", () => {
    const development = testConfig();
    const production = { ...development, environment: "production" as const };
    assert.equal(isAllowedCorsOrigin(development, "http://localhost:3101"), true);
    assert.equal(isAllowedCorsOrigin(development, "http://127.0.0.1:3000"), true);
    assert.equal(isAllowedCorsOrigin(production, "http://localhost:3101"), false);
    assert.equal(isAllowedCorsOrigin(production, "https://attacker.example"), false);
  });
});
