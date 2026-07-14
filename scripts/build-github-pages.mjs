import { spawnSync } from "node:child_process";

const endpoint = process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL?.trim();

if (!endpoint || !endpoint.startsWith("https://")) {
  throw new Error(
    "NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL must be an HTTPS Supabase Edge Function URL.",
  );
}

function run(command, args, extraEnvironment = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: { ...process.env, ...extraEnvironment },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(
  "pnpm",
  ["--filter", "@growblic/web", "build"],
  { GITHUB_PAGES: "true" },
);
run("pnpm", [
  "exec",
  "tsx",
  "--tsconfig",
  "apps/web/tsconfig.json",
  "scripts/generate-static-sitemap.ts",
]);
run("node", ["scripts/finalize-github-pages.mjs"]);
