import { Inject, Injectable } from "@nestjs/common";

import { BACKEND_CONFIG } from "@growblic/nest-common";
import type { BackendConfig } from "@growblic/nest-common";
import { DATABASE_READINESS_PROBE, type ReadinessProbe } from "./database-readiness.probe";

@Injectable()
export class HealthService {
  constructor(
    @Inject(DATABASE_READINESS_PROBE) private readonly databaseProbe: ReadinessProbe,
    @Inject(BACKEND_CONFIG) private readonly config: BackendConfig,
  ) {}

  async isReady() {
    let timeout: NodeJS.Timeout | undefined;
    try {
      await Promise.race([
        this.databaseProbe.check(),
        new Promise<never>((_resolve, reject) => {
          timeout = setTimeout(() => reject(new Error("Readiness probe timed out.")), this.config.databaseReadinessTimeoutMs);
          timeout.unref();
        }),
      ]);
      return true;
    } catch {
      return false;
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}
