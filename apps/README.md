# Applications

- `web` hosts the frozen public website and its non-admin API routes for `growblic.com`.
- `admin` hosts the private login, protected shell, and same-origin authentication routes for the future `admin.growblic.com` project.
- The admin cookie remains host-only; the browser never calls the public app for authentication.
- No NestJS application or microservice exists.

Run both applications from the repository root with `pnpm dev` or `pnpm build`; scoped commands such as `pnpm dev:web` and `pnpm dev:admin` are also available.
For local development only, ignored links under either app may point to the ignored root environment files. Deployment environments must inject variables directly. The admin project owns `ADMIN_AUTH_PEPPER`; both server apps consume the server-only `@growblic/database` package and never import each other for database access.

The rollback checkpoint before database-package extraction is `d465f51`.
