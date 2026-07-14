import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import {
  configureBackendApplication,
  configureHttpServer,
  installGracefulShutdown,
} from "./bootstrap";
import { loadBackendConfig } from "./common/config/backend-config";
import { StructuredLogger } from "./common/logging/structured-logger.service";

async function bootstrap() {
  const config = loadBackendConfig();
  const app = await NestFactory.create(AppModule.register(config), {
    bodyParser: false,
    bufferLogs: true,
    logger: config.nestLogLevels,
  });
  const logger = app.get(StructuredLogger);
  app.useLogger(logger);
  configureBackendApplication(app, config);
  await app.listen(config.port, config.host);
  configureHttpServer(app, config);
  installGracefulShutdown(app, config, logger);
}

void bootstrap();
