import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

import type { RequestContextService } from "./request-context.service";

export const REQUEST_ID_HEADER = "x-request-id";
const SAFE_REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/;

export function safeRequestId(value: string | undefined) {
  return value && SAFE_REQUEST_ID.test(value) ? value : randomUUID();
}

export function createRequestContextMiddleware(context: RequestContextService) {
  return (request: Request, response: Response, next: NextFunction) => {
    const requestId = safeRequestId(request.get(REQUEST_ID_HEADER));
    response.setHeader(REQUEST_ID_HEADER, requestId);
    context.run(requestId, next);
  };
}
