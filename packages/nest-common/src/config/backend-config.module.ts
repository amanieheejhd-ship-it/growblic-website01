import { DynamicModule, Global, Module } from "@nestjs/common";

import type { BackendConfig } from "./backend-config";

export const BACKEND_CONFIG = Symbol("BACKEND_CONFIG");

@Global()
@Module({})
export class BackendConfigModule {
  static register(config: BackendConfig): DynamicModule {
    return {
      module: BackendConfigModule,
      providers: [{ provide: BACKEND_CONFIG, useValue: config }],
      exports: [BACKEND_CONFIG],
    };
  }
}
