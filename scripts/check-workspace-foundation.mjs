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
  "prisma",
]) {
  requirePath(path);
}

for (const path of ["src", "public"]) {
  if (existsSync(join(root, path))) {
    fail(`${path} must move into apps/web.`);
  } else {
    pass(`Root ${path} is absent.`);
  }
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

for (const path of ["apps/web", "apps/admin"]) {
  if (implementationFiles(path).length > 0) {
    pass(`${path} contains an application.`);
  } else {
    fail(`${path} has no implementation files.`);
  }
}

for (const path of ["packages/database"]) {
  if (implementationFiles(path).length === 0) {
    pass(`${path} has no implementation files.`);
  } else {
    fail(`${path} contains implementation files.`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("Workspace foundation check passed.");
}
