import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
let failed = false;

function pass(message) {
  console.log(`PASS: ${message}`);
}

function fail(message) {
  failed = true;
  console.error(`FAIL: ${message}`);
}

function requirePath(relativePath) {
  if (existsSync(join(root, relativePath))) {
    pass(`${relativePath} exists.`);
  } else {
    fail(`${relativePath} is missing.`);
  }
}

function requireAbsentPath(relativePath) {
  if (existsSync(join(root, relativePath))) {
    fail(`${relativePath} must be absent.`);
  } else {
    pass(`${relativePath} is absent.`);
  }
}

function implementationFiles(relativePath) {
  const absolutePath = join(root, relativePath);

  if (!existsSync(absolutePath)) {
    return [];
  }

  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory)) {
      const entryPath = join(directory, entry);

      if (statSync(entryPath).isDirectory()) {
        visit(entryPath);
      } else if (entry !== "README.md") {
        files.push(entryPath);
      }
    }
  };

  visit(absolutePath);
  return files;
}

for (const path of [
  "pnpm-workspace.yaml",
  "turbo.json",
  "apps/README.md",
  "apps/web/package.json",
  "apps/web/src",
  "apps/web/public",
  "apps/admin/package.json",
  "apps/admin/src/app",
  "packages/README.md",
  "packages/database/package.json",
  "packages/database/prisma.config.ts",
  "packages/database/prisma/schema.prisma",
  "packages/database/prisma/migrations/migration_lock.toml",
  "packages/contracts/package.json",
  "packages/contracts/src/index.ts",
  "packages/validation/package.json",
  "packages/validation/src/index.ts",
]) {
  requirePath(path);
}

for (const path of [
  "src",
  "public",
  "prisma",
  "prisma.config.ts",
  "apps/web/src/lib/prisma.ts",
  "apps/admin/src/lib/prisma.ts",
  "apps/web/src/generated/prisma",
]) {
  requireAbsentPath(path);
}

const workspace = readFileSync(join(root, "pnpm-workspace.yaml"), "utf8");
if (
  workspace.includes('"apps/*"') &&
  workspace.includes('"packages/*"')
) {
  pass("Workspace globs are present.");
} else {
  fail("Workspace globs are incomplete.");
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (/^pnpm@\d+\.\d+\.\d+$/.test(packageJson.packageManager ?? "")) {
  pass("packageManager pins an exact pnpm version.");
} else {
  fail("packageManager is not an exact pnpm version.");
}

for (const path of [
  "apps/web",
  "apps/admin",
  "packages/database",
  "packages/contracts",
  "packages/validation",
]) {
  if (implementationFiles(path).length > 0) {
    pass(`${path} contains an application.`);
  } else {
    fail(`${path} has no implementation files.`);
  }
}

const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
if (gitignore.includes("/packages/database/src/generated/prisma")) {
  pass("The package-local generated Prisma client is ignored.");
} else {
  fail("The package-local generated Prisma client is not ignored.");
}

const adminSource = implementationFiles("apps/admin/src")
  .filter((path) => /\.[cm]?[jt]sx?$/.test(path))
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

if (adminSource.includes("web/src/lib/prisma")) {
  fail("apps/admin still contains a cross-app Prisma bridge.");
} else {
  pass("apps/admin has no cross-app Prisma bridge.");
}

const contractsSource = implementationFiles("packages/contracts/src")
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

if (/from\s+["'](?:next|@prisma|@growblic\/database)/.test(contractsSource)) {
  fail("packages/contracts imports framework or database code.");
} else {
  pass("packages/contracts is framework-neutral and database-free.");
}

const validationSource = implementationFiles("packages/validation/src")
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

if (/from\s+["'](?:next|@prisma|@growblic\/database)/.test(validationSource)) {
  fail("packages/validation imports framework or database code.");
} else {
  pass("packages/validation is framework-neutral and database-free.");
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Workspace foundation check passed.");
}
