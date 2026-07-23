# Public User Authentication (accounts-service)

A standalone email + password login system for ordinary website visitors. It is
**fully independent** of the two existing auth systems — it shares no session
cookie, table, or route with the internship applicant portal
(`internship-service`) or admin auth (`admin-service`).

## Service

- **`apps/services/accounts-service`** (NestJS, `scope:service`), port **4004**.
- Scaffolded like `submissions-service`: `@growblic/nest-common` bootstrap
  (config, pino logging, request-context, CORS+credentials, helmet, graceful
  shutdown, global exception filter), health probes at `GET /health/live` and
  `GET /health/ready` (races `SELECT 1`). Prisma is loaded lazily via
  `require("@growblic/database/client")` and externalised in webpack — same
  pattern as every other service.
- Dev: `pnpm dev:accounts` (also included in `pnpm dev` / `pnpm dev:services`).

## Routes — `/public-auth/*` (all `Cache-Control: no-store`)

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/public-auth/register` | email + password (min 12) + optional displayName; rejects existing email (409); argon2id hash; issues session; sets cookie |
| POST | `/public-auth/login` | throttled (≥8 fails / 15 min, peppered HMAC of email AND ip); constant-time dummy-hash path for unknown users; generic error, no enumeration |
| POST | `/public-auth/logout` | revokes the current session, clears cookie |
| GET | `/public-auth/session` | current user from cookie, or 401 |
| POST | `/public-auth/forgot-password` | ALWAYS returns the same generic success; if the account exists, mints a single-use 30-min reset token and emails a link |
| POST | `/public-auth/reset-password` | validates token (unexpired, unused), sets new password, revokes ALL sessions |
| GET | `/public-auth/me` | full profile (session-guarded) |
| PATCH | `/public-auth/me` | edit displayName / fullName / phone / company (session-guarded) |

- **Session cookie:** `growblic_user_session` — HttpOnly, SameSite=Lax, Secure
  in production, host-only, ~14-day TTL. The opaque 32-byte token is stored only
  as its SHA-256. Passwords are stored only as argon2id (memory 19456, time 2,
  parallelism 1, hashLength 32 — the same params as the internship portal).
- Every register / password-reset-request / reset-complete / profile-update
  writes an `audit_logs` row (`action` prefixed `PUBLIC_USER_*`).

## Data model (new tables only — no existing table touched)

Migration `20260721120000_add_public_user_accounts`:

- `public_user_accounts` — id, email_normalized (unique), email_display,
  password_hash, display_name, full_name, phone, company, status
  (`PublicUserAccountStatus` = ACTIVE | DISABLED), failed_login_count,
  last_login_at, created_at, updated_at, deleted_at (soft-delete).
- `public_user_sessions` — token_hash (unique SHA-256), expires_at, last_seen_at,
  revoked_at, ip_address, user_agent, FK → account (cascade).
- `public_user_password_reset_tokens` — token_hash, expires_at, used_at
  (single-use), FK → account (cascade).
- `public_user_auth_attempts` — email_hash, ip_address_hash, action, successful,
  created_at (peppered throttle identifiers; raw email/ip never stored).

Apply with `pnpm prisma:migrate:deploy` (uses `DIRECT_URL`). Never `db push`,
never migrate in build/postinstall.

## Environment

`apps/services/accounts-service/.env.example` documents the full set. Beyond the
shared `nest-common` vars and `DATABASE_URL`:

- `PUBLIC_AUTH_PEPPER` — peppers the throttle-identifier HMACs. **Required in
  production.**
- `RESEND_API_KEY` + `PUBLIC_AUTH_FROM_EMAIL` — password-reset email via Resend.
  If unset, forgot-password STILL returns the generic success and logs the reset
  link server-side (dev) — the flow is never blocked by email config.
- `FRONTEND_URL` / `PUBLIC_WEBSITE_URL` — base for the reset link.

## Frontend (apps/web, HTTP-only)

- `NEXT_PUBLIC_ACCOUNTS_API_URL` points the web app at accounts-service (falls
  back to `NEXT_PUBLIC_API_URL` if unset, like the submissions origin).
- Pages: `/login`, `/register`, `/forgot-password`, `/reset-password` (reads
  `?token=`), `/account` (session-guarded). The navbar **LOG IN** button links to
  `/login` (this public login — not the internship portal).

## Running locally (dev) — the exact recipe

The public login UI (`/register`, `/login`, `/account`) talks to accounts-service
over HTTP. If accounts-service is **not running on port 4004**, the browser
`fetch` is refused and the UI shows **"Cannot reach the accounts service. Please
try again in a moment."** — this is a network/connection error, not a bug in the
page. The fix is to have the service up. To bring up everything needed:

1. **Postgres must be reachable.** The service `.env` `DATABASE_URL` points at it
   (the dev default is the shared Supabase pooler; `docker compose up postgres`
   also works if you repoint `DATABASE_URL`). The migration
   `20260721120000_add_public_user_accounts` must be applied — run it once with
   `pnpm prisma:migrate:deploy` (never in build). `GET :4004/health/ready`
   returns `{"dependencies":{"database":"ready"}}` when both are satisfied.

2. **Start accounts-service on 4004.** Any of:
   - `pnpm dev:accounts` — just this service, or
   - `pnpm dev:services` — all backend services (includes accounts-service), or
   - `pnpm dev` — everything (all apps + services).

   Starting services *individually* is the usual way this breaks: bringing up
   internship (4000) / submissions (4001) / admin (4002) but forgetting
   accounts (4004) leaves `/register` unable to reach the service. Prefer
   `pnpm dev:services` (or `pnpm dev`) so 4004 always comes up with the rest.

3. **Start the web app.** `pnpm dev:web` serves apps/web on **http://localhost:3002**
   (`next dev -p 3002`).

### Required env

- **accounts-service** (`apps/services/accounts-service/.env`): `DATABASE_URL`
  and `PUBLIC_AUTH_PEPPER` are the minimum to boot/operate;
  `CORS_ALLOWED_ORIGINS` must include the web origin (`http://localhost:3002`).
  In development the bootstrap also allows a built-in local origin set
  (`localhost:3002/3001` + `127.0.0.1` variants) with `credentials: true`, so the
  browser's credentialed calls and CORS preflight succeed out of the box.
- **apps/web** (`apps/web/.env.local`): `NEXT_PUBLIC_ACCOUNTS_API_URL=http://localhost:4004`.
  When unset it falls back to `NEXT_PUBLIC_API_URL` (the single-origin gateway
  where nginx routes `/public-auth/*` → accounts-service). For local dev with no
  gateway running, set it explicitly to `http://localhost:4004`.

On the first accounts call in the browser, dev logs the resolved base once:
`[accounts] API base → http://localhost:4004 …`. If that line shows the wrong
origin (or the port has nothing listening — check
`curl http://localhost:4004/health/ready`), that is the "cannot reach" cause.

## Gateway / Docker

`infra/gateway/nginx.conf` routes `/public-auth/*` → accounts-service:4004;
`docker-compose.yml` runs the service on 4004. `/internal/*` has no public
surface here.

## Internal SSO bridge (accounts → internship portal)

A deliberate, token-authenticated exception to the "share no session" rule
above: a **logged-in public user** can open the internship applicant portal
without a second login **iff their public account email already owns an
internship applicant account**. The two auth systems still keep separate
cookies, tables, and login flows — the bridge only mints a *normal* internship
session for the matched applicant; it never merges the systems or shares a
cookie.

**Flow**

1. Browser (public user, holding `growblic_user_session`) clicks **Internship**
   in the navbar profile menu → `POST /internship-portal/auth/sso-from-public`
   on internship-service (`credentials: "include"`, so the public cookie rides
   along).
2. internship-service reads the `growblic_user_session` token and asks
   accounts-service **server-to-server**: `GET /internal/public-user-identity`
   with headers `x-public-identity-internal-token` (shared secret) and
   `x-public-session-token` (the opaque public token). accounts-service
   validates the session and returns `{ authenticated, id, emailNormalized }`.
3. internship-service looks up an `InternshipApplicantAccount` whose
   `emailNormalized` **equals** that verified email. If exactly one exists and is
   `ACTIVE`, it mints a normal applicant session (same `growblic_applicant_session`
   cookie, 14-day TTL, SHA-256-stored token) and writes an
   `APPLICANT_SSO_FROM_PUBLIC` audit row (with both the applicant id and the
   public user id). Otherwise `linked: false` — **nothing is created or minted**,
   and the portal shows its normal login.

**Safety properties**

- The matched email is **derived server-side from the validated public session
  only** — the browser sends no email and cannot influence which account is
  targeted. A public session can therefore only ever reach the internship
  account matching *its own* email.
- No matching (or non-`ACTIVE`) internship account ⇒ no session minted.
- The internal endpoint requires the shared token, **constant-time compared**,
  fails **closed** (503 when unset, 401 on mismatch), and is **blocked at the
  public gateway** (`/internal/* → 403`). Cross-service calls use the private
  service DNS name and never traverse nginx.
- Rate-limited and audited like every other auth entrypoint
  (`SSO_FROM_PUBLIC` auth-attempt action + `APPLICANT_SSO_FROM_PUBLIC` audit).

> **Security dependency — email verification.** The bridge trusts that a public
> account's email is genuinely owned by that user. The accounts-service does
> **not** verify email ownership at registration, so today the bridge's safety
> reduces to "whoever controls a public account with email X can reach the
> internship account with email X." Before enabling this in production, require
> verified public emails (add an `emailVerifiedAt` gate to the internal identity
> lookup) or an explicit user-initiated link step. Until then, treat the bridge
> as a convenience for trusted/dev environments.

**Environment**

- `PUBLIC_IDENTITY_INTERNAL_TOKEN` — the shared secret. Set to the **same**
  value on **both** accounts-service and internship-service. Unset on either side
  disables the bridge (accounts returns 503; internship falls back to normal
  login).
- `ACCOUNTS_SERVICE_INTERNAL_URL` (internship-service) — base URL for the
  internal call (default `http://localhost:4004`; compose uses
  `http://accounts-service:4004`).

The frontend `bridgeIntoInternshipPortal()` (in `apps/web/src/lib/accounts.ts`)
calls the endpoint against the internship origin (`NEXT_PUBLIC_API_URL`) and
always navigates to `/internship-portal` afterward — the portal then shows the
dashboard (if a session was minted) or its normal login.
