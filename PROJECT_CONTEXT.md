# Growblic — Project Context & Architecture Handoff

> **Purpose of this file.** This is a complete, self-contained description of the Growblic
> codebase — its product, architecture, every app and service, the data model, how the parts
> talk to each other, and the conventions you must follow. Hand this file to any AI assistant
> (or new engineer) and it will understand the whole project without reading the source first.
> It reflects the repository **after** the NX + microservices migration completed on
> **2026-07-19**. Keep it updated when the architecture changes.

---

## 0. TL;DR (read this first)

- **Product:** Growblic is a software-agency website + business platform. It has (1) a **public
  marketing website** with lead/contact forms and a price calculator, and (2) a paid
  **internship program** with online payments (Razorpay), an applicant portal (email + Google/GitHub
  login), auto-generated offer letters & certificates (PDF), and email delivery — plus (3) an
  internal **admin dashboard** to manage all submissions, applicant accounts, and certificates.
- **Monorepo:** pnpm workspaces orchestrated by **NX 23** (Turborepo was removed). Node `>=22 <23`,
  pnpm `11.4.0`.
- **Shape:** 2 Next.js frontends (DB-free) + 4 NestJS backend services + shared packages. One
  shared **PostgreSQL** database (plain Postgres — *not* Supabase) owned by a single Prisma package.
- **Golden rule:** frontends never touch the database. They call the services over HTTP. This is
  **lint-enforced** by NX module boundaries — a browser project importing `@growblic/database`
  fails the build.
- **Testing:** Node's built-in `node:test` runner (NOT jest). Services compile then run
  `node --test`; pure packages use `tsx --test`.
- **Deploy today:** the public website builds to a static export for **GitHub Pages**; the NestJS
  services are containerized (Docker/compose provided) but their production hosting is not yet wired
  into CI. Database migrations are always a manual operator action.
- **⚠️ Special note in `AGENTS.md`:** *"This is NOT the Next.js you know."* The repo pins a recent
  Next.js (16.2.9) with breaking changes vs. older training data. **Read
  `node_modules/next/dist/docs/` before writing Next.js code.**

---

## 1. Product overview — what the software does

Growblic sells custom software / SaaS / AI-automation services and runs a paid internship program.
The codebase serves three audiences:

1. **Public visitors** (the marketing website, `apps/web`):
   - ~90 marketing/service/product/blog pages (services, portfolio of ~40 built apps, pricing,
     process, careers, legal, per-product and per-app landing pages).
   - Lead-generation forms: **Contact**, **Start-a-Project** (quote), **Meetup interest**,
     **Careers application**, **Internship application**, and an interactive **Price Calculator**.
   - An **AI chat** widget ("Growblic Assistant") — note its backend `/ai/chat` endpoint is **not
     implemented in this repo** (see §16).
   - The **internship portal** UI (account signup/login, dashboard, pay, download offer letter &
     certificate).

2. **Internship applicants** (the portal, served by `internship-service`):
   - Create an account (email+password **or** Google/GitHub OAuth), pay the internship fee via
     Razorpay (or a non-prod demo gateway), receive an offer/confirmation letter PDF, and after the
     internship period receive a certificate PDF by email.

3. **Growblic staff** (the admin dashboard, `apps/admin` + `admin-service`):
   - Log in (session-cookie auth, SUPER_ADMIN role), review & change the status of all six
     submission kinds, manage internship applicant accounts (enable/disable/revoke sessions), and
     draft/issue/re-send internship certificates (with live PDF preview).

---

## 2. High-level architecture

```
                          Browsers
             ┌───────────────────┴───────────────────┐
             │                                        │
     apps/web (Next.js :3002)              apps/admin (Next.js :3001)
     public marketing + portal UI          internal dashboard (DB-free proxy)
             │  HTTP (fetch)                          │  server-side fetch
             │  credentials: include                  │  x-admin-session-token
   ┌─────────┼──────────────────┐                     │
   ▼         ▼                  ▼                      ▼
submissions-  internship-service          admin-service (:4002)
service        (:4000)                    admin auth + admin APIs
(:4001)        payments + portal + ┌───── x-internship-certificate-internal-token ──┐
public forms   internal cert PDFs  ◄──────── (admin-service → internship-service) ───┘
   │           │                                      │
   └───────────┴──────────────┬───────────────────────┘
                              ▼
                    packages/database (Prisma 7)
                              │
                    PostgreSQL (single shared DB)
                              ▲
              notification-worker (:4003)  ── in-process cron: certificate emails/reminders
```

- **All four services** are independent NestJS processes, each with its own `/health/live` and
  `/health/ready`. They all import the **same** `@growblic/database` Prisma client and share one
  Postgres instance (table ownership is by convention, not physical isolation — see §11 & §18).
- **`notification-worker`** has no business HTTP surface (health only); it runs a `setInterval`
  scheduler that generates certificate PDFs and sends reminder/certificate emails.
- An **nginx gateway** (`infra/gateway/nginx.conf`, `docker-compose.yml`) can front the services on
  a single origin (`:8080`) with path-based routing; `/internal/*` is blocked at the edge.

---

## 3. Tech stack & versions

| Layer | Choice |
| --- | --- |
| Package manager / runtime | pnpm `11.4.0`, Node `>=22 <23` |
| Monorepo build system | **NX 23** (targets: build, typecheck, lint, test, dev; caching on; `nx affected`) |
| Frontends | **Next.js 16.2.9** (App Router), React 19.2.4, Tailwind CSS v4 |
| Web-only libs | framer-motion, lenis (smooth scroll), three + react-globe.gl + topojson-client (3D globe), embla-carousel, qrcode.react, **pdf-lib + pdfjs-dist** (client-side PDF), lucide-react |
| Backend services | **NestJS 11.1.28** + Express 5.2.1, helmet 8.3, pino 10.3 (logging), rxjs, reflect-metadata |
| ORM / DB | **Prisma 7.8** with `@prisma/adapter-pg` (driver adapter over `pg`), **PostgreSQL** |
| Auth crypto | **argon2 (argon2id)** for password hashing; SHA-256 for token storage; HMAC-SHA256 for throttle peppers |
| Payments | **Razorpay** (REST via `fetch`, no SDK) — **test-mode-locked** in current code |
| Email | **Resend** (HTTP API) or SMTP via nodemailer (SMTP forbidden in production) |
| PDF generation | **pdf-lib** + `@pdf-lib/fontkit` (server: invoice/confirmation/certificate; client: web renders its own) |
| Tests | Node **`node:test`** + supertest + `@nestjs/testing` (NO jest) |

---

## 4. Monorepo tooling (NX)

- **`nx.json`** defines `targetDefaults`. `build`, `typecheck`, and `test` all `dependsOn: ["^build"]`
  because shared packages are consumed from their compiled `dist/` output, so upstream libs must be
  built first. Caching is enabled for build/typecheck/lint/test; `dev` is uncached.
- **Root scripts** (`package.json`) wrap NX:
  - `pnpm dev` → `nx run-many -t dev` (everything); `pnpm dev:web`, `dev:admin`, `dev:services`,
    `dev:internship`, `dev:submissions`, `dev:admin-service`, `dev:worker` for one project.
  - `pnpm build` / `typecheck` / `test` / `lint` → `nx run-many -t <target>`.
  - `pnpm affected` → `nx affected -t build,lint,typecheck,test` (only changed projects + dependents).
  - `pnpm graph` → `nx graph`.
- **Module boundaries** — the load-bearing architectural guardrail. Every `package.json` carries an
  `nx.tags` entry; `packages/eslint-config/base.mjs` configures
  `@nx/enforce-module-boundaries` so:

  | Tag | Projects | May depend only on |
  | --- | --- | --- |
  | `scope:frontend` | apps/web, apps/admin | `scope:shared`, `scope:tooling` |
  | `scope:service` | the 4 services | `scope:shared`, `scope:service-lib`, `scope:data`, `scope:tooling` |
  | `scope:service-lib` | nest-common, internship-shared | `scope:shared`, `scope:service-lib`, `scope:tooling` |
  | `scope:shared` | contracts, validation | `scope:shared`, `scope:tooling` |
  | `scope:data` | database | `scope:tooling` |
  | `scope:tooling` | eslint-config, typescript-config | — |

  This is what **prevents a frontend from ever importing `@growblic/database`** again. It was
  negative-tested during migration (a forbidden import in apps/web fails lint).

---

## 5. Workspace layout

```
apps/
  web/                         Next.js public website (:3002) — no DB, HTTP-only
  admin/                       Next.js admin UI (:3001) — no DB, thin proxy to admin-service
  services/
    internship-service/        NestJS (:4000) — payments + portal + internal certificate PDFs
    submissions-service/       NestJS (:4001) — public form submissions
    admin-service/             NestJS (:4002) — admin auth + admin dashboard/submission/cert APIs
    notification-worker/       NestJS (:4003) — certificate email/reminder jobs (health-only HTTP)
packages/
  database/                    Prisma 7 schema + client (single shared PostgreSQL)         [scope:data]
  contracts/                   browser-safe shared TypeScript types (buildable → dist/)     [scope:shared]
  validation/                  pure validators/normalizers (buildable → dist/)              [scope:shared]
  nest-common/                 service config, pino logging, request-context, exception
                               filter, CORS/bootstrap, health probe                         [scope:service-lib]
  internship-shared/           payment core, PDF generators (invoice/confirmation/
                               certificate, base64-embedded signature font), cert email     [scope:service-lib]
  eslint-config/               shared flat ESLint config + NX module-boundary rules         [scope:tooling]
  typescript-config/           shared tsconfig bases (base/library/nextjs/node)             [scope:tooling]
infra/
  services.Dockerfile          parameterized multi-stage build for any service
  gateway/nginx.conf           single-origin gateway (path routing, :8080)
docker-compose.yml             postgres + 4 services + gateway
docs/                          architecture + auth + deployment docs (see §19)
scripts/                       operator/verify/CI helper scripts (tsx + node .mjs)
```

Config-only packages (`eslint-config`, `typescript-config`) provide flat ESLint configs and tsconfig
bases (`base.json`, `library.json`, `nextjs.json`, `node.json`).

---

## 6. Frontend apps

### 6.1 `apps/web` — public website (:3002)

- **Dependencies:** only `@growblic/contracts` from the workspace (types). **No `@growblic/database`,
  no `@growblic/validation`** (verified clean). `transpilePackages: ["@growblic/contracts"]`.
- **Dual build mode** (`next.config.ts`):
  - Normal `next build` → server build.
  - `GITHUB_PAGES=true` → `output: "export"` (fully static), `basePath`/`assetPrefix` =
    `/growblic-website01`, `pageExtensions: ["tsx"]`, `NEXT_PUBLIC_SITE_BASE_PATH` injected.
  - Always: `trailingSlash: true`, `images.unoptimized: true`, tracing/turbopack root = monorepo root.
- **Pages:** ~90 under `src/app/` (flat, no route groups): marketing (`/about`, `/services`,
  `/portfolio`, `/pricing`…), service landing pages, `/apps/<slug>` (~40 product showcases),
  `/blog/*`, `/careers/*` (with nested layout), `/internships` + `/internships/[slug]`,
  `/products/[slug]`, `/internship-portal`, plus `/process/*`. `sitemap.ts`, `seo.ts` present.
- **The only server API route** is `src/app/api/health/route.ts` (`GET` → `{status:"ok",
  service:"growblic-website"}`). All the old form-persistence routes were **deleted** in the
  migration — forms now POST directly to the backend.
- **API client — `src/lib/api.ts`:**
  - `growblicApiUrl(path)` reads `NEXT_PUBLIC_API_URL`; **throws** if unset (no silent fallback).
  - `submissionsApiUrl(path)` reads `NEXT_PUBLIC_SUBMISSIONS_API_URL`, and **falls back to the primary
    API origin** when unset (so a single-gateway deployment works).
  - `fetchGrowblicApi(path, init)` → `fetch` with `credentials:"include"`; network errors become a
    friendly `LOCAL_BACKEND_CONNECTION_ERROR`.
  - `persistWebsiteForm(path, payload)` — 15 s abort timeout; maps the 5 form paths to
    `/public-submissions/*` on the submissions-service:
    - `/api/contact/` → `/public-submissions/contact`
    - `/api/careers/applications/` → `/public-submissions/career-applications`
    - `/api/internships/applications/` → `/public-submissions/internship-applications`
    - `/api/meeting-requests/` → `/public-submissions/meetups`
    - `/api/quote-requests/` → **`/public-submissions/price-calculator`** if `payload.calculatorData`
      is present, else **`/public-submissions/project-requests`**.
- **Form components → endpoints:** `ContactSection` (contact), `StartProjectForm` (project-requests),
  `MeetupInterestForm` (meetups), `PriceCalculator` (price-calculator; also does live FX lookups to
  external `api.frankfurter.dev` → `open.er-api.com` → hardcoded 85 INR/USD). All carry a honeypot
  `website` field and a `submissionKey` (`crypto.randomUUID()`) for idempotency.
- **Internship portal UI** (`src/app/internship-portal/InternshipPortalClient.tsx` and
  `src/app/internships/InternshipFeePanel.tsx`) call `internship-service` directly via
  `fetchGrowblicApi`: `/internship-portal/*` (auth, dashboard, documents) and `/internship-payments/*`
  (order/status/verify/demo-complete/confirmation-letter, authorized with `x-payment-access-token`).
- **Client-side PDF:** `src/app/internships/internship-certificate-renderer.ts` and
  `internship-confirmation-pdf.ts` build PDFs in the browser with **pdf-lib**; `pdfjs-dist` renders
  previews.
- **AI chat:** `GrowblicAIChat.tsx` posts to `${NEXT_PUBLIC_GROWBLIC_API_URL || NEXT_PUBLIC_API_URL ||
  localhost:4000}/ai/chat`. **No service implements `/ai/chat`** — this is a known gap (§16).

### 6.2 `apps/admin` — internal dashboard (:3001), DB-free proxy

- **Dependencies:** only `@growblic/contracts` + `@growblic/validation`. **No `@growblic/database`,
  no `argon2`** — all auth/data logic moved to `admin-service`.
- **The app is a thin proxy.** Its ~24 `src/app/api/**/route.ts` handlers forward to `admin-service`;
  only the auth routes manage the session cookie:
  - **`src/server/backend/backend-admin.ts`** — `BACKEND_INTERNAL_URL` (default `http://localhost:4002`);
    `backendAdminFetch(path, {token,...})` attaches the session token as the
    **`x-admin-session-token`** header and forces `cache:"no-store"`. Server-component loaders
    (`fetchAdminDashboardSummary`, `fetchAdminSubmissionPage`, `fetchInternshipCertificateList/Detail`,
    `fetchInternshipApplicantAccounts`) read the cookie, and `redirect("/login/")` on 401 / throw
    `FORBIDDEN` on 403.
  - **`src/server/backend/admin-proxy.ts`** — `proxyAdminJson` (forwards method+query+body+token,
    normalizes backend error envelopes to `{success:false, message}`, passes through messages only for
    statuses `{400,401,403,409,422,429}`, collapses ≥500 → 500) and `proxyAdminPdf` (streams PDFs;
    **404 → 409**, other errors → 502; `?download=1` flips `inline` → `attachment`).
  - **Login route** (`app/api/auth/login/route.ts`) is the one non-trivial handler: caps body at 8 KiB,
    validates shape, forwards to `/admin/auth/login` **adding `x-forwarded-for` and `user-agent`**, and
    on success sets the session cookie from `{token, expiresAt}`.
- **Session cookie** (`src/server/auth/admin-auth.cookies.ts`): name **`growblic_admin_session`**,
  `httpOnly`, `sameSite:"lax"`, `secure` only in production, `path:"/"`, `priority:"high"`,
  **host-only (no `domain`)**. Page guards (`require-admin-session.ts`,
  `require-admin-page-session.ts`) validate by calling backend `GET /admin/auth/session` — there is no
  local session store anymore.
- **Pages** (all `force-dynamic`, server-fetched): dashboard (`page.tsx`, 6 module cards), `login`,
  the six submission pages (contact-messages, project-requests, price-calculator-leads,
  meetup-requests, career-applications, internship-applications), `internship-accounts`, and
  `internship-certificates` + `[id]` (with `InternshipCertificateEditor`, live PDF preview,
  reminder-test action). Client mutation components PATCH/POST the local `/api/**` proxies.

---

## 7. Backend services

All services share the same skeleton via `@growblic/nest-common`: `main.ts` calls
`loadBackendConfig(process.env, { defaultPort })`, creates the Nest app with `bodyParser:false` +
pino `StructuredLogger`, calls `configureBackendApplication(app, config, { rawBodyRoutes })`, listens,
then `configureHttpServer` (request/headers timeouts) + `installGracefulShutdown` (SIGTERM/SIGINT).
`app.module.ts` is a `DynamicModule` importing `BackendConfigModule.register(config)`,
`RequestContextModule`, `LoggingModule.register(config)`, a `HealthModule`, plus the service's own
modules.

### 7.1 `submissions-service` (:4001) — public form intake

- **Module:** `PublicSubmissionsModule` → `PublicSubmissionsController` (`@Controller("public-submissions")`),
  `PublicSubmissionsService`, `PrismaPublicSubmissionStore` (behind `PUBLIC_SUBMISSION_STORE` token).
- **Routes (all POST, `Cache-Control: no-store`, generic success response):**
  `contact`, `project-requests`, `price-calculator`, `meetups`, `career-applications`,
  `internship-applications`.
- **Behavior:** validates via `@growblic/validation`, honors the honeypot field, maps validation
  errors → 400 with `fieldErrors`, upserts idempotently by `submissionKey` into
  `contactEnquiry` / `quoteRequest` / `meetingRequest` / `careerApplication` / `internshipApplication`
  (the internship case links to an existing `internshipApplicantAccount` by normalized email).
- Lowest-coupling service; the cleanest candidate for a future standalone deployment.

### 7.2 `internship-service` (:4000) — payments + portal + internal certificate PDFs

The largest service. `main.ts` registers the raw-body route
**`/internship-payments/webhooks/razorpay`** (needed for webhook HMAC). Modules:
`InternshipPaymentsModule`, `InternshipPortalModule`, `HealthModule`.

**Module: internship-payments** — `InternshipPaymentsController` (`internship-payments`),
`InternshipCertificateInternalController` (`internal/internship-certificates`),
`InternshipPaymentService`, `InternshipCertificateInternalService`, `InternshipCertificateEmailProvider`.

Public payment routes (authorized with the **`x-payment-access-token`** header, matched against a
stored SHA-256 hash; mismatches return 404 to avoid enumeration):

| Method & path | Purpose |
| --- | --- |
| `POST /internship-payments/orders` | Create a Razorpay order (reserves a `CREATED` row, calls Razorpay REST, promotes to `PENDING`) |
| `POST /internship-payments/demo-sessions` | Create a non-prod DEMO gateway session (₹1 = 100 paise) |
| `POST /internship-payments/verify` | Verify the browser checkout callback (HMAC of `orderId\|paymentId`), settle, deliver invoice |
| `POST /internship-payments/webhooks/razorpay` | Razorpay webhook (raw-body HMAC + idempotency) — `payment.captured`, `order.paid`, `payment.failed` |
| `GET /internship-payments/:id/status` | Payment status |
| `POST /internship-payments/:id/demo-complete` | Complete a DEMO payment |
| `GET /internship-payments/:id/invoice` | Stream invoice/receipt PDF (attachment) |
| `GET /internship-payments/:id/certificate-eligibility` | Eligibility summary |
| `POST /internship-payments/:id/confirmation-letter` | Generate & stream the offer/confirmation letter PDF (body: `joiningDate`) |

Internal certificate routes (gated by **`x-internship-certificate-internal-token`**, constant-time
compared; **called only by admin-service**, blocked at the public gateway):

| `GET /internal/internship-certificates/:id/preview` | Stream stored or live-rendered certificate PDF (inline) |
| `GET /internal/internship-certificates/:id/offer-letter` | Stream confirmation letter PDF (requires `PAID`) |

Key payment-lifecycle facts (see §13 for the full flow):
- **Razorpay** via HTTP Basic `fetch` to `https://api.razorpay.com/v1`; **test-mode-locked** — the key
  must start `rzp_test_` or the service throws `ServiceUnavailableException`.
- **`settlePaid`** is the money-settlement transaction (`Serializable`, up to 5 retries) that mutates,
  in one atomic commit: `internshipPayment` (→ `PAID`, offer/confirmation fields),
  `internshipConfirmationSequence` (per-year counter), `invoice` (create-only, number
  `GB-INT-<year>-<10 chars>`), `internshipCertificate` (→ `PENDING_SKILLS`), and — on the webhook path
  — `paymentWebhookEvent` (the idempotency row, committed atomically with settlement).
- **Idempotency key** for webhooks = `x-razorpay-event-id` header, else `sha256(rawBody)`.
- **Invoice delivery** posts the PDF to **Resend** (customer + `INVOICE_ADMIN_EMAIL`) with per-audience
  idempotency keys.
- **Demo gateway** only exists when `NODE_ENV != production` and `INTERNSHIP_DEMO_PAYMENT_ENABLED`
  (or legacy `ENABLE_DEMO_PAYMENT`) is `true`; hard-capped at 100 paise.

**Module: internship-portal** — `InternshipPortalController` (`internship-portal`),
`InternshipPortalService`. Auth is a **session cookie** `growblic_applicant_session` (14-day,
httpOnly, sameSite lax, secure in prod), *not* a header. Routes:

| Path | Purpose |
| --- | --- |
| `POST auth/register`, `auth/login`, `auth/logout` | Email+password account auth (argon2id) |
| `POST auth/forgot-password`, `auth/reset-password` | Reset flow (30-min single-use token, no account enumeration) |
| `POST auth/resend-verification`, `auth/verify-email` | Email verification (24-h token) |
| `POST auth/pending-flow` | Pre-OAuth flow token bound to a specific application+plan |
| `GET auth/oauth/:provider/start`, `auth/oauth/:provider/callback` | **Google (PKCE) / GitHub** OAuth; provider email must equal & be verified against the application email |
| `GET auth/session` | Current account |
| `GET dashboard` | Aggregated dashboard (internship status/progress/remaining days, offer-letter & certificate readiness) |
| `POST payments/demo-session` | Session-scoped demo payment |
| `GET offer-letter`, `offer-letter/download` | Offer/confirmation letter PDF (inline / attachment) |
| `GET certificate`, `certificate/status`, `certificate/download`, `POST certificate/demo-complete` | Certificate status/download + demo internship completion |

Portal security details: argon2id (memory 19456, time 2, parallelism 1, hashLength 32); opaque 32-byte
session tokens stored only as SHA-256; failed-login **rate limiting** (≥8 in 15 min) keyed by peppered
HMAC of email and IP (`APPLICANT_AUTH_PEPPER`, falling back to `ADMIN_AUTH_PEPPER`); OAuth flows use
stored hashed state + (Google) PKCE verifier; every auth event writes an `auditLog`. Downloads write
`internshipApplicantDocumentAccess` audit rows.

Both payment and portal modules reuse pure domain/PDF/email code from **`@growblic/internship-shared`**
(payment core, Razorpay signature verify, invoice/confirmation/certificate PDF generators, certificate
dates/numbering, email provider).

### 7.3 `admin-service` (:4002) — admin auth + admin APIs

`AdminModule` wires four controllers + `InternshipCertificateProxyService`. Every business route
(except login) requires a valid session via the **`x-admin-session-token`** header and the
**`SUPER_ADMIN`** role; all responses are `no-store`.

- **`AdminAuthController` (`admin/auth`):**
  - `POST admin/auth/login` — validates body, derives trusted client IP (from `request.ip`, only
    trustworthy because of the trust-proxy setting) + bounded user-agent, calls `loginAdmin`. Failure
    → 429 (rate-limited) / 400 (invalid) / 401. Success returns `{token, expiresAt, user}` — the
    opaque token is returned **once**; only its SHA-256 is stored.
  - `POST admin/auth/logout`, `GET admin/auth/session` — read the `x-admin-session-token` header.
  - Auth crypto: argon2id (memory 19456, time 2, parallelism 1, hashLength 32); **8-hour** session TTL;
    login throttle 5 failures / 15 min (peppered HMAC of email and IP via `ADMIN_AUTH_PEPPER`);
    **constant-time dummy-hash path** so non-existent users take the same time; password min length 12.
    Successful login writes session + login-attempt + `lastLoginAt` + `ADMIN_LOGIN_SUCCESS` audit in one
    transaction.
- **`AdminSubmissionsController` (`admin`):**
  - `GET admin/dashboard/summary` (counts across the 6 kinds, each total + `NEW`/pending).
  - `GET admin/submissions/:kind` and `PATCH admin/submissions/:kind/:id` for kinds
    `contact-messages`, `project-requests`, `price-calculator-leads`, `meetup-requests`,
    `career-applications`, `internship-applications`.
  - **Important modelling detail:** one `quoteRequest` table backs both **project-requests** and
    **price-calculator-leads**; they are split by `source === "price-calculator"` (or `source is null`
    AND `calculatorData` present). Status updates re-apply this classification so an id can only be
    updated under its correct kind. Every status change writes an `ADMIN_SUBMISSION_STATUS_CHANGED`
    audit row.
- **`AdminInternshipAccountsController` (`admin/internship-accounts`):** `GET` list; `PATCH :id` with
  `action` = `enable` / `disable` (also revokes live sessions) / `revoke-sessions`. Audited.
- **`AdminInternshipCertificatesController` (`admin/internship-certificates`):** list (with filters
  `ending-soon`/`skills-pending`/`ready`/`emailed`/`email-failed`), `GET :id` detail (raw PDF bytes
  excluded), `PATCH :id` save draft (throws `IMMUTABLE_CERTIFICATE` once generated/emailed),
  `POST :id/ready` (requires dates + `PAID` + valid `domainRole` + ≥1 skill), `POST :id/retry`
  (rate-limited: ≥3 retries in 5 min → `CERTIFICATE_RETRY_RATE_LIMITED`), `POST :id/reminder-test`
  (env-gated test path). `GET :id/preview` and `GET :id/offer-letter` stream PDFs by proxying to
  `internship-service` via `InternshipCertificateProxyService` (uses `INTERNSHIP_SERVICE_INTERNAL_URL`
  + `x-internship-certificate-internal-token`).

### 7.4 `notification-worker` (:4003) — certificate jobs

- HTTP surface is **health only**. `CertificateJobsModule` declares providers only
  (`InternshipCertificateJobs`, `InternshipCertificateEmailProvider`) — no controllers.
- **`InternshipCertificateJobs`** (implements `OnApplicationBootstrap`/`OnApplicationShutdown`): unless
  `INTERNSHIP_CERTIFICATE_JOBS_ENABLED === "false"`, it runs once immediately then on a `setInterval`
  (`INTERNSHIP_CERTIFICATE_JOB_INTERVAL_SECONDS`, default 1 h, bounded 15–86400 s; `timer.unref()`), with
  a reentrancy guard. Each tick:
  - **Reminders:** claims up to 50 due certificates (`reminderDueAt <= now`, not sent, completion in the
    future) with a UUID claim token, emails the admin a deep-linked reminder (idempotency-keyed), records
    an `ADMIN_REMINDER` attempt.
  - **Completions:** claims up to 50 certificates past `completionDate` not yet emailed
    (`emailAttemptCount < 5`, with backoff), verifies eligibility, and in a `Serializable` transaction
    allocates the certificate number/sequence, renders the PDF (`generateInternshipCertificatePdf`),
    stores `pdfBytes` + `pdfSha256` (status `GENERATED`), then emails the candidate the certificate
    (status `EMAILED`). Blocked certificates get a one-time admin alert.
- **Email provider** (`INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER`, default `resend`; `smtp` throws in
  production): Resend uses `RESEND_API_KEY` + `INTERNSHIP_CERTIFICATE_FROM_EMAIL`; SMTP uses the
  `SMTP_*` set.
- **Why it's separate:** running this scheduler in a single dedicated process avoids duplicate emails
  when the HTTP services scale horizontally. (Future: move to a real queue — §19.)

---

## 8. Shared packages

- **`@growblic/database`** — the sole Prisma owner. Prisma 7 generator `prisma-client` (ESM, output
  `src/generated/prisma`), datasource `postgresql`. `src/client.ts` builds a `PrismaPg` adapter from
  `DATABASE_URL` (throws if missing), memoizes a singleton `prisma` on `globalThis` outside production,
  re-exports `Prisma`. Package exports: `.` → `src/index.ts` (adds `import "server-only"` guard) and
  `./client` → `src/client.ts` (no guard, used by services & scripts). **Migration tooling** uses a
  separate `DIRECT_URL` (`prisma.config.ts`). See §10 for the model list.
- **`@growblic/contracts`** — browser-safe TypeScript types only (no Prisma, no env). Files: `common`,
  `admin-auth`, `admin-submissions`, `contact`/`careers`/`internships`/`meeting`/`quote`,
  `internship-certificates`, `internship-certificate-skills` (has runtime values: the skill catalog +
  domain-role helpers), `internship-accounts`. Buildable → `dist/` (CommonJS + declarations). Consumed
  by both frontends and the services.
- **`@growblic/validation`** — pure validators/normalizers (depends on contracts): `validateContact`,
  `validateQuoteRequest`, `validateMeetingRequest`, `validateCareerApplication`,
  `validateInternshipApplication`, `validateAdminLogin`, admin-submission query/status readers,
  certificate helpers, and shared primitives. Exports `FormValidationError`. Buildable → `dist/`.
- **`@growblic/nest-common`** — the service framework:
  - `config/backend-config.ts` — `loadBackendConfig` reads `NODE_ENV`, `BACKEND_HOST`, `PORT`/`BACKEND_PORT`
    (PORT wins; per-service `defaultPort` in dev), `LOG_LEVEL`, `CORS_ALLOWED_ORIGINS`,
    `REQUEST_BODY_LIMIT`, `REQUEST_TIMEOUT_MS`, `SHUTDOWN_TIMEOUT_MS`, `DATABASE_READINESS_TIMEOUT_MS`,
    `TRUST_PROXY`. Non-production uses local defaults; **production requires every value** or it throws.
  - `bootstrap/app-bootstrap.ts` — `configureBackendApplication`: CORS (credentials on; allowed origins
    from config + a built-in localhost set that is excluded in production; **allowed headers** include
    `x-payment-access-token`, `x-razorpay-signature`, `x-razorpay-event-id`, `x-request-id`,
    `x-internship-certificate-internal-token`; exposes `content-disposition`), `trust proxy`, helmet,
    request-context middleware, request-logging middleware, JSON body parser **with raw-body capture for
    configured `rawBodyRoutes`**, urlencoded, then the global exception filter. Also `configureHttpServer`,
    `installGracefulShutdown`, `closeApplicationWithTimeout`.
  - `filters/global-exception.filter.ts` — maps exceptions to a safe table (400/401/403/404/405/409/413/429/503);
    passes the exception's own message through **only** for statuses `{400,401,403,409,422,429}` (framework
    404/413 messages are redacted to avoid leaking request details); response shape
    `{statusCode, error:{code,message}, requestId, timestamp}`.
  - `logging/*` — pino `StructuredLogger` (`info`/`warning`/`failure` + Nest `LoggerService`) with a
    redaction list (authorization, cookie, password, token, hash, DATABASE_URL…) and request-logging
    middleware.
  - `request-context/*` — `AsyncLocalStorage` carrying a validated/echoed `x-request-id`.
  - health probe pattern — `GET /health/ready` races a `SELECT 1` against `DATABASE_READINESS_TIMEOUT_MS`
    and returns **503** on failure; the probe **lazily** `require`s the DB client.
- **`@growblic/internship-shared`** — pure (non-DI) internship domain code shared by internship-service
  & notification-worker: `internship-payment.core` (plan/program tables, sha256/HMAC, Razorpay checkout
  & webhook signature verification, demo-gateway flag), the invoice/confirmation/certificate PDF
  generators + bindings, certificate dates/numbering, and the `InternshipCertificateEmailProvider`
  (Resend/SMTP). The authorized-signature TTF font is **embedded as a base64 constant**
  (`src/assets/authorized-signature-font.ts`) so there is no runtime asset-copying.
- **`@growblic/eslint-config`, `@growblic/typescript-config`** — tooling only (§4).

---

## 9. How every service loads the database (important pattern)

Each DB-touching class loads Prisma **lazily**: `this.databaseModule ??= require("@growblic/database/client")`,
then uses `.prisma` (and `.Prisma` for `Prisma.sql\`SELECT 1\``). Reason: the client is ESM and needs
`DATABASE_URL` at runtime, and lazy loading keeps unit tests DB-free. Each service's
`webpack.config.cjs` **externalizes `@growblic/database/client`** so the Nest build does not bundle the
generated Prisma client / native `pg` adapter — it is `require`d at runtime. There is **no repository
abstraction** except `PrismaPublicSubmissionStore` in submissions-service; other services call `prisma`
directly and use `$transaction` with `Serializable` isolation for money/certificate mutations.

---

## 10. Data model (Prisma) — all 34 models + enums

Single Postgres schema (`packages/database/prisma/schema.prisma`). Soft-delete via `deletedAt` where
present; enums drive statuses. Grouped by domain:

- **Public submissions:** `ContactEnquiry`, `QuoteRequest` (backs both project-requests &
  price-calculator via `source`/`calculatorData`), `MeetingRequest`, `CareerApplication`,
  `InternshipApplication`, `JobApplication`.
- **Admin identity/auth:** `AdminUser`, `AdminRole`, `AdminUserRole`, `AdminSession`,
  `AdminLoginAttempt`, `AuditLog`.
- **CMS content (schema exists; admin CMS UI is future work):** `Service`, `Product`,
  `PortfolioProject`, `Testimonial`, `JobOpening`, `SiteSetting`, `MediaAsset`.
- **Internship payments/invoicing:** `InternshipPayment`, `Invoice`, `PaymentWebhookEvent`,
  `InternshipConfirmationSequence`.
- **Internship certificates:** `InternshipCertificate`, `InternshipCertificateSkill`,
  `InternshipCertificateEmailAttempt`, `InternshipCertificateSequence`.
- **Internship applicant portal (public accounts/OAuth):** `InternshipApplicantAccount`,
  `InternshipApplicantDocumentAccess`, `InternshipApplicantOAuthIdentity`, `InternshipApplicantAuthFlow`,
  `InternshipApplicantSession`, `InternshipApplicantAuthAttempt`, `InternshipApplicantPasswordResetToken`,
  `InternshipApplicantEmailVerificationToken`.
- **Enums (19):** `EnquiryStatus`, `AdminUserStatus`, `ContentStatus`, `EmploymentType`,
  `JobOpeningStatus`, `JobApplicationStatus`, `SettingValueType`, `InternshipPaymentStatus`,
  `InternshipApplicantAccountStatus`, `InternshipApplicantDocumentType`,
  `InternshipApplicantDocumentActorType`, `InternshipApplicantDocumentAction`, `InvoiceDeliveryStatus`,
  `InternshipCertificateStatus`, `InternshipCertificateReminderStatus`,
  `InternshipCertificateEmailStatus`, `InternshipCertificateEmailKind`.
- **Migrations:** 14 applied folders (`20260713071341_init_contact_enquiries` …
  `20260718193000_add_applicant_document_access`), `migration_lock.toml` = postgresql. **Never** run
  `db push`; migrations are reviewed and applied manually with `prisma migrate deploy` (uses `DIRECT_URL`).

---

## 11. Inter-service communication & trust boundaries

| From → To | Transport | Credential |
| --- | --- | --- |
| Browser → apps/web → submissions-service | `fetch` (`credentials:include`) | none (public forms; honeypot + `submissionKey`) |
| Browser → apps/web → internship-service (portal) | `fetch` | session cookie `growblic_applicant_session` |
| Browser → apps/web → internship-service (payments) | `fetch` | header `x-payment-access-token` |
| Browser → apps/admin (`/api/**`) | same-origin | cookie `growblic_admin_session` (HttpOnly, host-only) |
| apps/admin (server) → admin-service | server-side `fetch` | header `x-admin-session-token` |
| admin-service → internship-service (`/internal/*`) | server-side `fetch` | header `x-internship-certificate-internal-token` |
| All services → PostgreSQL | Prisma (`DATABASE_URL`) | — |

- The admin trust chain is: browser (cookie) → admin app (converts cookie → header) → admin-service
  (validates session, checks SUPER_ADMIN role) → Prisma. Certificate PDFs add one more hop:
  admin-service → internship-service `/internal/*` (shared internal token) → PDF.
- **Data ownership** is by convention on a single shared DB: submissions-service owns the 5 submission
  tables; internship-service owns payment/portal/certificate tables; admin-service reads/mutates across
  submission + certificate + applicant tables for the dashboard; notification-worker writes certificate
  PDF/email/reminder fields. A physical database-per-service split is deliberately deferred (§18).
- **CORS caveat to verify if refactoring:** the shared bootstrap's CORS `allowedHeaders` does **not**
  currently include `x-admin-session-token`. This is fine today because the admin app calls
  admin-service **server-to-server** (Node fetch, not a browser, so CORS doesn't apply). If admin API
  calls ever move to the browser cross-origin, add that header to the allow-list.

---

## 12. Authentication architecture

Two independent auth systems, both argon2id + opaque-token-hashed-at-rest, both with peppered throttling
and audit logs:

- **Admin auth (admin-service):** 8-hour opaque session token (SHA-256 stored), `x-admin-session-token`
  header between admin app and service, host-only `growblic_admin_session` cookie between browser and
  admin app, 5-fails/15-min lockout (`ADMIN_AUTH_PEPPER`), constant-time dummy-hash path, SUPER_ADMIN
  role gate, full audit trail. Bootstrap a first admin with `pnpm admin:bootstrap[:apply]`.
- **Applicant portal auth (internship-service):** 14-day session cookie `growblic_applicant_session`,
  email+password **or** Google (PKCE) / GitHub OAuth, email verification (24 h) + password reset
  (30 min, single-use, no enumeration), 8-fails/15-min throttle (`APPLICANT_AUTH_PEPPER`). OAuth
  requires the provider email to match & be verified against the application email.

---

## 13. Payments (Razorpay) — end-to-end

1. **Order:** web (fee panel) → `POST /internship-payments/orders` → service reserves a `CREATED` row +
   access token (SHA-256 stored), calls Razorpay REST `POST /orders`, promotes to `PENDING`, returns
   `razorpayKeyId` + order id + amount. (Razorpay key must be `rzp_test_*`.)
2. **Checkout:** browser runs Razorpay checkout; on callback → `POST /internship-payments/verify` with
   `x-payment-access-token`. Service verifies the checkout HMAC (`orderId|paymentId`), re-fetches the
   gateway payment (must be `captured`), asserts amount/currency/order match, then **`settlePaid`**
   (atomic: payment→PAID, confirmation sequence, invoice, certificate→PENDING_SKILLS), then delivers the
   invoice PDF via Resend.
3. **Webhook (source of truth):** Razorpay → `POST /internship-payments/webhooks/razorpay` (raw-body
   HMAC). Idempotency key = `x-razorpay-event-id` or `sha256(rawBody)`, checked against
   `paymentWebhookEvent`; for captures, the event row is written **inside** the same `settlePaid`
   transaction. Only `payment.captured` / `order.paid` / `payment.failed` are acted on.
4. **Offer/confirmation letter:** `POST /internship-payments/:id/confirmation-letter` (or the portal's
   offer-letter routes) mints a confirmation reference and renders the letter PDF.
5. **Demo gateway (non-prod only):** ₹1 flat, explicit flag, `POST demo-sessions` → `demo-complete`
   synthesizes a captured payment through the same `settlePaid` path.

The **Razorpay webhook URL stays on `internship-service` :4000** — unchanged by the migration.

---

## 14. Certificates, PDFs & jobs lifecycle

`PENDING_SKILLS` (created at payment) → admin fills skills/dates/domain-role and marks **READY**
(`emailStatus PENDING`) → **notification-worker** generates the certificate PDF (`GENERATED`, stores
`pdfBytes` + `pdfSha256`) and emails the candidate (`EMAILED`). Admin reminders fire before completion;
failed emails retry with backoff; admins can `retry` (rate-limited) or run a `reminder-test` (env-gated,
non-prod). PDFs are generated with pdf-lib and a base64-embedded signature font; the certificate has a
public verification reference. Admin previews stream through admin-service → internship-service
`/internal/*`.

---

## 15. Environment variables (per service)

Each service has its own `.env.example`; the root `.env.example` documents the shared/frontend set.
`DATABASE_URL` (runtime) is needed by every service; `DIRECT_URL` is migration-tooling only. Names only:

- **Shared service tuning (all four, via `nest-common`):** `NODE_ENV`, `BACKEND_HOST`, `BACKEND_PORT`/`PORT`,
  `LOG_LEVEL`, `CORS_ALLOWED_ORIGINS`, `REQUEST_BODY_LIMIT`, `REQUEST_TIMEOUT_MS`, `SHUTDOWN_TIMEOUT_MS`,
  `DATABASE_READINESS_TIMEOUT_MS`, `TRUST_PROXY`, `DATABASE_URL`.
- **submissions-service:** shared set only.
- **internship-service:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`,
  `INTERNSHIP_DEMO_PAYMENT_ENABLED`/`ENABLE_DEMO_PAYMENT`, `RESEND_API_KEY`, `INVOICE_FROM_EMAIL`,
  `INVOICE_ADMIN_EMAIL`, `INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN`, `INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER`,
  `INTERNSHIP_CERTIFICATE_FROM_EMAIL`, `INTERNSHIP_CERTIFICATE_REMINDER_DAYS`, `APPLICANT_AUTH_PEPPER`,
  `ADMIN_AUTH_PEPPER`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`,
  `GOOGLE_CALLBACK_URL`/`GITHUB_CALLBACK_URL`, `FRONTEND_URL`, `PUBLIC_WEBSITE_URL`, `BACKEND_URL`,
  `NEXT_PUBLIC_API_URL`, `SMTP_*`.
- **admin-service:** `ADMIN_AUTH_PEPPER`, `INTERNSHIP_SERVICE_INTERNAL_URL`,
  `INTERNSHIP_CERTIFICATE_INTERNAL_TOKEN`, `INTERNSHIP_CERTIFICATE_TEST_MODE`,
  `INTERNSHIP_CERTIFICATE_TEST_REMINDER_MINUTES`, `INTERNSHIP_CERTIFICATE_REMINDER_DAYS`.
- **notification-worker:** `INTERNSHIP_CERTIFICATE_JOBS_ENABLED`, `INTERNSHIP_CERTIFICATE_JOB_INTERVAL_SECONDS`,
  `INTERNSHIP_CERTIFICATE_EMAIL_PROVIDER`, `INTERNSHIP_CERTIFICATE_FROM_EMAIL`,
  `INTERNSHIP_CERTIFICATE_ADMIN_EMAIL`, `INTERNSHIP_CERTIFICATE_ADMIN_BASE_URL`,
  `INTERNSHIP_CERTIFICATE_REMINDER_DAYS`, `INTERNSHIP_CERTIFICATE_TEST_MODE`,
  `INTERNSHIP_CERTIFICATE_TEST_REMINDER_MINUTES`, `RESEND_API_KEY`, `SMTP_*`.
- **Frontends:** web uses `NEXT_PUBLIC_API_URL` (→ internship-service), `NEXT_PUBLIC_SUBMISSIONS_API_URL`
  (→ submissions-service; falls back to the primary), `NEXT_PUBLIC_GROWBLIC_API_URL` (AI chat),
  `NEXT_PUBLIC_ENABLE_INTERNSHIP_DEMO_PAYMENT`/`NEXT_PUBLIC_ENABLE_DEMO_PAYMENT`. Admin uses
  `BACKEND_INTERNAL_URL` (→ admin-service, default `:4002`).

> Local `.env` / `.env.local` files are git-ignored and read directly by apps/services in dev.
> Never stage secrets; deployment platforms inject env vars. `.env.example` files are the source of
> truth for variable names.

---

## 16. Build, run, test, deploy

- **Run locally:** `pnpm dev` (all), or per-project `pnpm dev:web|dev:admin|dev:internship|dev:submissions|dev:admin-service|dev:worker`. Ports: web 3002, admin 3001, internship 4000, submissions 4001, admin-service 4002, worker 4003.
- **Build / verify:** `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm lint` (all via `nx run-many`);
  `pnpm affected` for changed-only. Current status: **11 projects build + typecheck + test green.**
- **Tests:** `node:test` (not jest). Backend services compile via `tsconfig.test.json` then run
  `node --test` over an explicit file list; pure packages use `tsx --test`;
  `pnpm test:website-submissions` runs the web api client test + submissions coverage.
- **CI:** `.github/workflows/ci.yml` runs `nx affected -t build typecheck test lint` on push/PR (uses
  `nrwl/nx-set-shas`, dummy DB URLs for postinstall prisma-generate).
- **GitHub Pages:** `.github/workflows/deploy.yml` (manual `workflow_dispatch`) builds the static web
  export (`pnpm build:pages` with `NEXT_PUBLIC_API_URL`) after gating on web + submissions-service
  typecheck and the submissions tests, then deploys `apps/web/out`.
- **Docker:** `infra/services.Dockerfile` is a parameterized multi-stage build (build via
  `nx run <service>:build`, then `pnpm --filter <service> deploy --prod`); `docker-compose.yml` brings
  up Postgres + all four services + the nginx gateway (:8080). *These files were authored during the
  migration but not yet run end-to-end — verify before relying on them.*
- **Migrations (manual only):** `pnpm prisma:migrate:deploy` (uses `DIRECT_URL`). Never in build/postinstall.
- **Operator scripts** (`scripts/`): `admin:bootstrap[:apply]` (create first SUPER_ADMIN),
  `admin:sessions:cleanup`, `auth:verify*`, `*:verify-db` DB checks, `build-github-pages.mjs` /
  `finalize-github-pages.mjs`, `check-toolchain.mjs`, `check-workspace-foundation.mjs`.

---

## 17. Conventions & gotchas (read before editing)

- **"This is NOT the Next.js you know."** `AGENTS.md`/`CLAUDE.md` pin Next.js 16.2.9 with breaking
  changes. **Read `node_modules/next/dist/docs/` before writing any Next.js code.** Heed deprecations.
- **Frontends must never import `@growblic/database`** — enforced by NX module boundaries. Frontends
  talk to services over HTTP.
- **Tests use `node:test`, not jest.** Don't add jest.
- **DB is loaded lazily** (`require("@growblic/database/client")`) and **externalized in webpack** — keep
  that pattern; don't statically `import` the client into a service's bundled path.
- **Razorpay is test-mode-locked** (`rzp_test_` required) — live keys throw today. The webhook needs the
  raw body (only `/internship-payments/webhooks/razorpay` is a `rawBodyRoutes` entry).
- **Single shared Postgres.** Money settlement uses cross-table `Serializable` transactions
  (`settlePaid` touches payment + certificate + invoice + sequence + webhook-event). Any move to
  database-per-service must redesign these around events/sagas first.
- **`/ai/chat` is not implemented.** The web chat widget calls it; no service serves it. Either build an
  AI module (in internship-service or a new service) or remove the widget.
- **Pre-existing lint issues** in web/admin UI components (react-hooks rules) predate the migration;
  services and packages lint clean.
- **`node --env-file-if-exists=.env`** is how services load env in dev; per-service `.env` are ignored.
- Idempotency everywhere: forms use `submissionKey`; invoices/emails use per-audience idempotency keys;
  webhooks use `paymentWebhookEvent`.

---

## 18. Migration history & rationale (Turbo monolith → NX microservices)

The repo was previously a **Turborepo** monorepo with two Next.js apps that talked **directly to Prisma**
plus a single NestJS "modular monolith" (`apps/backend`). It was migrated (2026-07-19) to the current
shape. What changed and why:

- **Phase 0 — cleanup:** removed stale junk (`*.backup-*` sources, `.bak` files, the empty
  `supabase/` scaffold — the DB is plain Postgres, a stale root `out/`, `package-lock.json` alongside
  the real `pnpm-lock.yaml`, build artifacts).
- **Phase 1 — Turbo → NX 23:** `nx.json`, `nx affected` CI, and the **module-boundary lint rules** with
  `scope:*` tags. Removed `turbo`.
- **Phase 2 — shared libs:** made `contracts`/`validation` buildable; extracted the backend's common
  infra into **`@growblic/nest-common`** and the internship domain/PDF/email code into
  **`@growblic/internship-shared`** (embedding the signature font as base64 to drop asset-copying).
- **Phase 3 — decouple frontends from the DB:** deleted `apps/web/src/server/*` and its form routes
  (forms now POST to submissions-service), removed dead `submitLead`/`/leads/*` calls, and **moved all of
  `apps/admin`'s server logic (auth, submissions, certificates, accounts) into the backend**, turning the
  admin app into a thin proxy. Removed `@growblic/database` from both frontends.
- **Phase 4 — split the monolith:** `apps/backend` became four services under `apps/services/*`
  (submissions, internship, admin, notification-worker). All ~66 backend tests were redistributed and
  kept green. `internship-payments` + `internship-portal` were **kept together** in one service because
  they share the payment/certificate bounded context and PDF code — splitting them would only move tight
  coupling across a network boundary.
- **Phase 5 — infra:** Dockerfile/compose/nginx gateway, per-service `.env.example`, CI, and docs.

**Rationale:** the biggest architectural debt was frontends owning DB writes (three code paths over the
same tables). The migration made the services the only DB owners, enforced that with lint, and split the
backend along real bounded contexts while accepting a **shared database** (a pragmatic stop short of full
microservices, because the Serializable cross-table money transactions don't yet have an event-driven
redesign).

---

## 19. Known follow-ups / tech debt

- **`/ai/chat`** — implement an AI service/module or remove the web chat widget.
- **Docker/compose** — authored but not yet run end-to-end; validate before production use.
- **notification-worker** — move from in-process `setInterval` to a real queue (BullMQ/Redis) when scale
  demands.
- **Database-per-service** — deferred; requires redesigning `settlePaid` and demo-completion around
  service-owned data + async messaging.
- **CMS models** (`Service`/`Product`/`PortfolioProject`/`Testimonial`/`JobOpening`/`SiteSetting`/
  `MediaAsset`) exist in the schema but have no admin UI yet (the dashboard shows "Future CMS modules").
- **web/admin lint** — pre-existing react-hooks errors to clean up.
- **Production hosting for the services** — not yet wired into CI (Pages deploys only the static site).

## 20. Recovery / rollback

- The complete pre-migration working tree is preserved in the git tag **`pre-nx-migration-backup`**.
- Reference docs in `docs/`: `NX_MICROSERVICES_ARCHITECTURE.md` (current), `DATABASE_ARCHITECTURE.md`,
  `ADMIN_AUTHENTICATION.md`, `LIVE_WEBSITE_SUBMISSIONS.md`, plus the historical
  `MONOREPO_MIGRATION_PLAN.md` / `NESTJS_BACKEND_MIGRATION_PLAN.md` / `VERCEL_DEPLOYMENT.md`.

---

*End of handoff. If you change the architecture (add a service, move a boundary, wire deployment,
implement `/ai/chat`, or split the database), update the relevant section above so this file stays the
single source of truth.*
