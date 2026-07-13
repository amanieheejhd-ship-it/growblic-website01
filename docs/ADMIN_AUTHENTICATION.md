# Growblic admin authentication foundation

## Scope and threat model

This foundation protects the private `apps/admin` login and shell against password disclosure, credential enumeration, stolen database session rows, basic credential guessing, and accidental client-side exposure. It does not create public signup, password-reset flow, OAuth login, MFA, or CMS CRUD.

The public frontend remains frozen and does not link to or depend on the private authentication endpoints.

`apps/admin` is intended for `admin.growblic.com`. Its browser calls same-origin `/api/auth/*` handlers, and its root layout does not import public navigation, marketing effects, sounds, smooth scrolling, or chat. The public app exposes no `/admin` route.

## Opaque session design

Successful login generates at least 32 cryptographically random bytes and returns the opaque token only to the route handler. The browser receives it in the `growblic_admin_session` cookie. PostgreSQL stores only the token's SHA-256 hash in `admin_sessions`; raw tokens must never be logged or persisted server-side.

Sessions use a fixed eight-hour absolute expiry. Validation requires an unrevoked, unexpired session belonging to an active, non-deleted administrator. `lastSeenAt` is updated periodically for operational visibility but does not extend absolute expiry. Logout revokes the database session before clearing the browser cookie, and bulk revocation is available to future authorized workflows.

## Password hashing

Passwords use Argon2id through the `argon2` package with 19 MiB memory, two iterations, one lane, and a 32-byte hash. Verification uses Argon2's constant-time-safe implementation. Unknown, inactive, deleted, or passwordless accounts use a valid dummy Argon2id hash verification path so validly shaped login attempts receive similar password-work treatment and the public response does not identify account existence.

Plaintext passwords are accepted only transiently during login or explicit bootstrap execution. They must never be stored, returned, logged, or supplied through command-line arguments.

## Cookie settings

The admin session cookie is:

- `HttpOnly`
- `SameSite=Lax`
- `Secure` in production
- scoped to `Path=/`
- high priority
- expired at the same fixed time as the database session

Cookie access uses the asynchronous Next.js `cookies()` API exclusively in server code and route handlers.
The cookie omits `Domain`, so it remains host-only and is not shared with `growblic.com` or sibling subdomains.

## Login throttling

Each validly shaped attempt derives deterministic HMAC-SHA-256 identifiers from the normalized email and trusted client IP using `ADMIN_AUTH_PEPPER`. Neither raw attempted email nor raw IP is stored in `admin_login_attempts`.

Login is blocked for the current request when either identifier has five failed attempts during the preceding 15 minutes. A throttled response uses HTTP 429. Unknown users and incorrect passwords share the same HTTP 401 message. Malformed requests use HTTP 400. This is basic database-backed throttling; production edge rate limits and monitoring should be added as defense in depth.

## Roles and server authorization

Role names are loaded through `AdminUserRole` and `AdminRole` only after a valid server-side session check. `getOptionalAdminSession`, `requireAdminSession`, and `requireAdminRole` provide controlled server authorization primitives without redirects or client imports. API responses contain only administrator ID, email, name, role names, and session expiry; `passwordHash` and `tokenHash` are never returned.

## Audit events

- `ADMIN_LOGIN_SUCCESS` is written atomically with session creation.
- `ADMIN_LOGOUT` is written when an existing session is revoked.
- `ADMIN_SESSIONS_REVOKED` records bulk session revocation and its count.
- `ADMIN_BOOTSTRAP` is written only during an explicitly applied administrator bootstrap.

Logs must never include passwords, password hashes, raw session tokens, cookies, database URLs, the authentication pepper, or unnecessary personal data.

## Required environment variables

`ADMIN_AUTH_PEPPER` is required for deterministic login-throttling hashes. It must be a long random secret stored only in approved environment configuration. The authentication code fails closed when it is unavailable.

Administrator bootstrap additionally requires:

- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_NAME`
- `ADMIN_BOOTSTRAP_PASSWORD`

The bootstrap password must contain at least 12 characters. No default administrator or credential exists.

## Safe bootstrap procedure

1. Set the four required variables in a trusted local or production administration environment.
2. Run `npm run admin:bootstrap` first. This is a read-only dry run.
3. Review the normalized email, existing-or-new user ID indicator, and `SUPER_ADMIN` role.
4. Run `npm run admin:bootstrap:apply` only after explicit approval.
5. Confirm the safe output and corresponding `ADMIN_BOOTSTRAP` audit event.
6. Remove all bootstrap environment variables immediately after setup and rotate the bootstrap password wherever it was temporarily stored.

The apply command is idempotent: it creates or updates one normalized-email administrator, reuses the `SUPER_ADMIN` role and role assignment, and activates the account. Never place the password in a command argument or shared log.

## Logout and session validation

`POST /api/auth/logout/` is idempotent for missing or already-revoked sessions and clears the cookie. `GET /api/auth/session/` returns HTTP 401 for absent, invalid, expired, revoked, inactive, or deleted-user sessions. Login is `POST /api/auth/login/`. All authentication responses disable caching.

## Expired-session cleanup

`npm run admin:sessions:cleanup` counts sessions expired more than 30 days ago and performs no writes. After review, `npm run admin:sessions:cleanup:apply` deletes only those retained expired rows. Neither command prints session hashes.

## Current limitations and production recommendations

- There is no public signup, password-reset flow, CMS CRUD, OAuth, or social login.
- Add MFA before broad production administration access.
- Add edge-level throttling and alerting in addition to database throttling.
- Use a long random pepper and restrict access to Vercel environment settings.
- Protect Supabase and Vercel administration with strong organization controls.
- Review function logs for generic authentication failures without adding sensitive values.
- Rotate the bootstrap password after first use and remove bootstrap variables after setup.
- Add session-management and security-event views only after private admin authorization is established.

## Frontend freeze policy

No existing public page, component, layout, styling, content, animation, sound, asset, SEO output, route, or navigation behavior is connected to the private admin application. Authentication endpoints exist only in `apps/admin` under `/api/auth/*`; the public application contains no admin route or link.

## Temporary Prisma ownership

The root Prisma schema remains the single migration source. During Phase 2C, `apps/admin` imports the server-only Prisma singleton and generated client through a documented temporary bridge to `apps/web`. Phase 2D will replace this bridge with the dedicated `packages/database` workspace package. No second schema, migration history, or client generator exists.
