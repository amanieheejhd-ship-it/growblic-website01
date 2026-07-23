import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type CertificateEmail = {
  to: string;
  subject: string;
  html: string;
  idempotencyKey: string;
  attachment?: { filename: string; content: string };
};

type EmailDeliveryResult = { providerId: string };
type EmailDeliveryAdapter = {
  send(message: CertificateEmail): Promise<EmailDeliveryResult>;
};
type SmtpDeliveryResult = {
  accepted?: unknown[];
  messageId?: unknown;
};
type SmtpMailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
  headers: Record<string, string>;
  attachments?: Array<{ filename: string; content: Buffer }>;
};
export type SmtpSendFunction = (
  options: SmtpMailOptions,
) => Promise<SmtpDeliveryResult>;
type SmtpTransportLike = { sendMail: SmtpSendFunction };

export type CertificateEmailProviderDependencies = {
  fetch: typeof globalThis.fetch;
  createTransport(options: SMTPTransport.Options): SmtpTransportLike;
};

const defaultDependencies: CertificateEmailProviderDependencies = {
  fetch: globalThis.fetch.bind(globalThis),
  createTransport: (options) =>
    nodemailer.createTransport(options) as unknown as SmtpTransportLike,
};

function requiredEnvironment(environment: NodeJS.ProcessEnv, name: string) {
  const value = environment[name]?.trim();
  if (!value) {
    throw new ServiceUnavailableException(`Missing server configuration: ${name}`);
  }
  return value;
}

function smtpPort(environment: NodeJS.ProcessEnv) {
  const value = requiredEnvironment(environment, "SMTP_PORT");
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new ServiceUnavailableException("Invalid server configuration: SMTP_PORT");
  }
  return port;
}

function smtpSecure(environment: NodeJS.ProcessEnv) {
  const value = requiredEnvironment(environment, "SMTP_SECURE").toLowerCase();
  if (value !== "true" && value !== "false") {
    throw new ServiceUnavailableException("Invalid server configuration: SMTP_SECURE");
  }
  return value === "true";
}

function acceptedAddress(value: unknown) {
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    "address" in value &&
    typeof value.address === "string"
  ) {
    return value.address;
  }
  return null;
}

function resendAdapter(
  environment: NodeJS.ProcessEnv,
  dependencies: CertificateEmailProviderDependencies,
): EmailDeliveryAdapter {
  return {
    async send(message) {
      const response = await dependencies.fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${requiredEnvironment(environment, "RESEND_API_KEY")}`,
          "content-type": "application/json",
          "idempotency-key": message.idempotencyKey,
        },
        body: JSON.stringify({
          from: requiredEnvironment(environment, "INTERNSHIP_CERTIFICATE_FROM_EMAIL"),
          to: [message.to],
          subject: message.subject,
          html: message.html,
          ...(message.attachment ? { attachments: [message.attachment] } : {}),
        }),
      });
      if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
      const body = await response.json() as { id?: unknown };
      if (typeof body.id !== "string" || !body.id.trim()) {
        throw new Error("Email provider did not confirm delivery");
      }
      return { providerId: body.id };
    },
  };
}

function smtpAdapter(
  environment: NodeJS.ProcessEnv,
  dependencies: CertificateEmailProviderDependencies,
): EmailDeliveryAdapter {
  if (environment.NODE_ENV === "production") {
    throw new ServiceUnavailableException(
      "SMTP certificate email provider is unavailable in production",
    );
  }

  const host = requiredEnvironment(environment, "SMTP_HOST");
  const port = smtpPort(environment);
  const secure = smtpSecure(environment);
  const user = requiredEnvironment(environment, "SMTP_USER");
  const appPassword = requiredEnvironment(environment, "SMTP_APP_PASSWORD");
  const from = requiredEnvironment(environment, "INTERNSHIP_CERTIFICATE_FROM_EMAIL");
  const transport = dependencies.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: appPassword },
  });

  return {
    async send(message) {
      let result: SmtpDeliveryResult;
      try {
        result = await transport.sendMail({
          from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          headers: { "X-Growblic-Idempotency-Key": message.idempotencyKey },
          ...(message.attachment
            ? {
                attachments: [{
                  filename: message.attachment.filename,
                  content: Buffer.from(message.attachment.content, "base64"),
                }],
              }
            : {}),
        });
      } catch (error) {
        const details =
          error && typeof error === "object"
            ? {
                name: "name" in error ? String(error.name) : undefined,
                code: "code" in error ? String(error.code) : undefined,
                command: "command" in error ? String(error.command) : undefined,
                responseCode:
                  "responseCode" in error ? String(error.responseCode) : undefined,
              }
            : {};

        console.error("SMTP delivery failed", details);
        throw new Error("SMTP email delivery failed");
      }

      const providerId =
        typeof result.messageId === "string" ? result.messageId.trim() : "";
      const accepted = result.accepted?.some(
        (value) =>
          acceptedAddress(value)?.toLowerCase() === message.to.trim().toLowerCase(),
      );
      if (!providerId || !accepted) {
        throw new Error("SMTP provider did not confirm accepted recipient");
      }
      return { providerId };
    },
  };
}

export function createCertificateEmailAdapter(
  environment: NodeJS.ProcessEnv = process.env,
  dependencies: CertificateEmailProviderDependencies = defaultDependencies,
): EmailDeliveryAdapter {
  const provider =
    environment.INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER?.trim().toLowerCase() ||
    "resend";
  if (provider === "resend") return resendAdapter(environment, dependencies);
  if (provider === "smtp") return smtpAdapter(environment, dependencies);
  throw new ServiceUnavailableException(
    "Invalid server configuration: INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER",
  );
}

@Injectable()
export class InternshipCertificateEmailProvider {
  async send(message: CertificateEmail) {
    return createCertificateEmailAdapter().send(message);
  }
}
