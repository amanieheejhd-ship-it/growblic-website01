import { DynamicModule, Module } from "@nestjs/common";
import type { BackendConfig } from "@growblic/nest-common";
import { BackendConfigModule } from "@growblic/nest-common";
import { LoggingModule } from "@growblic/nest-common";
import { RequestContextModule } from "@growblic/nest-common";
import { HealthModule } from "./modules/health/health.module";
import { InternshipPaymentsModule } from "./modules/internship-payments/internship-payments.module";
import { InternshipPortalModule } from "./modules/internship-portal/internship-portal.module";

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
        InternshipPaymentsModule,
        InternshipPortalModule,
      ],
    };
  }
}
