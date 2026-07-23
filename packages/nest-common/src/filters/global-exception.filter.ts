import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import type { SafeErrorResponse } from "../errors/error-response";
import type { StructuredLogger } from "../logging/structured-logger.service";
import type { RequestContextService } from "../request-context/request-context.service";

const MESSAGE_PASSTHROUGH_STATUSES = new Set([400, 401, 403, 409, 422, 429]);

const SAFE_ERRORS: Record<number, { code: string; message: string }> = {
  400: { code: "BAD_REQUEST", message: "The request is invalid." },
  401: { code: "UNAUTHORIZED", message: "Authentication is required." },
  403: { code: "FORBIDDEN", message: "Access is forbidden." },
  404: { code: "NOT_FOUND", message: "The requested resource was not found." },
  405: { code: "METHOD_NOT_ALLOWED", message: "The request method is not allowed." },
  409: { code: "CONFLICT", message: "The request conflicts with the current state." },
  413: { code: "PAYLOAD_TOO_LARGE", message: "The request body is too large." },
  429: { code: "TOO_MANY_REQUESTS", message: "Too many requests." },
  503: { code: "SERVICE_UNAVAILABLE", message: "The service is temporarily unavailable." },
};

function numericStatus(exception: unknown) {
  if (exception && typeof exception === "object") {
    const candidate = exception as { getStatus?: unknown; status?: unknown; statusCode?: unknown };
    if (typeof candidate.getStatus === "function") {
      const value = candidate.getStatus();
      if (typeof value === "number") return value;
    }
    if (typeof candidate.status === "number") return candidate.status;
    if (typeof candidate.statusCode === "number") return candidate.statusCode;
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

function exceptionMessage(exception: unknown) {
  if (!exception || typeof exception !== "object") return "";
  const candidate = exception as { response?: unknown; message?: unknown; getResponse?: unknown };
  const response =
    typeof candidate.getResponse === "function"
      ? candidate.getResponse()
      : candidate.response;
  if (typeof response === "string") return response;
  if (response && typeof response === "object") {
    const message = (response as { message?: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) {
      return message.filter((item): item is string => typeof item === "string").join(" ");
    }
  }
  return typeof candidate.message === "string" ? candidate.message : "";
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly context: RequestContextService,
    private readonly logger: StructuredLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const candidateStatus = numericStatus(exception);
    const status = candidateStatus >= 400 && candidateStatus < 600
      ? candidateStatus
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const defaultError = SAFE_ERRORS[status] ?? (status < 500
      ? { code: `HTTP_${status}`, message: "The request could not be completed." }
      : { code: "INTERNAL_ERROR", message: "An unexpected error occurred." });
    // Pass explicit exception messages through only for statuses that our
    // application code raises with intentional, user-facing messages. Framework
    // generated errors (unknown route 404s, body-parser 413s, ...) leak request
    // details, so they always fall back to the safe default message.
    const explicitMessage = MESSAGE_PASSTHROUGH_STATUSES.has(status)
      ? exceptionMessage(exception).trim()
      : "";
    const safeError = {
      ...defaultError,
      message: explicitMessage || defaultError.message,
    };
    const requestId = this.context.getRequestId();
    const exceptionName = exception instanceof Error ? exception.name : "UnknownException";

    const logFields = {
      requestId,
      method: request.method,
      path: request.path,
      status,
      errorCode: safeError.code,
      exceptionName,
    };
    if (status >= 500) this.logger.failure(logFields, "request failed");
    else this.logger.warning(logFields, "request failed");

    response.status(status).json({
      statusCode: status,
      error: safeError,
      requestId,
      timestamp: new Date().toISOString(),
    } satisfies SafeErrorResponse);
  }
}
