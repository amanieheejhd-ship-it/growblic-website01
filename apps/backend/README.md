# Growblic backend

`@growblic/backend` is the Phase 2G NestJS modular-monolith foundation. It currently exposes infrastructure health only; no public form, admin, authentication, CMS, or other business API has moved here.

## Local development

Copy the variable names from `.env.example` into an ignored local environment file or inject them through the shell. Real database URLs and other secrets must never be committed or logged.

From the repository root:

```bash
pnpm dev:backend
```

The safe local default listens on `127.0.0.1:4000`. The process fails fast on malformed configuration. Production requires every backend configuration value explicitly and should receive `DATABASE_URL` from its secret store.

## Health endpoints

- `GET /health/live` confirms the process is alive and never touches PostgreSQL.
- `GET /health/ready` performs a bounded, read-only `SELECT 1` through `@growblic/database`. It returns `503` with no connection detail when PostgreSQL is unavailable.

Both responses are non-cacheable and contain only status, service, timestamp, request ID, and the readiness dependency state where applicable.

## Security and operations

The foundation uses an explicit CORS allowlist, Helmet, bounded JSON/URL-encoded bodies, a bounded HTTP request timeout, structured redacted JSON logs, safe request IDs, generic exception responses, and bounded graceful shutdown. It does not log request/response bodies or environment values.

The rollback checkpoint is `7eaf92f`. The next separately approved phase is Phase 2G-C: migrate the contact submission endpoint behind the existing Next.js adapter.
