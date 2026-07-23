import { existsSync, readFileSync, readdirSync } from "node:fs";
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
  const ignoredDirectories = new Set([
    ".next",
    ".turbo",
    "coverage",
    "generated",
    "node_modules",
    "out",
  ]);
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
        continue;
      }

      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.name !== "README.md") {
        files.push(entryPath);
      }
    }
  };

  visit(absolutePath);
  return files;
}

for (const path of [
  "pnpm-workspace.yaml",
  "nx.json",
  "apps/README.md",
  "apps/web/package.json",
  "apps/web/src",
  "apps/web/public",
  "apps/admin/package.json",
  "apps/admin/src/app",
  "apps/services/submissions-service/package.json",
  "apps/services/submissions-service/src/main.ts",
  "apps/services/submissions-service/src/modules/health/health.module.ts",
  "apps/services/admin-service/package.json",
  "apps/services/admin-service/src/main.ts",
  "apps/services/internship-service/package.json",
  "apps/services/internship-service/src/main.ts",
  "apps/services/notification-worker/package.json",
  "apps/services/notification-worker/src/main.ts",
  "packages/README.md",
  "packages/database/package.json",
  "packages/database/prisma.config.ts",
  "packages/database/prisma/schema.prisma",
  "packages/database/prisma/migrations/migration_lock.toml",
  "packages/contracts/package.json",
  "packages/contracts/src/index.ts",
  "packages/validation/package.json",
  "packages/validation/src/index.ts",
  "packages/typescript-config/package.json",
  "packages/typescript-config/nextjs.json",
  "packages/eslint-config/package.json",
  "packages/eslint-config/next.mjs",
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
  "packages/config",
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
  "apps/services/submissions-service",
  "apps/services/admin-service",
  "apps/services/internship-service",
  "apps/services/notification-worker",
  "packages/database",
  "packages/contracts",
  "packages/validation",
  "packages/typescript-config",
  "packages/eslint-config",
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

for (const [path, preset] of [
  ["apps/web/tsconfig.json", "@growblic/typescript-config/nextjs.json"],
  ["apps/admin/tsconfig.json", "@growblic/typescript-config/nextjs.json"],
  ["apps/services/submissions-service/tsconfig.json", "@growblic/typescript-config/node.json"],
  ["apps/services/admin-service/tsconfig.json", "@growblic/typescript-config/node.json"],
  ["apps/services/internship-service/tsconfig.json", "@growblic/typescript-config/node.json"],
  ["apps/services/notification-worker/tsconfig.json", "@growblic/typescript-config/node.json"],
  ["packages/database/tsconfig.json", "@growblic/typescript-config/node.json"],
  ["packages/contracts/tsconfig.json", "@growblic/typescript-config/library.json"],
  ["packages/validation/tsconfig.json", "@growblic/typescript-config/library.json"],
]) {
  const config = JSON.parse(readFileSync(join(root, path), "utf8"));

  if (config.extends === preset) {
    pass(`${path} extends ${preset}.`);
  } else {
    fail(`${path} does not extend ${preset}.`);
  }
}

for (const [path, preset] of [
  ["apps/web/eslint.config.mjs", "@growblic/eslint-config/next"],
  ["apps/admin/eslint.config.mjs", "@growblic/eslint-config/next"],
  ["apps/services/submissions-service/eslint.config.mjs", "@growblic/eslint-config/node"],
  ["apps/services/admin-service/eslint.config.mjs", "@growblic/eslint-config/node"],
  ["apps/services/internship-service/eslint.config.mjs", "@growblic/eslint-config/node"],
  ["apps/services/notification-worker/eslint.config.mjs", "@growblic/eslint-config/node"],
]) {
  const config = readFileSync(join(root, path), "utf8");

  if (
    config.includes("@growblic/eslint-config/base") &&
    config.includes(preset)
  ) {
    pass(`${path} consumes the shared ESLint config.`);
  } else {
    fail(`${path} does not consume the shared ESLint config.`);
  }
}

const eslintBase = readFileSync(
  join(root, "packages/eslint-config/base.mjs"),
  "utf8",
);
if (
  [".next/**", "out/**", ".turbo/**", "node_modules/**", "src/generated/**"].every(
    (path) => eslintBase.includes(`"${path}"`),
  )
) {
  pass("The shared ESLint config ignores generated, build, and cache paths.");
} else {
  fail("The shared ESLint config has incomplete generated/build/cache ignores.");
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Workspace foundation check passed.");
}
