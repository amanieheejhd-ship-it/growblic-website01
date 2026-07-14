import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import type { SafeErrorResponse } from "../errors/error-response";
import type { StructuredLogger } from "../logging/structured-logger.service";
import type { RequestContextService } from "../request-context/request-context.service";

const SAFE_ERRORS: Record<number, { code: string; message: string }> = {
  400: { code: "BAD_REQUEST", message: "The request is invalid." },
  401: { code: "UNAUTHORIZED", message: "Authentication is required." },
  403: { code: "FORBIDDEN", message: "Access is forbidden." },
  404: { code: "NOT_FOUND", message: "The requested resource was not found." },
  405: { code: "METHOD_NOT_ALLOWED", message: "The request method is not allowed." },
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
    const safeError = SAFE_ERRORS[status] ?? (status < 500
      ? { code: `HTTP_${status}`, message: "The request could not be completed." }
      : { code: "INTERNAL_ERROR", message: "An unexpected error occurred." });
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
