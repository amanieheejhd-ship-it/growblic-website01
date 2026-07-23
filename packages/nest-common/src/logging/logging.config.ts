import type { BackendConfig } from "../config/backend-config";

export function pinoConfig(config: BackendConfig) {
  return {
    level: config.logLevel,
    base: {
      service: "growblic-backend",
      environment: config.environment,
    },
    redact: {
      paths: [
        "authorization",
        "cookie",
        "password",
        "token",
        "hash",
        "databaseUrl",
        "DATABASE_URL",
        "req.headers.authorization",
        "req.headers.cookie",
        "*.authorization",
        "*.cookie",
        "*.password",
        "*.token",
        "*.hash",
        "*.databaseUrl",
        "*.DATABASE_URL",
      ],
      censor: "[REDACTED]",
    },
  };
}
