# Growblic workspace

The public Growblic Next.js application lives in `apps/web`; the private administration application lives independently in `apps/admin`. Browser-safe API types and pure validation live in `packages/contracts` and `packages/validation`. The server-only `packages/database` workspace package owns the Prisma schema, migrations, generated client, and runtime singleton.

## Development

```bash
pnpm dev
```

Build from the repository root with:

```bash
pnpm build
```

Root commands orchestrate the application and database workspaces. Both applications consume database access through `@growblic/database`; browser modules must never import that package.

Use `pnpm dev:web` or `pnpm dev:admin` to run one application. Root `pnpm dev`, `pnpm build`, `pnpm typecheck`, and `pnpm lint` orchestrate both workspaces through Turbo.

Prisma commands are available as `pnpm prisma:format`, `pnpm prisma:validate`, `pnpm prisma:generate`, `pnpm prisma:migrate:dev`, `pnpm prisma:migrate:deploy`, and `pnpm prisma:studio`. Migration commands are explicit operator actions and never run during builds or postinstall.

For local development, applications and the database package can use ignored links to the ignored root `.env` files. Do not stage those links or copy secrets into tracked files. Deployment platforms must inject environment variables directly.

The local rollback checkpoint before Phase 2E is `d91e9fc`.
