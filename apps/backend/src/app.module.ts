import { DynamicModule, Module } from "@nestjs/common";
import type { BackendConfig } from "./common/config/backend-config";
import { BackendConfigModule } from "./common/config/backend-config.module";
import { LoggingModule } from "./common/logging/logging.module";
import { RequestContextModule } from "./common/request-context/request-context.module";
import { HealthModule } from "./modules/health/health.module";

@Module({})
export class AppModule {
  static register(config: BackendConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        BackendConfigModule.register(config),
        RequestContextModule,
        LoggingModule.register(config),
        HealthModule,
      ],
    };
  }
}
