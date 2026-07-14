import type { NextFunction, Request, Response } from "express";
import type { RequestContextService } from "../request-context/request-context.service";
import type { StructuredLogger } from "./structured-logger.service";

type RoutedRequest = Request & { route?: { path?: unknown } };

export function createRequestLoggingMiddleware(
  logger: StructuredLogger,
  context: RequestContextService,
) {
  return (request: RoutedRequest, response: Response, next: NextFunction) => {
    const startedAt = process.hrtime.bigint();
    response.once("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      const route = typeof request.route?.path === "string" ? request.route.path : request.path;
      const fields = {
        requestId: context.getRequestId(),
        method: request.method,
        route,
        path: request.path,
        status: response.statusCode,
        durationMs: Number(durationMs.toFixed(3)),
        errorCode: response.statusCode >= 400 ? `HTTP_${response.statusCode}` : "OK",
      };
      if (response.statusCode >= 500) logger.failure(fields, "request completed");
      else if (response.statusCode >= 400) logger.warning(fields, "request completed");
      else logger.info(fields, "request completed");
    });
    next();
  };
}
