# Growblic workspace

An NX + pnpm monorepo. The public Next.js website lives in `apps/web` (port 3002) and the private admin UI in `apps/admin` (port 3001) — both are DB-free and talk to the NestJS microservices over HTTP. The services live in `apps/services/`:

| Service | Port | Responsibility |
| --- | --- | --- |
| `internship-service` | 4000 | internship payments (Razorpay), applicant portal, internal certificate PDFs |
| `submissions-service` | 4001 | public website form submissions |
| `admin-service` | 4002 | admin auth + admin dashboard/submission/certificate APIs |
| `notification-worker` | 4003 | certificate email/reminder jobs (health endpoint only) |

Shared packages: `packages/contracts` (browser-safe types), `packages/validation` (pure validators), `packages/nest-common` (service config/logging/filters), `packages/internship-shared` (payment core, PDF generators, certificate email), `packages/database` (Prisma schema + client for PostgreSQL), plus config-only `packages/typescript-config` and `packages/eslint-config`.

See `docs/NX_MICROSERVICES_ARCHITECTURE.md` for the full architecture, service boundaries, and env var matrix.

## Development

```bash
pnpm dev              # all apps + services via nx run-many
pnpm dev:web          # one app: dev:admin, dev:services, ...
pnpm build            # nx run-many -t build (cached)
pnpm typecheck
pnpm test
pnpm lint
pnpm affected         # nx affected -t build,lint,typecheck,test
```

NX module boundaries are lint-enforced: browser code (`scope:frontend`) can never import `@growblic/database`; only services (`scope:service`) touch the database package.

Prisma commands: `pnpm prisma:format`, `pnpm prisma:validate`, `pnpm prisma:generate`, `pnpm prisma:migrate:dev`, `pnpm prisma:migrate:deploy`, `pnpm prisma:studio`. Migration commands are explicit operator actions and never run during builds or postinstall.

Docker: `docker compose up --build` starts PostgreSQL, the four services, and an nginx gateway on `http://localhost:8080` that exposes a single API origin (path-routed).

For local development, apps and services read the ignored `.env` files. Do not stage secrets into tracked files; deployment platforms must inject environment variables directly.

The full pre-migration state is preserved in the git tag `pre-nx-migration-backup`.
