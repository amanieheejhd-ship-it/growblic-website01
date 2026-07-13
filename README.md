# Growblic workspace

The existing Growblic Next.js application lives in `apps/web`. Public pages, private admin pages, and API routes remain together there until the private admin application is extracted in Phase 2C. Prisma schema and migrations remain at the repository root until the database-package phase.

## Development

```bash
pnpm dev
```

Build from the repository root with:

```bash
pnpm build
```

Root commands filter the `@growblic/web` workspace. Runtime dependencies intentionally remain duplicated in the root and web manifests during this structural checkpoint; dependency ownership will be tightened after the application boundaries are stable.

For local development, the web app can use ignored links to the ignored root `.env` files. Do not stage those links or copy secrets into tracked files. Deployment platforms must inject environment variables directly.

The local rollback checkpoint before Phase 2B is `b80f525`.
