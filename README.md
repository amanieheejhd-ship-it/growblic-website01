# Growblic workspace

The public Growblic Next.js application lives in `apps/web`; the private administration application lives independently in `apps/admin`. Prisma schema and migrations remain at the repository root until Phase 2D.

## Development

```bash
pnpm dev
```

Build from the repository root with:

```bash
pnpm build
```

Root commands orchestrate both application workspaces. Runtime dependencies intentionally remain duplicated in the root and application manifests during this structural checkpoint; dependency ownership will be tightened after the database boundary is stable.

Use `pnpm dev:web` or `pnpm dev:admin` to run one application. Root `pnpm dev`, `pnpm build`, `pnpm typecheck`, and `pnpm lint` orchestrate both workspaces through Turbo.

For local development, the web app can use ignored links to the ignored root `.env` files. Do not stage those links or copy secrets into tracked files. Deployment platforms must inject environment variables directly.

The local rollback checkpoint before Phase 2C is `8419554`.
