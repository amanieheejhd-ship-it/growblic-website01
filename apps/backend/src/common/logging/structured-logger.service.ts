import type { LoggerService } from "@nestjs/common";
import pino, { type Logger as PinoInstance } from "pino";

import type { BackendConfig } from "../config/backend-config";
import { pinoConfig } from "./logging.config";

type Fields = Record<string, unknown>;

export class StructuredLogger implements LoggerService {
  private readonly logger: PinoInstance;

  constructor(config: BackendConfig) {
    this.logger = pino(pinoConfig(config));
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.write("info", message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.write("fatal", message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.write("error", message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.write("warn", message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.write("debug", message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.write("trace", message, optionalParams);
  }

  info(fields: Fields, message: string) {
    this.logger.info(fields, message);
  }

  warning(fields: Fields, message: string) {
    this.logger.warn(fields, message);
  }

  failure(fields: Fields, message: string) {
    this.logger.error(fields, message);
  }

  private write(
    level: "fatal" | "error" | "warn" | "info" | "debug" | "trace",
    message: unknown,
    optionalParams: unknown[],
  ) {
    const fields = optionalParams.length > 0 ? { context: optionalParams } : {};
    if (typeof message === "string") this.logger[level](fields, message);
    else this.logger[level]({ ...fields, event: message }, "application log");
  }
}
