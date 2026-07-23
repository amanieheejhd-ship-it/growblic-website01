import { Controller, Get, Header, Inject, Res } from "@nestjs/common";
import type { Response } from "express";

import { RequestContextService } from "@growblic/nest-common";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(
    @Inject(HealthService) private readonly health: HealthService,
    @Inject(RequestContextService) private readonly context: RequestContextService,
  ) {}

  @Get("live")
  @Header("Cache-Control", "no-store, max-age=0")
  live() {
    return this.response("ok");
  }

  @Get("ready")
  @Header("Cache-Control", "no-store, max-age=0")
  async ready(@Res({ passthrough: true }) response: Response) {
    const ready = await this.health.isReady();
    if (!ready) response.status(503);
    return {
      ...this.response(ready ? "ok" : "unavailable"),
      dependencies: { database: ready ? "ready" : "unavailable" },
    };
  }

  private response(status: "ok" | "unavailable") {
    return {
      status,
      service: "growblic-submissions-service",
      timestamp: new Date().toISOString(),
      requestId: this.context.getRequestId(),
    };
  }
}
