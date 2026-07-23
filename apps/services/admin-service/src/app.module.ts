import { DynamicModule, Module } from "@nestjs/common";
import type { BackendConfig } from "@growblic/nest-common";
import { BackendConfigModule } from "@growblic/nest-common";
import { LoggingModule } from "@growblic/nest-common";
import { RequestContextModule } from "@growblic/nest-common";
import { AdminModule } from "./modules/admin/admin.module";
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
        AdminModule,
        HealthModule,
      ],
    };
  }
}
