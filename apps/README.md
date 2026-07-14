# Applications

- `web` hosts the frozen public website and its non-admin API routes for `growblic.com`.
- `admin` hosts the private login, protected shell, and same-origin authentication routes for the future `admin.growblic.com` project.
- `backend` is the NestJS modular-monolith foundation. It currently owns health checks only and has no migrated business endpoint.
- The admin cookie remains host-only; the browser never calls the public app for authentication.
- No API-gateway application or microservice exists.

Run the applications from the repository root with `pnpm dev` or `pnpm build`; scoped commands such as `pnpm dev:web`, `pnpm dev:admin`, and `pnpm dev:backend` are also available. Backend environment ownership and health behavior are documented in `apps/backend/README.md`.
For local development only, ignored links under either app may point to the ignored root environment files. Deployment environments must inject variables directly. The admin project owns `ADMIN_AUTH_PEPPER`; both server apps consume the server-only `@growblic/database` package and never import each other for database access.

The rollback checkpoint before database-package extraction is `d465f51`.
The rollback checkpoint before the backend foundation is `7eaf92f`.
