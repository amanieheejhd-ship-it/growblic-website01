import { LogLevel } from "@nestjs/common";

export type BackendEnvironment = "development" | "test" | "production";

export type BackendConfig = {
  environment: BackendEnvironment;
  host: string;
  port: number;
  logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
  nestLogLevels: LogLevel[];
  corsAllowedOrigins: string[];
  requestBodyLimit: number;
  requestTimeoutMs: number;
  shutdownTimeoutMs: number;
  databaseReadinessTimeoutMs: number;
  trustProxy: boolean;
};

const LOCAL_DEFAULTS = {
  BACKEND_HOST: "127.0.0.1",
  BACKEND_PORT: "4000",
  LOG_LEVEL: "info",
  CORS_ALLOWED_ORIGINS: "",
  REQUEST_BODY_LIMIT: "65536",
  REQUEST_TIMEOUT_MS: "15000",
  SHUTDOWN_TIMEOUT_MS: "10000",
  DATABASE_READINESS_TIMEOUT_MS: "2000",
  TRUST_PROXY: "false",
} as const;

const LOG_LEVELS = new Set([
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
]);

function configurationError(name: string): never {
  throw new Error(`Invalid backend configuration: ${name}.`);
}

function requiredValue(
  environment: BackendEnvironment,
  values: NodeJS.ProcessEnv,
  name: keyof typeof LOCAL_DEFAULTS,
) {
  const configured = values[name]?.trim();
  if (configured) return configured;
  if (environment !== "production") return LOCAL_DEFAULTS[name];
  return configurationError(name);
}

function boundedInteger(value: string, name: string, minimum: number, maximum: number) {
  if (!/^\d+$/.test(value)) return configurationError(name);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    return configurationError(name);
  }
  return parsed;
}

function parseEnvironment(value: string | undefined): BackendEnvironment {
  const normalized = value?.trim() || "development";
  if (normalized === "development" || normalized === "test" || normalized === "production") {
    return normalized;
  }
  return configurationError("NODE_ENV");
}

function parseOrigins(value: string) {
  if (!value) return [];
  const origins = value.split(",").map((origin) => origin.trim());
  if (origins.some((origin) => !/^https?:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(origin))) {
    return configurationError("CORS_ALLOWED_ORIGINS");
  }
  return [...new Set(origins)];
}

function parseBoolean(value: string, name: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  return configurationError(name);
}

function nestLogLevels(level: BackendConfig["logLevel"]): LogLevel[] {
  if (level === "silent") return [];
  if (level === "trace") return ["verbose", "debug", "log", "warn", "error", "fatal"];
  if (level === "debug") return ["debug", "log", "warn", "error", "fatal"];
  if (level === "info") return ["log", "warn", "error", "fatal"];
  if (level === "warn") return ["warn", "error", "fatal"];
  if (level === "error") return ["error", "fatal"];
  return ["fatal"];
}

export function loadBackendConfig(values: NodeJS.ProcessEnv = process.env): BackendConfig {
  const environment = parseEnvironment(values.NODE_ENV);
  const host = requiredValue(environment, values, "BACKEND_HOST");
  if (!/^[a-z0-9.:-]+$/i.test(host) || host.length > 255) configurationError("BACKEND_HOST");

  const logLevelValue = requiredValue(environment, values, "LOG_LEVEL");
  if (!LOG_LEVELS.has(logLevelValue)) configurationError("LOG_LEVEL");
  const logLevel = logLevelValue as BackendConfig["logLevel"];

  return {
    environment,
    host,
    port: boundedInteger(requiredValue(environment, values, "BACKEND_PORT"), "BACKEND_PORT", 1, 65_535),
    logLevel,
    nestLogLevels: nestLogLevels(logLevel),
    corsAllowedOrigins: parseOrigins(requiredValue(environment, values, "CORS_ALLOWED_ORIGINS")),
    requestBodyLimit: boundedInteger(requiredValue(environment, values, "REQUEST_BODY_LIMIT"), "REQUEST_BODY_LIMIT", 1_024, 1_048_576),
    requestTimeoutMs: boundedInteger(requiredValue(environment, values, "REQUEST_TIMEOUT_MS"), "REQUEST_TIMEOUT_MS", 100, 120_000),
    shutdownTimeoutMs: boundedInteger(requiredValue(environment, values, "SHUTDOWN_TIMEOUT_MS"), "SHUTDOWN_TIMEOUT_MS", 100, 60_000),
    databaseReadinessTimeoutMs: boundedInteger(requiredValue(environment, values, "DATABASE_READINESS_TIMEOUT_MS"), "DATABASE_READINESS_TIMEOUT_MS", 50, 10_000),
    trustProxy: parseBoolean(requiredValue(environment, values, "TRUST_PROXY"), "TRUST_PROXY"),
  };
}
