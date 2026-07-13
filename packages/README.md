# Shared packages

- `database` is the sole server-only owner of the Prisma schema, migration history, generated client, PostgreSQL adapter, and runtime singleton.
- Server code in `apps/web` and `apps/admin` imports `@growblic/database`; root Node tooling uses the explicit `@growblic/database/client` server-tooling entry point.
- Generated Prisma output stays under `packages/database/src/generated/prisma` and is ignored by Git.
- `DATABASE_URL` is runtime-only. `DIRECT_URL` is read only by controlled Prisma migration tooling.
- Prisma migrations are never run by application builds or postinstall.

- `contracts` contains browser-safe, framework-neutral API request and response types. It contains no runtime, database, framework, or secret access.
- `validation` contains pure normalization and validation used by the existing web and admin server boundaries. Request-size enforcement, honeypots, persistence, cookies, hashing, rate limits, and audit work remain in their owning applications.
- Shared configuration, logging, and security packages will be added only when they have real consumers.
- No microservice exists yet.
