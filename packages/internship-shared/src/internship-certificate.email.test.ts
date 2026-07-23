import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ServiceUnavailableException } from "@nestjs/common";
import {
  type CertificateEmail,
  type CertificateEmailProviderDependencies,
  type SmtpSendFunction,
  createCertificateEmailAdapter,
} from "./internship-certificate.email";

const message: CertificateEmail = {
  to: "admin@example.test",
  subject: "Internship certificate details required — Fixture Candidate",
  html: "<p>Certificate details are due soon.</p>",
  idempotencyKey: "internship-certificate/reminder/certificate_fixture",
};

function smtpEnvironment(overrides: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "development",
    INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER: "smtp",
    INTERNSHIP_CERTIFICATE_FROM_EMAIL: "growblic.sender@gmail.com",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USER: "growblic.sender@gmail.com",
    SMTP_APP_PASSWORD: "abcdefghijklmnop",
    ...overrides,
  };
}

function dependencies(
  sendMail: SmtpSendFunction,
  fetchImplementation = (async () => {
    throw new Error("Unexpected fetch");
  }) as typeof fetch,
): CertificateEmailProviderDependencies {
  return {
    fetch: fetchImplementation,
    createTransport: () => ({ sendMail }),
  };
}

describe("internship certificate email provider", () => {
  it("fails closed when SMTP configuration is absent", () => {
    assert.throws(
      () =>
        createCertificateEmailAdapter(
          smtpEnvironment({ SMTP_APP_PASSWORD: "" }),
          dependencies(async () => ({ accepted: [], messageId: "" })),
        ),
      ServiceUnavailableException,
    );
  });

  it("rejects the development SMTP adapter in production", () => {
    assert.throws(
      () =>
        createCertificateEmailAdapter(
          smtpEnvironment({ NODE_ENV: "production" }),
          dependencies(async () => ({ accepted: [], messageId: "" })),
        ),
      /unavailable in production/,
    );
  });

  it("accepts SMTP delivery only with the intended recipient and message ID", async () => {
    const adapter = createCertificateEmailAdapter(
      smtpEnvironment(),
      dependencies(async (mail) => {
        assert.equal(mail.to, message.to);
        assert.equal(
          mail.headers["X-Growblic-Idempotency-Key"],
          message.idempotencyKey,
        );
        return { accepted: [message.to], messageId: "<gmail-message-id>" };
      }),
    );

    assert.deepEqual(await adapter.send(message), {
      providerId: "<gmail-message-id>",
    });
  });

  it("fails when SMTP rejects the intended recipient", async () => {
    const adapter = createCertificateEmailAdapter(
      smtpEnvironment(),
      dependencies(async () => ({
        accepted: ["someone-else@example.test"],
        messageId: "<gmail-message-id>",
      })),
    );

    await assert.rejects(
      adapter.send(message),
      /did not confirm accepted recipient/,
    );
  });

  it("never exposes the Gmail app password from provider failures", async () => {
    const secret = "secret-app-pass";
    const adapter = createCertificateEmailAdapter(
      smtpEnvironment({ SMTP_APP_PASSWORD: secret }),
      dependencies(async () => {
        throw new Error(`Authentication failed for ${secret}`);
      }),
    );

    await assert.rejects(adapter.send(message), (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "SMTP email delivery failed");
      assert.equal(error.message.includes(secret), false);
      return true;
    });
  });

  it("keeps Resend delivery and idempotency behavior unchanged", async () => {
    let request: RequestInit | undefined;
    const adapter = createCertificateEmailAdapter(
      {
        INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER: "resend",
        INTERNSHIP_CERTIFICATE_FROM_EMAIL: "certificates@example.test",
        RESEND_API_KEY: "test-resend-key",
      },
      dependencies(
        async () => ({ accepted: [], messageId: "" }),
        (async (_input, init) => {
          request = init;
          return new Response(JSON.stringify({ id: "resend-message-id" }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }) as typeof fetch,
      ),
    );

    assert.deepEqual(await adapter.send(message), {
      providerId: "resend-message-id",
    });
    assert.equal(
      (request?.headers as Record<string, string>)["idempotency-key"],
      message.idempotencyKey,
    );
  });

  it("requires Resend to return a delivery identifier", async () => {
    const adapter = createCertificateEmailAdapter(
      {
        INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER: "resend",
        INTERNSHIP_CERTIFICATE_FROM_EMAIL: "certificates@example.test",
        RESEND_API_KEY: "test-resend-key",
      },
      dependencies(
        async () => ({ accepted: [], messageId: "" }),
        (async () =>
          new Response("{}", {
            status: 200,
            headers: { "content-type": "application/json" },
          })) as typeof fetch,
      ),
    );

    await assert.rejects(adapter.send(message), /did not confirm delivery/);
  });
});
