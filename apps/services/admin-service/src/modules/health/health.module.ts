import { Module } from "@nestjs/common";

import { DatabaseReadinessProbe, DATABASE_READINESS_PROBE } from "./database-readiness.probe";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  controllers: [HealthController],
  providers: [
    HealthService,
    DatabaseReadinessProbe,
    { provide: DATABASE_READINESS_PROBE, useExisting: DatabaseReadinessProbe },
  ],
})
export class HealthModule {}
