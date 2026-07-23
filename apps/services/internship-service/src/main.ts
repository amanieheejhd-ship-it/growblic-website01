import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import {
  configureBackendApplication,
  configureHttpServer,
  installGracefulShutdown,
  loadBackendConfig,
  StructuredLogger,
} from "@growblic/nest-common";

async function bootstrap() {
  const config = loadBackendConfig(process.env, { defaultPort: "4000" });
  const app = await NestFactory.create(AppModule.register(config), {
    bodyParser: false,
    bufferLogs: true,
    logger: config.nestLogLevels,
  });
  const logger = app.get(StructuredLogger);
  app.useLogger(logger);
  configureBackendApplication(app, config, {
    rawBodyRoutes: ["/internship-payments/webhooks/razorpay"],
  });
  await app.listen(config.port, config.host);
  logger.info(
    { url: `http://${config.host}:${config.port}` },
    "internship-service listening",
  );
  configureHttpServer(app, config);
  installGracefulShutdown(app, config, logger);
}

void bootstrap();
