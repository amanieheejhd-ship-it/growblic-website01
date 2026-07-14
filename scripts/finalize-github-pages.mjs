import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = join(process.cwd(), "apps/web/out");
const publicDirectory = join(process.cwd(), "apps/web/public");
const basePath = "/growblic-website01";
const endpoint = process.env.NEXT_PUBLIC_WEBSITE_SUBMISSIONS_URL?.trim();
const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);
const forbiddenPublicMarkers = [
  "postgresql://",
  "DATABASE_URL",
  "DIRECT_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_AUTH_PEPPER",
  "ADMIN_BOOTSTRAP_PASSWORD",
];

if (!endpoint || !endpoint.startsWith("https://")) {
  throw new Error("The public Edge Function URL is missing from the static build.");
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(path) : [path];
    }),
  );
  return nested.flat();
}

const publicEntries = await readdir(publicDirectory, { withFileTypes: true });
const publicPaths = publicEntries.map((entry) =>
  entry.isDirectory() ? `/${entry.name}/` : `/${entry.name}`,
);
const outputFiles = await filesUnder(outputDirectory);

for (const file of outputFiles) {
  const extension = file.slice(file.lastIndexOf("."));
  if (!textExtensions.has(extension)) continue;

  let content = await readFile(file, "utf8");

  for (const publicPath of publicPaths) {
    const escaped = publicPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reference = new RegExp(`(["'(=])${escaped}`, "g");
    content = content.replace(reference, `$1${basePath}${publicPath}`);

    if (reference.test(content)) {
      throw new Error(`An unprefixed public asset reference remains in ${file}.`);
    }
  }

  for (const marker of forbiddenPublicMarkers) {
    if (content.includes(marker)) {
      throw new Error(`A forbidden server-only marker was found in ${file}.`);
    }
  }

  await writeFile(file, content, "utf8");
}

const indexHtml = await readFile(join(outputDirectory, "index.html"), "utf8");
if (!indexHtml.includes(`${basePath}/_next/`)) {
  throw new Error("The GitHub Pages base path is missing from Next.js assets.");
}
if (!indexHtml.includes(`${basePath}/images/`)) {
  throw new Error("The GitHub Pages base path is missing from public assets.");
}

const bundleContainsEndpoint = await Promise.all(
  outputFiles
    .filter((file) => file.endsWith(".js"))
    .map(async (file) => (await readFile(file, "utf8")).includes(endpoint)),
);
if (!bundleContainsEndpoint.some(Boolean)) {
  throw new Error("The public Edge Function URL was not included in the static client bundle.");
}

if (!(await stat(join(outputDirectory, "sitemap.xml"))).isFile()) {
  throw new Error("The static sitemap was not generated.");
}

await writeFile(join(outputDirectory, ".nojekyll"), "", "utf8");
