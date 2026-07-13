# Growblic database architecture

## Scope

This document describes the first database foundation for a future Growblic administration system and content management workflow. It adds administrative identity, structured content, recruitment, media, settings, and audit models without connecting them to the public website.

The existing `ContactEnquiry` model and its submission flow remain independent and unchanged.

## Prisma ownership

`packages/database` is the sole Prisma owner. It contains the schema, unchanged migration history, package-local ignored generated client, PostgreSQL adapter, and development singleton. Server code in `apps/web` and `apps/admin` imports `@growblic/database`; browser code must never import the package.

Runtime processes provide `DATABASE_URL`. Controlled Prisma migration tooling provides `DIRECT_URL`; neither value belongs in tracked files or client bundles. Root commands delegate explicitly to the database workspace:

- `pnpm prisma:format`
- `pnpm prisma:validate`
- `pnpm prisma:generate`
- `pnpm prisma:migrate:dev`
- `pnpm prisma:migrate:deploy`
- `pnpm prisma:studio`

## Models

### Administration

- `AdminUser` stores an administrator's identity, unique email, optional password hash, account status, last-login time, and lifecycle timestamps. Authentication is not implemented in this phase, and plaintext passwords must never be stored.
- `AdminRole` defines a uniquely named administrative role with an optional description.
- `AdminUserRole` joins administrators to roles. The user-and-role pair is unique so the same role cannot be assigned twice.
- `AuditLog` preserves append-only records of administrative actions, including the affected entity and optional request context. Its `metadata` JSON field is reserved for action-specific structured details that do not fit stable columns.

### Content

- `Service` stores future service entries with unique slugs, descriptions, publication status, and display order.
- `Product` stores future product entries, store and website links, publication status, display order, and an optional logo media reference.
- `PortfolioProject` stores future case-study entries, client and project details, publication timing, display order, and an optional cover image.
- `Testimonial` stores attributed customer quotations, optional rating and avatar, publication status, and display order.
- `SiteSetting` stores uniquely keyed configuration values. Values remain text and are interpreted according to `SettingValueType`; `isPublic` must be explicitly enabled before a future API may expose a setting.

### Recruitment

- `JobOpening` stores future openings with a unique slug, employment type, lifecycle status, publication and closing times, and soft-delete support.
- `JobApplication` stores an application for one opening, candidate contact details, optional resume media, and its review status. Applications are operational records and are not soft-deleted as ordinary CMS content.

### Media

- `MediaAsset` stores metadata and storage pointers for uploaded files. It does not store file bytes in PostgreSQL. The storage provider and path identify the external object, while `publicUrl` is optional because some assets may remain private.

## Relationships and delete behavior

- `AdminUser` and `AdminRole` have a many-to-many relationship through `AdminUserRole`.
- Hard deletion of an administrator or role cascades only to its role-assignment rows.
- Administrator deletion sets uploader references on `MediaAsset` and actor references on `AuditLog` to null, preserving media and audit history.
- `Product`, `PortfolioProject`, `Testimonial`, and `JobApplication` optionally reference `MediaAsset`. Hard deletion of referenced media sets those foreign keys to null.
- `JobOpening` has many `JobApplication` rows. The database restricts hard deletion of an opening while applications still reference it.

Hard deletion should remain exceptional. Application code should normally use the soft-delete policy below.

## Soft-delete policy

Editable CMS records use nullable `deletedAt` timestamps. A record is active when `deletedAt` is null. Normal administrative deletion should set this timestamp rather than remove the row.

Soft-delete applies to `AdminUser`, `Service`, `Product`, `PortfolioProject`, `Testimonial`, `JobOpening`, and `MediaAsset`. Queries in future CMS and public APIs must explicitly exclude soft-deleted rows unless restoration or audit work requires them.

`AdminRole`, `AdminUserRole`, `JobApplication`, `SiteSetting`, and `AuditLog` do not use general CMS soft deletion because they represent assignments, operational records, current keyed configuration, or history.

## Status and value enums

- `AdminUserStatus`: `ACTIVE`, `INACTIVE`, `SUSPENDED`.
- `ContentStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED` for services, products, portfolio projects, and testimonials.
- `EmploymentType`: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `TEMPORARY`.
- `JobOpeningStatus`: `DRAFT`, `OPEN`, `CLOSED`, `ARCHIVED`.
- `JobApplicationStatus`: `NEW`, `REVIEWING`, `SHORTLISTED`, `INTERVIEW`, `REJECTED`, `HIRED`, `WITHDRAWN`.
- `SettingValueType`: `STRING`, `NUMBER`, `BOOLEAN`, `JSON`. Site-setting values are stored as text and must be validated before use.

These enums prevent free-text lifecycle states and provide stable values for future APIs and administration workflows.

## Media storage approach

Media bytes belong in an approved object-storage provider, not in the application database. `MediaAsset` records the provider, unique provider/path pair, original and stored filenames, MIME type, byte size, optional public URL, alternative text, and uploader. Future upload services must validate file type and size, generate safe storage paths, and enforce private/public access separately from this schema.

## Audit logging approach

Audit records are intended to be append-only. Future administrative mutations should record the actor, action, entity type, entity ID when available, request IP and user agent when appropriate, and minimal structured metadata. Logs must not contain passwords, password hashes, access tokens, database URLs, or unnecessary personal data. Deleting an administrator must not delete their historical audit entries.

## Migration policy

- Change the schema through reviewed Prisma migrations only.
- Generate migrations with `prisma migrate dev --create-only` and inspect SQL before applying it.
- Never use `prisma db push`, reset production data, or add destructive SQL without a separately approved migration plan.
- Do not run migrations automatically during `postinstall` or application builds.
- Apply production migrations as a controlled release step with `prisma migrate deploy` after review and backup planning.
- Keep runtime access on `DATABASE_URL` and migration tooling on `DIRECT_URL`.

## Frontend freeze policy

The public frontend is frozen during this foundation phase. No existing public page, component, route, navigation behavior, asset, SEO output, styling, animation, content, or responsive behavior is connected to or changed by these models.

Public pages continue to use their existing data sources. No public API route exposes the new tables, and generated Prisma database types must remain in server-only code.

## Future phases

1. Implement admin authentication with approved password hashing, session security, authorization, and recovery controls.
2. Build the private admin dashboard with role-based access.
3. Add validated, authorized CMS APIs and consistent audit logging.
4. Migrate existing content into the new tables without replacing the current frontend data.
5. Switch public reads only after content completeness, security review, performance checks, and visual-parity testing confirm no frontend regression.
