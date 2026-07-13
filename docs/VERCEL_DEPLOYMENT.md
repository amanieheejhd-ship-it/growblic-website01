# Growblic Vercel deployment checklist

Use this checklist after the server-backed contact form has been reviewed locally. Do not remove the old GitHub Pages site or change DNS until the Vercel deployment is verified.

## 1. Confirm repository ownership

Push the repository to the correct Growblic-owned GitHub account or organization. Before continuing, confirm that the repository owner, administrators, and Vercel integration belong to Growblic. Review all pending changes before creating the commit and do not commit `.env` or `.env.local`.

## 2. Import the project into Vercel

1. Sign in to the Growblic Vercel account.
2. Choose **Add New → Project** and import the Growblic GitHub repository.
3. Select **Next.js** as the framework preset. Vercel normally detects this automatically.
4. Set **Root Directory** to `apps/web`.

Use the repository's pinned pnpm toolchain and frozen lockfile. The web project build command is `pnpm build`; Vercel's monorepo install must run from the repository workspace so the root `postinstall` generates Prisma Client from the root schema. The build does not run database migrations.

## 3. Configure environment variables

Add both variables in **Project Settings → Environment Variables**:

- `DATABASE_URL`: the application runtime/pooler connection.
- `DIRECT_URL`: the migration-safe connection used by `prisma.config.ts`.

Copy their real values from the approved password manager or Supabase project settings. Never paste them into source files, documentation, tickets, or logs. Never prefix either variable with `NEXT_PUBLIC_`; that prefix makes values available to browser code.

Enable the variables for **Production** and **Preview**. Preview deployments can use the same database only if Growblic accepts test submissions entering production data; otherwise use a separate preview database. For local **Development**, keep values only in an ignored local environment file or configure them through `vercel env pull` after reviewing the destination file.

## 4. Handle migrations separately

Review every production migration before execution. From a trusted environment with the approved migration-safe connection configuration, run:

```bash
npx prisma migrate deploy
```

Do this as a separate controlled release step. Do not add `prisma migrate dev` or automatic migrations to the normal Vercel build command.

## 5. Deploy and verify

Trigger the first Vercel deployment and wait for the build and function deployment to finish. Verify all of the following on the generated Vercel URL:

- The homepage loads.
- `/contact` loads and remains responsive.
- `/api/health` returns `status: "ok"`.
- Images, fonts, sounds, and other static assets load without repository-prefixed 404 errors.
- A valid contact form submission shows the success message.
- The new row appears in Supabase Table Editor under `contact_enquiries`.
- Invalid contact input produces a safe validation response.

Review the deployment and function logs in Vercel if something fails. Search using request times and safe test identifiers. Do not copy database URLs, passwords, connection errors containing credentials, or other secrets into shared channels.

## 6. Roll back safely

If verification fails, use the Vercel project’s **Deployments** page to promote the last known-good deployment or roll back the affected deployment. Keep the old GitHub Pages URL available as a temporary public fallback until the Vercel version is fully verified. The legacy Pages workflow is manual-only, so normal pushes will not overwrite that fallback.

## 7. Move `growblic.com` later

After the Vercel URL has passed functional testing:

1. Add `growblic.com` and the intended `www` variant in Vercel’s domain settings.
2. Record the DNS changes Vercel requests and review the current DNS records, email records, TTLs, redirects, and rollback plan.
3. Schedule the cutover with the Growblic domain owner.
4. Change DNS only after approval; no DNS change is part of this checklist’s implementation task.
5. Verify HTTPS, canonical URLs, redirects, contact submission, and email after propagation.

Keep the GitHub Pages site available until the custom domain and Vercel deployment are stable. Disable or archive the legacy workflow permanently only after Growblic confirms the migration is complete.
