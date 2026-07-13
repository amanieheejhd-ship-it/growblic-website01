import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
const packageManager = packageJson.packageManager;
const match = /^pnpm@(\d+\.\d+\.\d+)$/.exec(packageManager ?? "");

if (process.versions.node.split(".")[0] !== "22") {
  fail("Node.js major version must be 22.");
} else {
  console.log("PASS: Node.js major version is 22.");
}

if (!match) {
  fail("packageManager must pin an exact pnpm version.");
} else {
  let installedVersion = null;

  try {
    installedVersion = execFileSync("pnpm", ["--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    fail("pnpm is not available.");
  }

  if (installedVersion !== null) {
    if (installedVersion !== match[1]) {
      fail("pnpm does not match the pinned packageManager version.");
    } else {
      console.log("PASS: pnpm matches the pinned packageManager version.");
    }
  }
}

if (!process.exitCode) {
  console.log("Toolchain check passed.");
}
