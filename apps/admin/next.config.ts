import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appRoot = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = join(appRoot, "../..");

const nextConfig: NextConfig = {
  trailingSlash: true,
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: [
    "@growblic/contracts",
    "@growblic/database",
    "@growblic/validation",
  ],
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
