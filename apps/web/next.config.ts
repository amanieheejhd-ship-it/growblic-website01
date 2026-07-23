import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appRoot = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = join(appRoot, "../..");
const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const gitHubPagesBasePath = "/growblic-website01";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_BASE_PATH: isGitHubPagesBuild ? gitHubPagesBasePath : "",
  },
  ...(isGitHubPagesBuild
    ? {
        output: "export" as const,
        basePath: gitHubPagesBasePath,
        assetPrefix: gitHubPagesBasePath,
        pageExtensions: ["tsx"],
      }
    : {}),
  trailingSlash: true,
  outputFileTracingRoot: monorepoRoot,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@growblic/contracts"],
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
