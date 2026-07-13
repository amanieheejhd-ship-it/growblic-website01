# Applications

- `web` contains the existing Next.js application, moved intact from the repository root in Phase 2B.
- Public pages, private admin pages, and API routes remain together in `web` temporarily.
- Private-admin extraction into `apps/admin` is deferred to Phase 2C.
- No NestJS application or microservice exists.

Run the application from the repository root with `pnpm dev` or `pnpm build`.
For local development only, ignored links under `apps/web` may point to the ignored root environment files. Deployment environments must inject variables directly.

The rollback checkpoint before the structural move is `b80f525`.
