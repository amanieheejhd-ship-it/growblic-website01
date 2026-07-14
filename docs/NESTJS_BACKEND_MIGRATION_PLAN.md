# NestJS backend migration plan

Status: Phase 2G-A planning complete; implementation not started
Plan date: 2026-07-14
Planning baseline: `6bfcc00c15347c673981498c86277d25549f1926`
Rollback tag before backend work: `pre-nestjs-backend-2026-07-13`

## 1. Decision summary

Growblic should introduce one deployable NestJS application at `apps/backend`. It should begin as a modular monolith and serve as the API edge for the domains it owns. Do not create a separate API-gateway process, network microservices, service-specific databases, queues, Redis, or an event bus during Phase 2G.

The migration must be incremental:

1. Establish a production-safe NestJS foundation without moving business behavior.
2. Move public submission writes one bounded domain at a time.
3. Move admin submission reads and status mutations behind the existing admin same-origin boundary.
4. Move admin authentication only after the submission paths are stable.
5. Remove old Next.js server implementations only after contract, security, data, and rollback gates pass.

The browser-facing URLs and response contracts must remain stable throughout. `apps/web` and `apps/admin` should initially retain thin same-origin route handlers that forward to the backend. This avoids public-site changes, cross-origin browser requests, parent-domain cookies, and a high-risk all-at-once traffic switch.

Phase 2G-A creates this document only. It does not install NestJS, scaffold `apps/backend`, change dependencies or lockfiles, add source code, change the database, deploy, push, or begin Phase 2G-B.

## 2. Baseline and invariants

The plan is based on the following clean repository state:

- Node.js `v22.23.1` and pnpm `11.4.0` are the pinned local toolchain.
- `main`, `origin/main`, and `HEAD` are all at `6bfcc00c15347c673981498c86277d25549f1926` before this planning commit.
- `apps/web` is the frozen public Next.js application.
- `apps/admin` is a separate private Next.js application with a host-only opaque admin-session cookie.
- `packages/database` is the sole owner of the Prisma schema, migrations, generated client, and runtime singleton.
- `packages/contracts` contains framework-neutral request and response types.
- `packages/validation` contains pure input normalization and validation.
- Public forms already persist to PostgreSQL.
- Admin authentication, protected submission lists, dashboard counts, status mutations, and audit records already work in `apps/admin`.
- No NestJS application or microservice exists.

The following invariants apply to every implementation stage:

- Do not redesign or otherwise change the frozen public website.
- Do not change public form fields, success/error behavior, status codes, or current browser-facing paths during migration.
- Do not expose Prisma types or server-only packages to browser code.
- Do not duplicate, rewrite, or split Prisma migration history.
- Do not run database migrations in install, build, or application startup commands.
- Do not widen the admin cookie to `.growblic.com`.
- Do not log credentials, cookies, session tokens, hashes, database URLs, full request bodies, or submission PII.
- Do not permit an unauthenticated or unauthorized admin operation.
- Do not combine backend scaffolding, domain migration, schema changes, and traffic cutover in one commit.
- Do not remove a working Next.js implementation until its replacement passes the applicable gates and rollback has been exercised.

## 3. Current server-boundary inventory

### 3.1 Public web boundary

`apps/web` currently owns these Node.js route handlers:

| Browser-facing route | Method | Current responsibility |
| --- | --- | --- |
| `/api/health/` | `GET` | Public web-process health response |
| `/api/contact/` | `POST` | Contact validation, anti-spam behavior, persistence, safe response |
| `/api/quote-requests/` | `POST` | Project and price-calculator request persistence |
| `/api/meeting-requests/` | `POST` | Meeting request persistence |
| `/api/careers/applications/` | `POST` | Career application persistence |
| `/api/internships/applications/` | `POST` | Internship application persistence |

These handlers use `@growblic/validation`, `@growblic/contracts` where applicable, and `@growblic/database`. Body-size limits, honeypot handling, generic failures, `no-store`, and exact successful responses are compatibility requirements, not implementation details that may drift.

### 3.2 Private admin boundary

`apps/admin` owns:

- same-origin login, logout, and session endpoints;
- a host-only `growblic_admin_session` cookie;
- password verification, rate limiting, opaque token hashing, session rotation/expiry behavior, and revocation;
- page and API authorization, currently requiring `SUPER_ADMIN` for submission management;
- dashboard summary counts;
- paginated, searchable, status-filtered lists for contact messages, project requests, price-calculator leads, meetup requests, career applications, and internship applications;
- status mutations coupled transactionally to append-only audit-log creation.

The existing browser-facing admin API paths must remain stable while ownership moves:

| Route group | Methods |
| --- | --- |
| `/api/auth/login/`, `/api/auth/logout/`, `/api/auth/session/` | `POST`, `POST`, `GET` |
| `/api/dashboard/summary/` | `GET` |
| `/api/contact-messages/` and `/api/contact-messages/[id]/` | `GET`, `PATCH` |
| `/api/project-requests/` and `/api/project-requests/[id]/` | `GET`, `PATCH` |
| `/api/price-calculator-leads/` and `/api/price-calculator-leads/[id]/` | `GET`, `PATCH` |
| `/api/meetup-requests/` and `/api/meetup-requests/[id]/` | `GET`, `PATCH` |
| `/api/career-applications/` and `/api/career-applications/[id]/` | `GET`, `PATCH` |
| `/api/internship-applications/` and `/api/internship-applications/[id]/` | `GET`, `PATCH` |

Admin list responses must continue to expose only explicit safe fields. Pagination remains bounded, queries remain newest-first, long text remains summarized, responses remain `no-store`, and status changes remain audited in the same database transaction.

### 3.3 Data ownership

The initial backend will use the existing PostgreSQL database and `@growblic/database`. Relevant module groupings are:

| Nest module | Existing models |
| --- | --- |
| Auth | `AdminUser`, `AdminRole`, `AdminUserRole`, `AdminSession`, `AdminLoginAttempt` |
| Leads | `ContactEnquiry`, `QuoteRequest`, `MeetingRequest` |
| Careers | `JobOpening`, `JobApplication`, `CareerApplication` |
| Internships | `InternshipApplication` |
| Content | `Service`, `Product`, `PortfolioProject`, `Testimonial` |
| Media | `MediaAsset` |
| Audit | `AuditLog` |
| Settings | `SiteSetting` |

This grouping is a code-ownership boundary only. It does not authorize a schema split or make every module an independently deployable service.

## 4. Target architecture

```text
Browser
  |-- growblic.com/api/* ------------> apps/web same-origin adapters
  |                                      |
  |-- admin.growblic.com/api/* ------> apps/admin same-origin BFF
                                         |
                                         v
                               apps/backend (NestJS)
                               |-- health/observability
                               |-- auth
                               |-- leads
                               |-- careers
                               |-- internships
                               |-- content (deferred behavior)
                               |-- media (deferred behavior)
                               |-- audit
                               `-- settings (deferred behavior)
                                         |
                                         v
                               @growblic/database
                                         |
                                         v
                                      PostgreSQL
```

`apps/backend` is both the stable backend API edge and the modular application. A separate `apps/api-gateway` would add another deployment, trust boundary, timeout/retry layer, health surface, and failure mode without a current scaling or ownership requirement. Reconsider a separate gateway only after independently deployed services exist and a concrete edge concern cannot be handled safely in the single backend or existing BFFs.

### 4.1 Dependency rules

- Backend controllers may depend on application services and framework-neutral contracts, never directly on Prisma.
- Domain services may depend on domain repositories and pure validation.
- Repository adapters are the only module layer that may use `@growblic/database` and Prisma-specific input types.
- Modules must not query another module's tables through ad hoc Prisma calls. Cross-domain operations go through an exported application service.
- `@growblic/contracts` and `@growblic/validation` must remain free of NestJS, Next.js, Prisma, environment, and secret imports.
- Do not create generic `common`, `utils`, configuration, logging, or security packages until at least two genuine consumers and a stable API exist.
- Avoid circular module imports and `forwardRef`; a cycle indicates that ownership or orchestration needs redesign.

### 4.2 API namespaces

The backend should expose explicit namespaces rather than inherit frontend filesystem paths:

- `/health/live` for process liveness only;
- `/health/ready` for dependency readiness with a bounded database check;
- `/v1/public/...` for unauthenticated public submission commands;
- `/v1/admin/auth/...` for authentication/session commands;
- `/v1/admin/submissions/...` for protected admin reads and mutations.

The Next.js adapters preserve current external URLs and map them to these internal routes. Do not expose an unstable Nest route directly to browser code during migration. API versioning is path-based; breaking changes require a new version rather than silent drift.

## 5. Contract and compatibility strategy

Before moving a route, record its method, accepted content type, maximum body size, normalization, honeypot behavior, field errors, status codes, headers, and response body. Add executable contract fixtures for successful, malformed, oversized, spam, unauthorized, forbidden, not-found, invalid-status, and backend-failure cases as applicable.

The source of truth is the current behavior plus types in `@growblic/contracts` and validators in `@growblic/validation`. Nest DTO classes must not become the shared contract source. If Nest runtime metadata requires adapter DTOs, keep those classes inside `apps/backend` and prove that their accepted values match the shared validators.

The first backend endpoints should return the existing response shapes. Adapters must forward only an allowlist of headers and must apply bounded upstream timeouts. They must not forward arbitrary client headers, internal service credentials, upstream stack traces, or raw upstream error bodies.

Use an idempotency strategy before retrying writes. Until an idempotency key and storage policy are designed and tested, the BFF must not automatically retry a timed-out `POST` or `PATCH`, because a committed write could be duplicated or a status mutation could be replayed.

## 6. Authentication and trust-boundary plan

Keep the browser session same-origin to `apps/admin` throughout Phase 2G:

1. The browser sends the host-only, `HttpOnly`, secure-in-production cookie only to `apps/admin`.
2. The admin BFF extracts the opaque token server-side and passes it to `apps/backend` over TLS in a dedicated authorization header.
3. The backend hashes and validates that token against `AdminSession`, checks expiry/revocation and active-user status, loads roles, and authorizes the requested operation.
4. The backend never returns the opaque token in an admin API response body.
5. The BFF strips the authorization header and all internal headers from the browser response.

When authentication ownership moves, login should be handled by the backend auth module, which returns the newly created opaque token only across the protected server-to-server hop. The BFF sets the existing cookie with unchanged attributes. Logout sends the token to the backend for transactional revocation/audit, then clears the cookie even if revocation fails. Session inspection continues to return only the existing safe session/user response.

Do not trust identity headers such as user ID or role merely because they came from a Next.js deployment. Authorization must be derived from the session in the backend. Protect the BFF-to-backend path with deployment-level private networking where available and a rotatable service credential stored only in deployment secret stores. The user session remains independently required for admin endpoints; a service credential alone grants no admin identity.

Before auth cutover, threat-model and test cookie fixation, CSRF, origin validation for state-changing admin requests, brute-force controls, token leakage, proxy header trust, logout failure, session expiry, concurrent requests, and clock skew. Preserve generic login errors and existing audit semantics.

## 7. Implementation sequence after Phase 2G-A

Each stage requires a separate approval and reviewable commit series. Completing this plan does not authorize any stage below.

### Phase 2G-B: backend foundation

Create only the minimum `apps/backend` NestJS application and workspace integration:

- pin exact compatible NestJS package versions after reviewing their Node 22 support and release notes;
- add build, dev, start, lint, typecheck, and test tasks compatible with pnpm and Turbo;
- extend the existing Node TypeScript and ESLint configuration without weakening rules;
- add typed, fail-fast environment parsing local to the backend;
- add structured logging with redaction and request correlation;
- add graceful shutdown, bounded request/body limits, a global safe error mapper, and validation policy;
- add liveness and readiness endpoints;
- connect to `@growblic/database` without changing its schema or migration ownership;
- add no business endpoints and route no production traffic.

Exit gate: frozen install, backend lint/typecheck/unit/build, root Turbo build, health tests, shutdown test, database readiness failure test, dependency/secret scan, and clean diff all pass. Neither existing Next app changes behavior.

### Phase 2G-C: public leads pilot

Move one low-complexity public write first, recommended `POST /api/contact/`:

1. Add the corresponding `/v1/public/...` controller, application service, and repository adapter.
2. Reuse the current shared validation and response contract.
3. Run the existing Next and Nest implementations against isolated test databases with identical fixtures.
4. Change the web route handler into a bounded thin adapter behind a server-side feature flag.
5. Deploy to preview, then a controlled canary if the hosting platform supports it.
6. Compare response and database effects without duplicating production writes.
7. Retain an immediate switch back to the local Next implementation.

After the pilot is stable, move quote/project and price-calculator submissions together because they share `QuoteRequest` classification rules, then meeting requests. Move careers and internships separately after their distinct application statuses and field rules pass parity.

Exit gate for each route: contract fixtures, malformed/oversized/spam cases, persistence count, safe logs, timeout/failure behavior, concurrency test, and public UI submission test pass. No browser-facing URL or response changes.

### Phase 2G-D: admin submission reads

Move read-only admin behavior before mutations:

- dashboard summary;
- contact messages;
- project requests and price-calculator classification;
- meetup requests;
- career applications;
- internship applications.

Preserve `SUPER_ADMIN` authorization, safe-field selects, pagination bounds, status filters, normalized search length, newest-first ordering, message summaries, ISO timestamps, generic errors, and `no-store`. The admin BFF remains the only browser-facing endpoint.

Exit gate: unauthenticated `401`, unauthorized `403`, malformed query `400`, safe-field allowlist, numeric counts, stable classification totals, page-boundary behavior, no-store headers, and database-query performance all pass.

### Phase 2G-E: admin status mutations and audit

Move each `PATCH` only after its matching list is stable. Preserve per-model allowed statuses and strict CUID validation. The status update and `AuditLog` insert must remain one database transaction. A failed audit insert must roll back the status change. Do not add delete or bulk endpoints.

Exit gate: invalid ID/status, unauthorized role, not found, successful transition, no-op transition policy, concurrent update behavior, forced audit failure rollback, and safe response/log checks pass using clearly synthetic records only.

Before implementation, decide whether same-status requests are rejected, accepted without a new audit row, or treated as an audited action. Record and contract-test the selected behavior; do not let framework migration change it accidentally.

### Phase 2G-F: admin authentication

Move login, session validation, logout, login-attempt limiting, session lifecycle, and auth audits into the backend auth module. Keep cookie creation/deletion in the admin BFF. Preserve Argon2 parameters, pepper ownership, generic failures, trusted proxy rules, session duration, last-seen throttling, and audit events unless a separately reviewed security change is approved.

Exit gate: the complete existing auth integration suite plus fixation, expiry, revocation, rate-limit, role, cookie-attribute, proxy-header, CSRF/origin, backend-unavailable, and redacted-log tests pass.

### Phase 2G-G: cleanup and ownership enforcement

Only after all migrated routes are stable:

- delete superseded Next.js business services and repositories, leaving thin BFF adapters where same-origin behavior is intentional;
- remove direct `@growblic/database` imports from `apps/web` and `apps/admin` when no remaining local responsibility needs them;
- enforce dependency boundaries in ESLint and CI;
- update deployment and operations documentation;
- remove temporary feature flags after the agreed rollback window;
- retain shared contracts/validation and the single Prisma migration owner.

Do not extract microservices in this stage.

## 8. Observability and operations

The foundation must be operable before it owns writes:

- Emit structured JSON logs with timestamp, level, service, environment, request ID, route template, method, status, duration, and a stable error code.
- Redact authorization, cookie, password, token, hash, database connection, and sensitive form fields recursively.
- Do not log request/response bodies for public submissions or admin APIs.
- Accept an allowlisted inbound correlation ID or generate one; return it in a safe response header.
- Record request rate, latency, error rate, timeout rate, database-pool saturation, login failures, and submission outcomes without PII labels.
- Separate liveness from readiness. Liveness must not depend on PostgreSQL; readiness must fail quickly when required dependencies are unavailable.
- Configure bounded server, upstream, database, and graceful-shutdown timeouts. The BFF timeout must exceed the backend's own request deadline by a small margin.
- Alert on sustained server errors, readiness failures, authentication anomalies, and pool exhaustion. Do not alert on individual customer content.

The backend deployment must use at least two healthy instances before production traffic if the platform and budget permit. Confirm that aggregate Prisma connection pools across web, admin, backend, previews, and migration tooling remain within Supabase limits during coexistence.

## 9. Environment and deployment ownership

Use server-only variables; exact names should be selected during Phase 2G-B and documented in an example file containing placeholders only.

| Owner | Responsibility |
| --- | --- |
| `apps/backend` | runtime database URL, auth pepper after auth migration, internal service credential verification, environment/port/log settings |
| `apps/web` | backend origin and server-side service credential while public BFF adapters exist |
| `apps/admin` | backend origin, server-side service credential, auth pepper only until auth ownership moves |
| controlled migration job | direct migration URL only |

Never prefix these values with `NEXT_PUBLIC_`. Backend origins must be allowlisted and HTTPS in non-local environments. Separate preview and production credentials. Rotation must allow an overlap window for old/new internal credentials without weakening user-session checks.

Deploy in this order: database migration job when a reviewed migration exists, backend, web/admin adapters, then traffic flag. A backend deployment must be backward-compatible with currently deployed adapters; remove old contract support only after all callers have moved.

## 10. Test and validation matrix

Every migration commit runs the smallest relevant set plus the root regression gates. The final command names may be added only during implementation, but coverage must include:

| Area | Required evidence |
| --- | --- |
| Toolchain | exact Node/pnpm check; frozen lockfile install |
| Static quality | affected lint, all workspace typechecks, `git diff --check` |
| Builds | backend build, admin build, web build, root Turbo build |
| Unit | validation, service decisions, error mapping, redaction, auth guards |
| Integration | Nest HTTP endpoints with isolated PostgreSQL; transaction and repository behavior |
| Contract | current Next response versus Nest response for shared fixtures |
| Security | authn/authz, body limits, safe errors, header filtering, CSRF/origin, secret and PII log checks |
| Database | Prisma validate/generate/status; read-only counts/status distributions; no unexpected migration |
| Public regression | route/asset parity and all six public form flows |
| Admin regression | page protection, login/session/logout, lists, filters, pagination, counts, mutations, audits |
| Failure | backend unavailable, database unavailable, timeout, graceful shutdown, partial transaction failure |
| Performance | representative list/search latency and public write concurrency without pool exhaustion |

Synthetic tests must use unmistakable identifiers and clean up only records they created. Read-only verifiers print counts and status distributions, never PII. Tests must receive secrets through hidden environment input and must not print them.

## 11. Cutover and rollback

Each migrated capability has an independently controlled server-side routing flag in its owning Next.js adapter. Do not place backend selection in browser code. Default the flag to the proven implementation and fail closed for admin operations.

For public writes, do not silently fall back to the old implementation after an ambiguous backend timeout: the backend may already have committed. Return the established safe failure and investigate by request ID unless idempotency makes retry demonstrably safe. A pre-request connection failure may use a deliberately designed fallback only if tests prove it cannot duplicate writes.

Rollback steps for a domain:

1. Stop new traffic to the Nest endpoint by changing the server-side adapter flag or promoting the last known-good frontend deployment.
2. Keep the backend and database intact for investigation; do not reset data or reverse an applied migration automatically.
3. Verify counts and audit continuity with read-only tools.
4. Redeploy the prior immutable backend if the fault is in a backward-compatible backend release.
5. Record the incident and add a regression test before attempting cutover again.

Rollback is a traffic and application-version operation. Database rollback requires its own reviewed forward-fix plan; never delete migrations or use `prisma db push`/reset as recovery.

## 12. Security acceptance checklist

Before any production ownership transfer, confirm:

- all admin routes authenticate and authorize in the backend, not only in the BFF or UI;
- the internal service credential alone cannot impersonate an administrator;
- public endpoints expose commands only, never enquiry lists or internal records;
- body size, content type, pagination, search, identifiers, and enum values are bounded and validated;
- errors expose no Prisma details, stack traces, credentials, tokens, or deployment internals;
- responses contain only allowlisted fields;
- status changes and authentication events retain required audit behavior;
- no delete or bulk mutation was introduced;
- no direct browser access to Prisma or the backend admin namespace exists;
- cookies remain host-only, `HttpOnly`, `SameSite=Lax` unless the reviewed CSRF design requires a stronger setting, `Path=/`, and `Secure` in production;
- CORS is denied by default; any exception names exact origins and never combines wildcard origin with credentials;
- logs, traces, metrics, and alerts contain no unnecessary PII or secrets;
- dependencies and container/runtime artifacts pass vulnerability and license review under the project's agreed policy.

## 13. Deferred decisions and explicit non-goals

The following are not part of Phase 2G-A and must not be smuggled into the foundation:

- microservice extraction or a separate API-gateway deployment;
- database-per-service or PostgreSQL-schema-per-service;
- Kafka, RabbitMQ, Redis, background jobs, event sourcing, or CQRS;
- GraphQL or a public developer API;
- CMS content, media uploads, or settings behavior beyond module placeholders required for clear ownership;
- database schema changes unrelated to a migrated contract;
- public UI redesign, field changes, or new admin features;
- DNS, production-domain, or provider migration;
- automatic retries for non-idempotent writes;
- deployment or push without separate approval.

Service extraction may be reconsidered only when one module has stable ownership and contracts, independent release or scaling needs, observability, failure handling, and an explicit data/migration ownership plan. Until then, an in-process module boundary is the safer architecture.

## 14. Phase 2G completion criteria

Phase 2G is complete only when:

- one NestJS modular backend owns all approved public submission, admin submission, and admin authentication behavior;
- all current browser-facing URLs and approved contracts remain compatible;
- `apps/web` and `apps/admin` retain only intentional same-origin presentation/BFF responsibilities;
- the backend is observable, securely configured, independently deployable, and covered by failure tests;
- `packages/database` remains the sole Prisma and migration owner;
- direct database access has been removed from frontend applications wherever no local server responsibility remains;
- authentication, authorization, audit, safe-field, and no-PII-log requirements pass;
- frozen public UI parity and admin functional regression suites pass;
- rollback has been exercised for every traffic class;
- temporary flags and duplicate implementations are removed after the rollback window;
- no premature network microservices or second gateway have been created.

## 15. Exact next action

After this document is reviewed and committed as the only Phase 2G-A artifact, stop. Do not install NestJS or create backend files. Phase 2G-B may begin only after explicit approval of the architecture, endpoint migration order, authentication trust boundary, deployment target, environment ownership, and rollback approach documented here.
