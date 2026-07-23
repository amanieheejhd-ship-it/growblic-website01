# NX Microservices Architecture

Status: migration completed on 2026-07-19 (replaces the Turborepo modular-monolith
layout described in `MONOREPO_MIGRATION_PLAN.md` / `NESTJS_BACKEND_MIGRATION_PLAN.md`,
which are kept for history). Database is plain PostgreSQL; the old Supabase
scaffold was removed.

## Workspace layout

```
apps/
  web/                        Next.js public website (port 3002) — no DB access
  admin/                      Next.js admin UI (port 3001) — no DB access, thin proxy to admin-service
  services/
    internship-service/       NestJS: internship-payments, internship-portal, internal certificates (port 4000)
    submissions-service/      NestJS: public form submissions (port 4001)
    admin-service/            NestJS: admin auth + admin APIs (port 4002)
    notification-worker/      NestJS: certificate email/reminder jobs (port 4003, health only)
packages/
  database/                   Prisma 7 schema + client (single shared PostgreSQL)
  contracts/                  browser-safe shared types (buildable, dist/)
  validation/                 pure validators (buildable, dist/)
  nest-common/                config loader, pino logging, request-context, exception filter
  internship-shared/          payment core, PDF generators (invoice/confirmation/certificate,
                              base64-embedded signature font), certificate email adapter
  eslint-config/              shared flat configs + NX module-boundary rules
  typescript-config/          shared tsconfig bases
infra/
  services.Dockerfile         parameterized multi-stage build for any service
  gateway/nginx.conf          single-origin gateway (path-based routing, port 8080)
docker-compose.yml            postgres + 4 services + gateway
```

## Tooling

- **NX 23** replaces Turborepo. `pnpm build|typecheck|test|lint` run `nx run-many`;
  `pnpm affected` runs `nx affected`. Caching is on; typecheck/test depend on `^build`
  because shared packages are consumed from their compiled `dist/`.
- **Module boundaries** are enforced by `@nx/enforce-module-boundaries` (see
  `packages/eslint-config/base.mjs`) using tags in each package.json:
  `scope:frontend` (web, admin) may only depend on `scope:shared` + `scope:tooling` —
  frontends can never import `@growblic/database` again; `scope:service` may use
  `scope:shared`, `scope:service-lib`, `scope:data`.
- Tests are `node:test` (no jest): services compile via `tsconfig.test.json` then run
  `node --test`; pure packages run `tsx --test`.

## Service boundaries & communication

- Frontends talk to services over HTTP only.
  - web: `NEXT_PUBLIC_API_URL` → internship-service (portal, payments, AI chat);
    `NEXT_PUBLIC_SUBMISSIONS_API_URL` → submissions-service (falls back to
    `NEXT_PUBLIC_API_URL` for single-origin gateway deployments).
  - admin: server-side only, `BACKEND_INTERNAL_URL` → admin-service (default
    http://localhost:4002). The host-only session cookie stays on the admin app;
    the opaque token is forwarded as `x-admin-session-token`.
- admin-service → internship-service: certificate preview/offer-letter PDFs proxied via
  `INTERNSHIP_SERVICE_INTERNAL_URL` + `x-internship-certificate-internal-token`
  (the `/internal/*` API — blocked at the public gateway).
- notification-worker runs the certificate jobs scheduler (enabled by default in the
  worker; interval/test-mode env semantics unchanged).
- All services share one PostgreSQL via `@growblic/database` with convention-based
  table ownership. A database-per-service split is deliberately deferred: payment
  settlement uses cross-table Serializable transactions that would need an
  event/saga redesign first.

## Razorpay webhook

`POST /internship-payments/webhooks/razorpay` stays on port 4000 (internship-service)
with raw-body HMAC verification — the webhook URL configured in Razorpay is unchanged.

## Ops

- Migrations: `pnpm prisma:migrate:deploy` (uses `DIRECT_URL`); never run in
  builds/containers.
- Docker: `docker compose up --build` (postgres + services + nginx gateway on 8080).
  Note: the Docker/compose files are provided as a starting point and were not
  built/run as part of the migration — verify locally before relying on them.
- CI: `.github/workflows/ci.yml` runs `nx affected -t build typecheck test lint` on
  pushes/PRs. `deploy.yml` (manual) still publishes the static web export to GitHub
  Pages, gated on web + submissions-service typecheck and the submissions test suite.
- Recovery point: git tag `pre-nx-migration-backup` holds the full pre-migration
  working-tree state.

## Known follow-ups

- Web/admin UI code has pre-existing eslint errors (react-hooks rules) unrelated to
  the migration — services and packages lint clean.
- `GrowblicAIChat` posts to `/ai/chat`, which no service implements yet — decide to
  build an AI module (internship-service or a new service) or remove the widget.
- When scale demands, move notification-worker from in-process intervals to a real
  queue (BullMQ/Redis) and start Phase 6 (per-service data ownership).
