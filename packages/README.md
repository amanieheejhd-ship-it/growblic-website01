# Shared packages

- `database` is the sole server-only owner of the Prisma schema, migration history, generated client, PostgreSQL adapter, and runtime singleton.
- Server code in `apps/web` and `apps/admin` imports `@growblic/database`; root Node tooling uses the explicit `@growblic/database/client` server-tooling entry point.
- Generated Prisma output stays under `packages/database/src/generated/prisma` and is ignored by Git.
- `DATABASE_URL` is runtime-only. `DIRECT_URL` is read only by controlled Prisma migration tooling.
- Prisma migrations are never run by application builds or postinstall.

- Shared contracts, validation, configuration, logging, and security packages will be added only when they have real consumers.
- No microservice exists yet.
