import type { INestApplication } from "@nestjs/common";
import { json, urlencoded, type Request } from "express";
import helmet from "helmet";

import type { BackendConfig } from "./common/config/backend-config";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { createRequestLoggingMiddleware } from "./common/logging/request-logging.middleware";
import { StructuredLogger } from "./common/logging/structured-logger.service";
import { createRequestContextMiddleware } from "./common/request-context/request-context.middleware";
import { RequestContextService } from "./common/request-context/request-context.service";

export function isAllowedCorsOrigin(config: BackendConfig, origin: string | undefined) {
  if (!origin) return true;
  if (config.corsAllowedOrigins.includes(origin)) return true;
  if (config.environment === "production") return false;

  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
      url.username === "" &&
      url.password === ""
    );
  } catch {
    return false;
  }
}

export function configureBackendApplication(app: INestApplication, config: BackendConfig) {
  const context = app.get(RequestContextService);
  const logger = app.get(StructuredLogger);

  if (config.corsAllowedOrigins.length > 0 || config.environment !== "production") {
    app.enableCors({
      credentials: false,
      origin: (
        origin: string | undefined,
        callback: (error: Error | null, allow?: boolean) => void,
      ) => callback(null, isAllowedCorsOrigin(config, origin)),
      methods: ["GET", "HEAD", "OPTIONS", "POST"],
      allowedHeaders: ["content-type", "x-payment-access-token", "x-razorpay-signature", "x-razorpay-event-id", "x-request-id"],
      exposedHeaders: ["content-disposition"],
    });
  }

  const express = app.getHttpAdapter().getInstance() as {
    set(name: string, value: boolean): void;
  };
  express.set("trust proxy", config.trustProxy);

  app.use(helmet());
  app.use(createRequestContextMiddleware(context));
  app.use(createRequestLoggingMiddleware(logger, context));
  app.use(json({
    limit: config.requestBodyLimit,
    verify: (request: Request & { rawBody?: Buffer }, _response, body) => {
      if (request.originalUrl === "/internship-payments/webhooks/razorpay") {
        request.rawBody = Buffer.from(body);
      }
    },
  }));
  app.use(urlencoded({ extended: false, limit: config.requestBodyLimit }));
  app.useGlobalFilters(new GlobalExceptionFilter(context, logger));
}

export async function closeApplicationWithTimeout(
  app: Pick<INestApplication, "close">,
  timeoutMs: number,
) {
  let timeout: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      app.close(),
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error("Graceful shutdown timed out.")), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function installGracefulShutdown(
  app: INestApplication,
  config: BackendConfig,
  logger: StructuredLogger,
) {
  let shuttingDown = false;
  const shutdown = async (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "graceful shutdown started");
    try {
      await closeApplicationWithTimeout(app, config.shutdownTimeoutMs);
      logger.info({ signal }, "graceful shutdown completed");
    } catch {
      logger.failure({ signal, errorCode: "SHUTDOWN_TIMEOUT" }, "graceful shutdown failed");
      process.exit(1);
    }
  };
  const onSigterm = () => void shutdown("SIGTERM");
  const onSigint = () => void shutdown("SIGINT");
  process.once("SIGTERM", onSigterm);
  process.once("SIGINT", onSigint);
  return () => {
    process.removeListener("SIGTERM", onSigterm);
    process.removeListener("SIGINT", onSigint);
  };
}

export function configureHttpServer(app: INestApplication, config: BackendConfig) {
  const server = app.getHttpServer() as {
    requestTimeout: number;
    headersTimeout: number;
  };
  server.requestTimeout = config.requestTimeoutMs;
  server.headersTimeout = Math.min(config.requestTimeoutMs + 1_000, 120_000);
}
