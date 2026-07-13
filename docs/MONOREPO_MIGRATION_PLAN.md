# Growblic Monorepo Migration Plan

Status: Phase 2D complete locally
Audit date: 2026-07-13
Migration implementation: Phase 2A through Phase 2D complete; Phase 2E not started

Checkpoint note: the pre-Phase-2D local rollback commit is `d465f51`. The frozen public website remains under `apps/web`; private admin pages and same-origin auth APIs remain under `apps/admin`; `packages/database` is now the sole server-only owner of Prisma schema, migrations, generation, and runtime access.

## 1. Executive recommendation

The toolchain foundation, public application move, private-admin extraction, and database-package extraction are complete locally. The next structural checkpoint is shared contracts and validation in Phase 2E, but repository ownership and access must still be verified before any local migration commits are pushed or tagged.

The safest first migration is deliberately small:

1. Adopt a pinned Node.js and pnpm toolchain at the repository root.
2. Move the existing public Next.js application intact to `apps/web`.
3. Extract the private admin pages into a separate Next.js application at `apps/admin` with its own root layout.
4. Move Prisma schema, migrations, generated client, and the Prisma singleton into one server-only `packages/database` workspace package.
5. Add contracts, validation, configuration, ESLint, and TypeScript configuration packages only where they have real consumers.
6. Keep the existing public API routes in `apps/web` temporarily, except for admin authentication which should be presented to `apps/admin` through a same-origin admin BFF boundary.
7. Introduce a NestJS API gateway and modular backend only after the two Next.js applications and shared database package are stable.

For Phase 1, use one PostgreSQL database and one PostgreSQL schema through one shared Prisma package. Do not split into service databases or create many microservices yet.

The public frontend is frozen. A file move is acceptable only after route, asset, build, visual, responsive, audio, SEO, browser-console, and network behavior have been compared against the tagged baseline. No parity claim should be made until those checks pass.

## 2. Audit scope and non-actions

This audit inspected Git state, repository structure, application routes, API routes, Prisma schema and migrations, scripts, environment-variable names, build configuration, deployment material, current dependencies, local tool versions, and the bundled Next.js 16 documentation relevant to workspaces.

This audit did not move or edit source files, install or upgrade packages, generate a pnpm lockfile, run a database migration, modify the database, create a NestJS application, clean or stash the worktree, commit, push, deploy, or change DNS. Secret values were not recorded in this document.

## 3. Current Git and worktree state

### 3.1 Branch and history

- Repository root: the current `growblic-website01` checkout.
- Current branch: `main`.
- HEAD before this planning-document commit: `0f1f616` (`feat: add private admin login and protected shell`).
- Tracking branch: `origin/main` at `ae717ef` (`Add back button to internship page`).
- Divergence before this planning-document commit: local `main` is 7 commits ahead and 0 behind `origin/main`. Committing this document will make it 8 commits ahead.
- Staging area before the document review: empty.
- Only `docs/MONOREPO_MIGRATION_PLAN.md` remained uncommitted before this document review.

The seven local commits present before this planning-document commit and not present on `origin/main` are:

1. `2848bf0` — `backup before DB`
2. `805717b` — `contact Prisma`
3. `bb2b3b0` — CMS foundation
4. `dad0fbd` — admin authentication
5. `6eed385` — admin authentication integration test
6. `813d720` — public website-form PostgreSQL persistence
7. `0f1f616` — private admin login and protected shell

### 3.2 Remote ownership

The configured `origin` is a GitHub repository under the account `amanieheejhd-ship-it`. The URL contains no embedded credential, but the local repository does not establish that this account is the intended Growblic-owned account or organization.

Required decision: a Growblic owner must verify in GitHub that the organization/account, repository permissions, branch protections, billing/deployment integrations, and recovery ownership are correct before any push or monorepo migration. Do not infer ownership from local access. If the intended destination differs, create or select the correct Growblic-owned repository and change the remote only as an explicitly approved operation.

### 3.3 Worktree classification and resolved feature work

The mixed feature work identified during the initial audit has been resolved into two separate local commits:

- `813d720` contains website-form persistence, its additive migration, API routes, services, scripts, and public form integrations.
- `0f1f616` contains only the private admin login/protected shell and its anonymous page test.

The planning document is the sole remaining uncommitted file at documentation-review time. A clean worktree is still required after this document is committed and before baseline capture or migration work begins.

Pre-existing cleanup candidates, not part of either feature:

- Tracked zero-byte files named `growblic-website01@0.1.0` and `next`, which look like accidental command remnants and should be reviewed before migration.
- Tracked `*.backup-*` files, including an old workflow backup and source backups. They can preserve obsolete paths and should be inventoried and either deliberately retained outside runtime source or removed in a separate cleanup commit.
- Local ignored/build material such as `.next`, `out`, generated Prisma output, `.npm-cache`, and TypeScript build metadata must never be moved as source.
- `README.md` is generic and references the old root layout; it will need a documentation-only update after the structure is stable.

### 3.4 Commit and push recommendation

The website-form and private-admin work are already committed separately. Next, verify remote ownership and access. After that verification, review and push the eight local commits including this document, establish a clean working tree, build and test the baseline, and create an annotated pre-migration tag. Any approved repository-hygiene cleanup must remain a separate commit. Do not combine cleanup or product changes with structural moves: doing so makes review and rollback ambiguous.

## 4. Current architecture summary

The repository is one Next.js 16.2.9 App Router application. Public pages, private admin pages, API route handlers, Prisma access, authentication services, form services, scripts, generated Prisma code, styles, public assets, and deployment configuration all live under one root package.

Important root assumptions:

- `next.config.ts` enables `trailingSlash` and unoptimized images. These settings are part of public behavior and must be preserved in `apps/web`.
- `tsconfig.json` maps `@/*` to `./src/*`; 62 TypeScript/TSX files currently depend on this root-local alias.
- `packages/database/prisma.config.ts` owns package-local schema and migration paths.
- Prisma generates to ignored `packages/database/src/generated/prisma`.
- Apps consume `@growblic/database`; root database scripts use its explicit client entry point.
- Root `postinstall` delegates generation to the database workspace and never runs migrations.
- `public` contains 168 files totaling approximately 13 MB.
- The current Vercel documentation assumes project Root Directory `.` and npm install/build commands.
- The manual GitHub Pages workflow uses npm and uploads `out`. It is an obsolete deployment path for a server-backed application, even though its trigger is currently manual.

No active repository text reference to the absolute local checkout path was found. Root-relative assumptions are nevertheless extensive and will break when files move.

## 5. Existing application inventory

### 5.1 Public page routes

Root and company/service routes:

`/`, `/about`, `/ai-automation`, `/analytics`, `/brand`, `/client-login`, `/contact`, `/crm-platform`, `/custom-software`, `/datacenter`, `/developer`, `/downloads`, `/fastoldp`, `/fintech-app`, `/gmb-rating-reviews`, `/google-ads-management`, `/hr-system`, `/legal`, `/login`, `/meetup`, `/meta-ads-management`, `/mobile-apps`, `/portfolio`, `/price-calculator`, `/saas`, `/saas-products`, `/security`, `/seo-services`, `/services`, `/software`, `/start-project`, `/support`, `/website-development`, `/why-growblic`.

Careers and internships:

`/careers`, `/careers/apply`, `/careers/culture`, `/careers/humans`, `/careers/insights`, `/careers/openings`, `/careers/perks`, `/careers/values`, `/internships`, `/internships/[slug]`.

Process, products, and blog:

`/process`, `/process/build`, `/process/design`, `/process/improve`, `/process/launch`, `/process/understand`, `/products`, `/products/[slug]`, `/blog`, `/blog/admin-panels-operations`, `/blog/ai-automation-saves-time`, `/blog/business-dashboard-features`, `/blog/custom-software`, `/blog/mobile-apps-customer-experience`, `/blog/scalable-business-website`.

Application showcase routes:

`/apps/bill-vault`, `/apps/chess-offline`, `/apps/classta`, `/apps/classta-admin`, `/apps/classta-mentor`, `/apps/colorcraft-asmr`, `/apps/dexa-sheet`, `/apps/docura`, `/apps/event-sync`, `/apps/eventsync-organizer`, `/apps/fresh-fade`, `/apps/fresh-fade-business`, `/apps/fresh-fade-in`, `/apps/fresh-fold`, `/apps/fresh-fold-vendor`, `/apps/growblic-captain`, `/apps/growblic-earn-money-online`, `/apps/gst-billing-management`, `/apps/ins-petro`, `/apps/jeev-setu`, `/apps/kheti-hub`, `/apps/kumbha`, `/apps/lockvault`, `/apps/myniq`, `/apps/myniq-admin`, `/apps/nil`, `/apps/pairup-meet`, `/apps/payroll-hr`, `/apps/pivotos-minimalist-launcher`, `/apps/presenta`, `/apps/project-pipeline`, `/apps/property-dost`, `/apps/qmail`, `/apps/socioconnect`, `/apps/sociva`, `/apps/tapmystic`, `/apps/true-auth`.

The route list above is the baseline manifest. Dynamic route output and any generated metadata routes must also be captured from a production build before moving files.

### 5.2 Private admin routes

- `/admin`
- `/admin/login`

These routes are committed and remain part of the same Next.js application as the public site.

### 5.3 API routes

Committed routes:

- `/api/admin/auth/login`
- `/api/admin/auth/logout`
- `/api/admin/auth/session`
- `/api/contact`
- `/api/health`

Uncommitted website-form routes:

- `/api/careers/applications`
- `/api/internships/applications`
- `/api/meeting-requests`
- `/api/quote-requests`

### 5.4 Global layout and coupling

The public root layout imports the public global stylesheet and mounts global experiences including smooth scrolling, opening splash, scroll sound, and the Growblic AI chat. The current nested admin layout can visually cover public content, but it does not establish a separate document root: public global CSS and root-level effects still mount for admin URLs.

The admin pages do not directly mount the public Navbar or Footer, but they remain coupled to:

- the public root layout and document metadata context;
- public global CSS;
- opening splash and sound behavior;
- smooth-scroll behavior;
- public AI chat behavior;
- the same process, route namespace, API handlers, tsconfig alias, and dependency set.

This is the strongest reason to extract admin into a separate Next.js app rather than attempt route groups inside the existing app.

## 6. Database and domain inventory

### 6.1 Current Prisma models by domain

| Domain | Models |
| --- | --- |
| Leads/contact | `ContactEnquiry`, `MeetingRequest`, `QuoteRequest` |
| Auth | `AdminUser`, `AdminRole`, `AdminUserRole`, `AdminSession`, `AdminLoginAttempt` |
| Content/CMS | `Service`, `Product`, `PortfolioProject`, `Testimonial` |
| Careers | `JobOpening`, `JobApplication`, `CareerApplication` |
| Internships | `InternshipApplication` |
| Media | `MediaAsset` |
| Audit | `AuditLog` |
| Settings | `SiteSetting` |

The schema also defines status/value enums for enquiries, administrators, content, employment, job openings/applications, and settings.

### 6.2 Migration inventory

1. `20260713071341_init_contact_enquiries`
2. `20260713075042_add_cms_foundation`
3. `20260713080643_add_admin_auth_foundation`
4. `20260713092530_add_website_form_submissions`
5. `migration_lock.toml`

The website-form migration has been reviewed and committed with its final schema and verification tooling. Before creating a migration baseline tag, confirm migration status and the read-only database verification results in the baseline environment. The monorepo move must not rewrite historical migration SQL.

### 6.3 Phase 1 database recommendation

Use Option A: one shared Prisma package and the existing single PostgreSQL schema.

Reasons:

- Current entities have cross-domain relationships involving administrators, media, audit, content, jobs, and applications.
- There is not yet a running modular backend with established data ownership boundaries.
- One migration owner avoids concurrent schema histories and deployment ordering problems.
- Splitting schemas or databases now would create distributed transaction, replication, migration, connection-pool, and operational burdens without independent services to justify them.
- Supabase connection limits and pooling behavior are easier to control with one explicit database package and a small number of server deployments.

`packages/database` should be server-only, own the Prisma schema/migrations/generator and client lifecycle, export a narrow server API, and be the only workspace allowed to run migration commands. It must never be imported by browser code.

Reconsider Option B (PostgreSQL schemas per service) only after Nest modules have stable ownership, release boundaries, and migration responsibility. Use Option C (database per microservice) only when services truly deploy and scale independently and the team is prepared to operate cross-service consistency and events.

## 7. Runtime environment ownership

Only variable names are listed. Secret values must stay in local/deployment secret stores.

Observed names:

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_AUTH_PEPPER`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_NAME`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `ADMIN_AUTH_BASE_URL`
- `ADMIN_AUTH_TEST_EMAIL`
- `ADMIN_AUTH_TEST_PASSWORD`
- `CONTACT_API_BASE_URL`
- `WEBSITE_FORMS_BASE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GROWBLIC_API_URL`
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
- `NODE_ENV`

Recommended ownership:

| Owner | Variables and rules |
| --- | --- |
| `apps/web` browser | Only deliberately public values: a stable public API origin if required and `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` while that integration remains. Never database credentials or auth pepper. Prefer same-origin `/api` calls to avoid exposing configurable origins. |
| `apps/web` server, Phase 1 | `DATABASE_URL` only while legacy form/contact handlers still query through `packages/database`. Remove when APIs move to backend. Test base URLs are local/CI only. |
| `apps/admin` browser | No secret variables. Prefer same-origin admin BFF calls. A public API origin is acceptable only if its value is non-secret and CORS/CSRF design is explicit. |
| `apps/admin` server | Internal auth/backend base URL if required. It may temporarily call server-only shared auth/database code, but browser modules must never cross that boundary. |
| `apps/api-gateway` / modular backend | `ADMIN_AUTH_PEPPER` and, while it owns direct persistence, `DATABASE_URL`. Other services receive only the secrets they own. |
| `packages/database` | Reads `DATABASE_URL` at runtime and `DIRECT_URL` only in controlled migration tooling. The package declares requirements but does not contain environment files. |
| Root tooling | `DIRECT_URL` for approved migrations; local integration-test base URLs; test credentials only for a single test process. Root scripts should not load secrets into client builds. |
| Operator-only bootstrap | `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_NAME`, and `ADMIN_BOOTSTRAP_PASSWORD` are ephemeral inputs to an explicit bootstrap action, never persistent production deployment variables. |

Maintain app-specific `.env.example` files containing names and safe descriptions only. Keep `.env*` ignored except examples. CI/deployment secrets should be scoped to the one job/project that needs them.

## 8. Package and tooling audit

### 8.1 Current tools

- Local Node.js: `v24.16.0`.
- Existing GitHub workflow Node.js: 22.
- Local npm: `11.13.0`.
- Local Corepack: `0.35.0`.
- pnpm: not installed on the audited PATH.
- Current lockfile: npm `package-lock.json`, lockfile version 3.
- No `.nvmrc`, `.node-version`, or project `.npmrc` was found.
- `package.json` does not currently pin a package manager.

As of this audit, pnpm 11 is the stable documented line and supports Node.js 22 and 24. The official documentation states that a workspace requires a root `pnpm-workspace.yaml`, that `pnpm import` supports `package-lock.json`, and that workspace packages must be declared before importing workspace dependencies. It also advises updating Corepack before enabling pnpm because of signature issues. References: [pnpm workspace documentation](https://pnpm.io/workspaces), [pnpm import](https://pnpm.io/cli/import), and [pnpm installation/compatibility](https://pnpm.io/installation).

At migration time, pin an exact supported Node 22 release across local development, CI, and deployments, and pin an exact pnpm 11 release using the root `packageManager` field. Recheck the official compatibility table on the migration date; do not use an unpinned `latest` in CI.

### 8.2 Dependency ownership

| Owner | Current dependencies / concern |
| --- | --- |
| `apps/web` | Next.js, React, React DOM, Tailwind/PostCSS, Framer Motion, Lenis, Lucide, Embla, `react-globe.gl`, Three.js, TopoJSON, and public-site-specific UI libraries. |
| `apps/admin` | Next.js, React, React DOM, and only the admin UI dependencies actually imported after extraction. Do not inherit public animation/3D/carousel dependencies by default. |
| `packages/database` | Prisma client, Prisma CLI/generator as appropriate, `@prisma/adapter-pg`, `pg`, and server-only connection lifecycle code. |
| Auth/backend | `argon2` and authentication services. `argon2` is native and must be tested on every CI/deployment architecture and runtime image. |
| Root development | Turborepo, TypeScript, shared lint/config tooling, and workspace orchestration only. Root should not become a catch-all runtime package. |
| Shared packages | Contracts and validation packages should contain framework-neutral schemas/types. Config, logging, and security packages should have explicit server/client entry points or remain server-only. |

Today all dependencies are accidentally available from one root package. pnpm's stricter dependency visibility will reveal undeclared imports; every app/package must explicitly declare what it imports.

### 8.3 npm-to-pnpm conversion

Use a controlled checkpoint:

1. Start from a clean, tagged, passing npm baseline.
2. Pin Node and pnpm versions.
3. Create the root workspace manifest and minimal workspace package manifests.
4. Run `pnpm import` from the existing `package-lock.json` only after workspace packages are declared.
5. Run a frozen pnpm install, inspect peer/native build output, generate Prisma, build, and execute all targeted tests.
6. Keep `package-lock.json` during review. Remove it only in a separate, reviewed lockfile-conversion commit after pnpm reproducibility passes locally and in CI.
7. Never hand-edit `pnpm-lock.yaml`.

Potential pnpm blockers include undeclared transitive imports, native `argon2` builds, Prisma generation/postinstall ordering, multiple React copies, and package lifecycle-script approval policies.

### 8.4 Next.js workspace risks

The bundled Next.js 16.2.9 documentation confirms that `transpilePackages` can bundle local monorepo packages. Add only source packages that require compilation, such as contracts/validation/UI source packages; do not add it blindly for the generated Prisma package. If standalone output is later enabled, set and test `outputFileTracingRoot` because tracing otherwise starts at each Next.js app directory.

Other risks:

- Turbopack root detection and files outside the app directory.
- app-local `@/*` aliases after the root move.
- ESLint's Next.js `rootDir` when multiple Next apps exist.
- server-only code entering client bundles through shared barrel exports.
- duplicated React versions across web/admin/shared UI packages.
- static asset paths changing when `public` moves.

## 9. Recommended target structure

### 9.1 Phase 1: immediate safe structure

```text
apps/
  web/
    src/
    public/
    next.config.ts
    package.json
    tsconfig.json
  admin/
    src/
    next.config.ts
    package.json
    tsconfig.json
packages/
  database/
    prisma/
    src/
    package.json
  contracts/
  validation/
  config/
  eslint-config/
  typescript-config/
docs/
scripts/
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
turbo.json
```

Do not create empty abstraction packages merely to match the diagram. Create each package when its API and first consumer are defined. Keep public-site-only components inside `apps/web`; shared UI should be introduced later and only for genuinely shared, visually stable primitives.

### 9.2 Phase 2: backend introduction

```text
apps/
  web/
  admin/
  api-gateway/
  backend/
packages/
  database/
  contracts/
  validation/
  config/
  logging/
  security/
  eslint-config/
  typescript-config/
```

`apps/backend` should begin as a modular NestJS monolith with auth, leads, careers, internships, content, media, audit, and settings modules. The gateway is the stable external edge; it should not force every internal module to become a network service.

### 9.3 Phase 3: justified service extraction

Possible later applications:

```text
apps/
  lead-service/
  careers-service/
  internship-service/
  content-service/
  auth-service/
  media-service/
  audit-service/
```

Extract only when a domain has clear ownership, independent scaling/release requirements, a stable contract, observability, failure handling, and an explicit data-ownership plan. Immediate extraction would multiply deployments, secrets, health checks, tracing, connection pools, migrations, retries, timeouts, local-development processes, and partial-failure modes before the product benefits from them. Add Redis and events only for demonstrated caching, rate-limit, job, or asynchronous integration needs.

## 10. Exact move map

| Current group | Phase 1 destination | Required changes | Build/deployment risk | Required test | Rollback |
| --- | --- | --- | --- | --- | --- |
| Public `src/app` routes excluding `admin` and API ownership exceptions | `apps/web/src/app` | Preserve route segments and app-local `@/*`; update only paths needed by the move. | Route/metadata loss, changed root/layout behavior. | Route manifest, production build, visual/SEO parity suite. | Revert the web-move commit and redeploy baseline tag. |
| Public `src/components` excluding `components/admin` | `apps/web/src/components` | Preserve imports, CSS, client boundaries, asset URLs, and component code byte-for-byte where possible. | Visual, animation, sound, hydration, or responsive drift. | Screenshot/manual matrix, console and interaction checks. | Revert component move as one atomic commit. |
| Public `src/lib` and data/constants | `apps/web/src/lib` initially | Classify browser-safe versus server-only; keep API client behavior unchanged. | Server code leaking into browser or alias failure. | Web build plus browser network inspection. | Revert library move with app move. |
| `public` | `apps/web/public` | No asset rename or optimization. Produce before/after file manifest and checksums. | Broken case-sensitive paths, missing SEO/static files. | Hash/existence comparison and crawl all asset requests. | Restore root `public` from baseline. |
| Root public CSS and layout support | `apps/web` equivalents | Keep ordering and content unchanged; retain trailing-slash/image behavior. | Global cascade/order changes. | Computed-style and screenshot comparisons. | Revert atomic web config/layout move. |
| `src/app/admin` | `apps/admin/src/app` | Create a true admin root layout and remove dependency on public root effects; admin routes become `/` and `/login` on the admin host. | Auth redirect/path assumptions and accidental public discovery. | Admin page integration test on intended hostname behavior. | Route admin host back to baseline deployment; revert extraction. |
| `src/components/admin` | `apps/admin/src/components` | Use admin-local aliases and styles only. | Client/server boundary or CSS missing. | Admin build, login/logout/session UI tests. | Revert admin extraction commit. |
| `src/server/auth` | Initially `apps/admin/src/server/auth` plus server-only shared primitives where justified; later Nest auth module/security package | Remove imports from public client graph; define cookie/session API boundary. | Secret leakage, cookie/CSRF regression, runtime incompatibility from `argon2`. | Existing auth verification, full API integration, page integration, cookie attribute checks. | Keep existing auth API deployable until new boundary passes; revert routing. |
| Admin auth route handlers | Prefer same-origin routes in `apps/admin` as a BFF in Phase 1 | Preserve generic errors, no-store responses, session revocation, and rate/audit behavior. | Cross-origin cookies or redirect loops. | Complete auth integration sequence and DB count verification. | Point admin to old same-process handlers and revert BFF switch. |
| Contact/form API route handlers | `apps/web/src/app/api` temporarily; later Nest backend | Update imports to `@growblic/database`, contracts, and validation without changing HTTP contracts. | Public form outage or response-shape drift. | Contact and website-form API suites plus DB count checks. | Revert handler import/move; retain previous deployment. |
| `prisma/schema.prisma`, migrations, lock | `packages/database/prisma` | Change Prisma config paths and generator output; preserve migration SQL/history. | Wrong generator location, migrations run from wrong cwd, deployment omission. | `prisma format`, validate, generate, migration status/review, read-only verification scripts. | Revert package move; never roll back by deleting applied migrations. |
| `src/lib/prisma` and generated client | `packages/database/src` and package-local generated output | Export a server-only singleton; add package export map; update server imports. | Multiple clients/connections or client bundle inclusion. | Builds for every consumer, connection smoke test, bundle inspection. | Revert imports and database package commit. |
| Framework-neutral request/response types | `packages/contracts` | Replace app aliases with package exports; no runtime/server imports. | Circular workspaces or incompatible API changes. | Typecheck all consumers and contract tests. | Revert each contract extraction independently. |
| Shared validation schemas | `packages/validation` | Extract only schemas used by more than one app; separate browser-safe/server-only exports. | Different validation messages/statuses. | Existing API tests and malformed-input cases. | Revert extraction, restore local schema. |
| Root scripts | Root `scripts` initially, later package-specific scripts | Replace `../src/...` with workspace package imports; execute through filters; set explicit cwd. | Running against wrong schema/app or loading wrong env. | Run every verification/test script from repository root and owning package. | Keep old script command until replacement passes. |
| `prisma.config.ts` | Root wrapper or `packages/database/prisma.config.ts` | Resolve paths from config location rather than process cwd; document invocation. | CI/runtime cwd mismatch. | Run commands from root and database package. | Revert config relocation. |
| `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json` | App configs extending workspace packages | Preserve web PostCSS output; configure Next ESLint roots; define app-local aliases. | CSS or lint scope changes, accidental generated-file linting. | CSS build, lint baseline comparison, typecheck. | Revert config extraction commit. |
| Deployment docs/workflows | Root orchestration plus per-app Vercel configuration | Replace npm/root assumptions and retire GitHub Pages workflow only after approval. | Wrong app deployed or static export used for server app. | Preview deploy both apps and smoke tests. | Restore previous deployment config and alias to prior build. |

## 11. Step-by-step migration sequence

### Stage 0: make the current repository safe

1. Completed: website-form feature, schema, migration, API contracts, UI calls, and tests were reviewed and committed alone as `813d720`.
2. Completed: the private admin UI was reviewed and committed alone as `0f1f616`.
3. Decide whether the tracked backup/zero-byte remnants should be cleaned in a separate commit.
4. Verify the intended GitHub owner and repository.
5. Push only after ownership is confirmed and all commits are reviewed.
6. Require a clean `git status --short`.
7. Run the baseline validation suite and record results, including the known lint failures.
8. Create an annotated tag such as `pre-monorepo-2026-07-13` and ensure it exists on the verified remote.
9. Capture route, asset checksum, screenshot, SEO, API, and deployment baselines.

### Stage 1: toolchain checkpoint

1. Pin one Node 22 version for local/CI/deployment.
2. Pin an exact pnpm 11 version.
3. Add only root workspace/orchestration configuration and minimal package manifests.
4. Import the npm lockfile with `pnpm import` after workspace declarations exist.
5. Validate native packages, Prisma generation, all builds, and tests.
6. Commit the lock/toolchain conversion separately; remove `package-lock.json` only after review and CI reproduction.

### Stage 2: move the public app intact

1. Move the current application to `apps/web` without refactoring public source.
2. Move `public` intact.
3. Give web its own package/configs and preserve `trailingSlash`, unoptimized images, aliases, metadata, global CSS, splash, sounds, animations, and APIs.
4. Correct root orchestration and deployment Root Directory assumptions.
5. Run the complete parity plan before committing.

### Stage 3: isolate the admin app

1. Scaffold the minimum separate Next app with no public components or global effects.
2. Move admin pages/components and create an admin-only root layout.
3. Put admin auth calls behind the admin origin/BFF.
4. Verify cookies, CSRF posture, redirects, session revocation, audits, and no public navigation exposure.
5. Deploy a protected preview before assigning `admin.growblic.com`.

### Stage 4: centralize database ownership

1. Move schema and migrations without modifying their contents.
2. Move Prisma generation/runtime to `packages/database` and mark it server-only.
3. Update only server imports.
4. Make one package the migration owner; never run migrations in normal build or postinstall.
5. Run schema validation, generation, builds, auth/form/contact suites, and read-only DB verification.

### Stage 5: extract genuine shared packages

Extract contracts and validation first. Add config, logging, and security packages only when boundaries are explicit. Use `workspace:*` references and prohibit browser imports from server-only entry points. Run graph/cycle and bundle checks.

### Stage 6: introduce backend incrementally

1. Add the NestJS API gateway.
2. Add one modular NestJS backend application.
3. Implement health/observability and shared contracts.
4. Move contact and website-form endpoints one bounded domain at a time while preserving their external contracts.
5. Switch callers after shadow/preview testing.
6. Extract network services only when operating them independently is justified.

## 12. Migration checkpoints, validation, and rollback

| Checkpoint | Validation commands/checks | Expected result | Rollback |
| --- | --- | --- | --- |
| Clean baseline | `git status --short`; `git diff --check`; npm build and targeted auth/form/contact tests; Prisma validate/generate | Clean tree; known tests/build pass; known lint baseline recorded | Finish/revert feature work before proceeding; do not stash automatically. |
| Baseline tag | `git tag --list`; verify tag commit and remote; archive route/assets/screenshots | Immutable known-good reference exists | Delete/recreate only an unpushed incorrect tag; otherwise create a corrected tag, preserving history. |
| pnpm import | `pnpm install --frozen-lockfile`; dependency/peer review; native install logs; Prisma generate; all builds/tests | Reproducible install, no undeclared imports, native modules load | Revert toolchain commit and use npm lock from baseline. |
| `apps/web` move | `pnpm --filter web build`; route and asset manifests; visual/SEO/audio/forms checks | Public output and behavior match baseline | Revert atomic web-move commit; deploy baseline build. |
| Admin extraction | admin build; admin page/auth integration tests; cookie/redirect review; public route manifest comparison | Admin has independent root; public app does not expose/mount it | Revert extraction and route admin traffic to prior deployment. |
| Database package | Prisma format/validate/generate; migration status; app builds; DB verification scripts | One generated client/package; migrations unchanged; all server consumers pass | Revert code/package move. Never delete or reverse already applied migrations as structural rollback. |
| Shared packages | recursive typecheck/build/lint; workspace cycle check; client bundle inspection | Explicit dependency graph; no server secret/code in browser | Revert the individual extraction commit. |
| First Turbo build | clean install then root build/test; verify task inputs/outputs and cache behavior | Every app/package builds in dependency order from a clean checkout | Run filtered package commands; revert Turbo config without reverting app moves. |
| Preview deployment | separate web/admin previews, API/DB connectivity, no production DNS change | Both apps run with correctly scoped environment variables | Remove preview/restore project settings; no production traffic affected. |
| Production deployment | smoke/parity suite, monitoring, logs, form/auth checks, rollback alias ready | Public parity and private admin behavior confirmed | Reassign aliases/DNS to prior immutable deployments; revert application commit if needed. |

Every structural stage should be one reviewable commit or a short series with an independently passing endpoint. Never combine a schema change, package-manager conversion, app move, and deployment switch in one commit.

## 13. Frontend freeze and parity plan

Before migration, record the baseline commit/tag and production-build environment. After each web structural change, use the same Node version, dependency lock, environment names, viewport sizes, locale/timezone where relevant, and test data.

Required comparisons:

1. Generate a route manifest from `src/app` and the production build before and after; compare exact public routes, dynamic route behavior, redirects, status codes, and trailing slashes.
2. Generate sorted `public` file lists and checksums; require exact existence/content parity unless an asset change is separately approved.
3. Compare production build output routes, static/dynamic classification, middleware behavior, bundle errors, and server traces. Binary build directories need not be byte-identical, but differences must be explained.
4. Capture desktop, tablet, and mobile screenshots for the home page, representative service/product/blog/app pages, careers, internship list/detail, contact, meetup, start-project, price calculator, 404, and legal/support pages.
5. Perform manual overlays or image-diff review for layout, typography, spacing, color, responsive breakpoints, fixed elements, overflow, animation start/end states, and reduced-motion behavior.
6. Verify opening splash, scroll sounds, smooth scrolling, AI chat, carousels, globe/3D content, navigation, footer, back buttons, hover/focus states, and browser back/forward behavior.
7. Submit contact, careers, internship, meetup, start-project, and price-calculator flows against a non-production test database; compare request URLs, methods, payloads, safe responses, validation, loading/success/error UI, and persistence counts.
8. Compare sitemap and robots output if present, metadata titles/descriptions, canonical URLs, Open Graph/Twitter data, structured data, favicons, and HTTP status behavior.
9. Verify unknown routes produce the same 404 behavior and no admin route appears in public navigation or sitemap.
10. Check browser consoles for hydration/runtime/CSP errors and network panels for missing assets, redirect changes, duplicate calls, cache differences, or secret-bearing payloads.
11. Run accessibility smoke checks to detect structural regressions without changing frozen content/design during the move.
12. Store manifests and approved screenshots as CI artifacts associated with before/after commits.

Passing a build is not evidence of pixel or behavioral parity. Production traffic must remain on the baseline deployment until the full parity matrix is approved.

## 14. Admin isolation and authentication plan

Deploy `apps/admin` as a separate Next.js project at `admin.growblic.com`. Its root layout should contain only admin metadata, admin styles, and admin providers. It must not import the public Navbar, Footer, global stylesheet, splash, sounds, smooth-scroll experiences, AI chat, marketing metadata, or public page components.

Recommended session arrangement:

- Keep the current opaque session cookie host-only by omitting `Domain`.
- Serve admin login/session/logout through the admin origin, ideally BFF route handlers that call server-only auth logic or the backend.
- Keep `HttpOnly`, `Secure` in production, `SameSite=Lax` (subject to the final CSRF flow), `Path=/`, appropriate expiry, cache-control, rotation/revocation, generic errors, and audit behavior.
- Do not widen the cookie to `.growblic.com` merely to share it. A shared parent-domain cookie increases exposure to every subdomain.
- If the backend later resides on another origin, prefer the admin BFF so the browser still uses same-origin cookies. Direct cross-origin credentialed requests require explicit CORS allowlists, CSRF protection, origin validation, and carefully tested cookie behavior.
- `ADMIN_AUTH_PEPPER`, password hashes, token hashes, database URLs, bootstrap credentials, and internal metadata remain server-only.
- Keep admin URLs out of public menus, sitemap, static search/index feeds, and marketing page imports. Add `noindex` as defense in depth, not as access control.
- Enforce authorization on every admin page/API server boundary; obscurity and client redirects are insufficient.

The existing auth verification, API integration sequence, admin page integration test, and read-only DB count verification become mandatory regression gates.

## 15. Deployment plan

### Phase 1 Vercel layout

- Create separate Vercel projects for `apps/web` and `apps/admin` from the same verified Git repository.
- Configure each project's Root Directory to its app directory and confirm monorepo-aware install/build commands.
- Scope environment variables independently; do not copy all root variables into both projects.
- Keep the production public domain on the existing immutable deployment until preview parity passes.
- Assign `admin.growblic.com` only after admin preview authentication/security tests pass. DNS change requires separate explicit approval.
- Ensure the database package and any generated/runtime files are present in server traces; use `outputFileTracingRoot` only if deployment tests show it is required.
- Never run Prisma migrations automatically in app builds or `postinstall`. Use an explicit, serialized migration job with review and backup/rollback planning.

### Workflow cleanup

The current GitHub Pages workflow uploads `out` and is inconsistent with server API routes and Prisma-backed behavior. Keep it disabled/manual during planning, then retire it in a separately reviewed deployment commit after the Vercel/server deployment is confirmed. Update documentation that currently assumes repository Root Directory `.` and npm commands.

For CI, use one pinned Node/pnpm toolchain, frozen lockfile installs, filtered app/package tasks, no production secret exposure to forked/untrusted jobs, and explicit Prisma generation before dependent builds.

## 16. Project-specific risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Private admin UI was previously uncommitted | Resolved in isolated commit `0f1f616`; extract only from this known history. |
| Form persistence and migration were previously uncommitted | Resolved in isolated commit `813d720`; never rewrite the historical migration during the move. |
| Eight commits ahead of origin after this document commit | Verify remote ownership, review, push, and tag before migration so recovery does not depend on one machine. |
| GitHub repository owner is not confirmed as Growblic | Obtain explicit owner verification and permissions check before any push or remote change. |
| GitHub Pages remnants versus server runtime | Retire static Pages deployment only after server deployment is verified; prevent `out` from becoming a false production artifact. |
| Root-relative paths | Inventory Prisma config, scripts, docs, workflow, postinstall, and aliases; use package-root-aware paths and tests from multiple cwd values. |
| Prisma generation currently under `src/generated/prisma` | Generate inside `packages/database`, expose server-only exports, update ignores/traces, and validate all consumers. |
| Native `argon2` | Test clean install/runtime on developer machines, CI, Vercel/container architecture, and chosen Node ABI. |
| Prisma adapter/PostgreSQL pooling | Centralize client lifecycle; review Supabase pool/direct URLs and connection limits per deployment. |
| Environment movement | Maintain an ownership matrix, app-specific examples, least-privilege deployment secrets, and client-bundle scans. |
| Server-only imports entering client apps | Use `server-only`, conditional/export maps, lint boundaries, and bundle inspection; avoid mixed client/server barrels. |
| Cookie behavior across subdomains | Prefer host-only admin cookie and same-origin BFF; explicitly test CSRF/CORS/redirects before hostname switch. |
| Vercel monorepo root configuration | Create separate previews, verify root/build/output settings, and retain rollback aliases. |
| npm-to-pnpm lock conversion | Pin versions, use `pnpm import`, retain npm lock during review, clean-install in CI, remove old lock separately. |
| Multiple Next apps sharing packages | Align React/Next peer versions, declare every dependency, use `workspace:*`, selectively transpile source packages, and test tracing. |
| Turbopack/path resolution after move | Preserve app aliases, inspect bundled Next 16 docs, test dev/build from root and app filters. |
| Existing full-lint failures | Record baseline: 6 errors and 9 warnings, primarily in frozen public components. Do not hide or broaden the migration by fixing them; require no new lint findings in touched files and schedule a separately approved frontend-safe remediation. |
| Global public effects currently mount on admin | Separate app/root layout; verify no public CSS/sounds/splash/chat bundle in admin. |
| Accidental tracked backup/zero-byte files | Review in an explicit cleanup commit before the baseline tag; do not silently carry or delete them during moves. |
| Huge one-step migration | Use atomic checkpoints, preview deployments, immutable tags, and reversible traffic switches. |

## 17. Actions required before migration begins

All items are mandatory:

1. Completed: separately commit the website-form persistence work (`813d720`).
2. Completed: separately commit the private admin UI work (`0f1f616`).
3. Completed: review and commit the form migration and verification tooling with the feature.
4. Completed by the documentation commit containing this reviewed plan: commit the planning document separately.
5. Confirm that the GitHub remote is the intended Growblic-owned repository and that at least two appropriate owners have recovery/admin access.
6. Review the eight local commits, then push only after ownership confirmation.
7. Decide and document treatment of tracked backup files and the zero-byte `growblic-website01@0.1.0` and `next` files in a separate approved cleanup.
8. Make the working tree clean without automatic stash/reset/clean operations.
9. Align and pin a supported Node version across local, CI, and deployment environments.
10. Run and record the npm baseline: production build, Prisma validation/generation, targeted API/auth/admin/form tests, DB read-only verification, `git diff --check`, and the known full-lint result.
11. Capture route, asset checksum, screenshot, responsive, sound/splash, SEO, 404, console, and network baselines.
12. Confirm the current production deployment mechanism, Vercel projects, environment ownership, and rollback access; identify whether GitHub Pages serves any live traffic.
13. Create and push an annotated pre-monorepo baseline tag.
14. Obtain explicit approval for the toolchain/lockfile checkpoint before creating workspace files or running `pnpm import`.

## 18. Definition of Phase 1 success

Phase 1 is complete only when:

- one verified Git repository contains the root pnpm/Turbo workspace;
- `apps/web` reproduces every existing public route and approved behavior with no frontend freeze violation;
- `apps/admin` has an independent root layout and secure hostname/session boundary;
- `packages/database` is the single migration/client owner and cannot enter browser bundles;
- all workspace dependencies are explicit and frozen installs reproduce locally and in CI;
- public/admin preview and production deployment roots are independently configured;
- existing auth, form, contact, build, Prisma, DB verification, and migration-specific gates pass;
- no new full-lint findings are introduced beyond the recorded baseline;
- rollback to the pre-monorepo tag/deployments has been demonstrated or documented with verified access;
- no premature network microservices have been created.

## 19. Exact next action after approval

Do not create workspace files yet. After this planning document is committed separately, the exact next action is for a Growblic owner to verify the GitHub repository owner, administrative access, recovery access, and intended destination. Only after that verification should the eight local commits be pushed, the clean baseline be validated, and the annotated pre-monorepo tag be created. The first migration implementation change after that baseline should be the isolated Node/pnpm workspace-toolchain checkpoint.
