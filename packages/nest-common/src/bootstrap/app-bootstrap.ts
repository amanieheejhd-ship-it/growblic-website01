import type { INestApplication } from "@nestjs/common";
import { json, urlencoded, type Request } from "express";
import helmet from "helmet";

import type { BackendConfig } from "../config/backend-config";
import { GlobalExceptionFilter } from "../filters/global-exception.filter";
import { createRequestLoggingMiddleware } from "../logging/request-logging.middleware";
import { StructuredLogger } from "../logging/structured-logger.service";
import { createRequestContextMiddleware } from "../request-context/request-context.middleware";
import { RequestContextService } from "../request-context/request-context.service";

const LOCAL_CORS_ORIGINS = new Set([
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
]);

export type ConfigureBackendApplicationOptions = {
  /**
   * Exact request paths whose raw JSON body must be captured on
   * `request.rawBody` (e.g. signature-verified payment webhooks).
   */
  rawBodyRoutes?: readonly string[];
};

export function isAllowedCorsOrigin(config: BackendConfig, origin: string | undefined) {
  if (!origin) return true;
  if (config.environment === "production") {
    return config.corsAllowedOrigins.includes(origin) && !LOCAL_CORS_ORIGINS.has(origin);
  }
  if (config.corsAllowedOrigins.includes(origin)) return true;
  return LOCAL_CORS_ORIGINS.has(origin);
}

export function configureBackendApplication(
  app: INestApplication,
  config: BackendConfig,
  options: ConfigureBackendApplicationOptions = {},
) {
  const context = app.get(RequestContextService);
  const logger = app.get(StructuredLogger);
  const rawBodyRoutes = new Set(options.rawBodyRoutes ?? []);

  if (config.corsAllowedOrigins.length > 0 || config.environment !== "production") {
    app.enableCors({
      credentials: true,
      origin: (
        origin: string | undefined,
        callback: (error: Error | null, allow?: boolean) => void,
      ) => callback(null, isAllowedCorsOrigin(config, origin)),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "x-payment-access-token",
        "x-razorpay-signature",
        "x-razorpay-event-id",
        "x-request-id",
        "x-internship-certificate-internal-token",
      ],
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
      if (rawBodyRoutes.has(request.originalUrl)) {
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
