# Shared packages

- `database` is the sole server-only owner of the Prisma schema, migration history, generated client, PostgreSQL adapter, and runtime singleton.
- Server code in `apps/web` and `apps/admin` imports `@growblic/database`; root Node tooling uses the explicit `@growblic/database/client` server-tooling entry point.
- Generated Prisma output stays under `packages/database/src/generated/prisma` and is ignored by Git.
- `DATABASE_URL` is runtime-only. `DIRECT_URL` is read only by controlled Prisma migration tooling.
- Prisma migrations are never run by application builds or postinstall.

- `contracts` contains browser-safe, framework-neutral API request and response types. It contains no runtime, database, framework, or secret access.
- `validation` contains pure normalization and validation used by the existing web and admin server boundaries. Request-size enforcement, honeypots, persistence, cookies, hashing, rate limits, and audit work remain in their owning applications.
- `typescript-config` contains strict Next.js, Node.js, and library presets while consumers retain aliases, includes, and generated paths.
- `eslint-config` contains the existing Next.js/TypeScript rule sets and common artifact ignores without changing rule severity.
- A runtime `config` package is intentionally deferred: environment parsing is currently owner-specific, and centralizing database or authentication variables would add coupling without a second genuine consumer.
- Next.js, PostCSS, Turbopack roots, runtime environment access, logging, and security settings remain local to their owning applications or packages.
- The NestJS foundation consumes database access only through this package; it does not own Prisma schema or migration commands. No microservice exists.
