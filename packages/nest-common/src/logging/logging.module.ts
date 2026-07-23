import { DynamicModule, Global, Module } from "@nestjs/common";

import type { BackendConfig } from "../config/backend-config";
import { StructuredLogger } from "./structured-logger.service";

@Global()
@Module({})
export class LoggingModule {
  static register(config: BackendConfig): DynamicModule {
    return {
      module: LoggingModule,
      providers: [{ provide: StructuredLogger, useValue: new StructuredLogger(config) }],
      exports: [StructuredLogger],
    };
  }
}
