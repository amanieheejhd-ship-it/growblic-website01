import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, globalIgnores } from "eslint/config";
import { buildArtifactIgnores } from "@growblic/eslint-config/base";
import { nextConfig } from "@growblic/eslint-config/next";

const appRoot = dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig([
  ...nextConfig,
  {
    settings: {
      next: { rootDir: appRoot },
    },
  },
  globalIgnores(buildArtifactIgnores),
]);

export default eslintConfig;
