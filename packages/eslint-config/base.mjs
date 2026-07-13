import { defineConfig } from "eslint/config";

export const buildArtifactIgnores = [
  ".next/**",
  "out/**",
  "build/**",
  "coverage/**",
  ".turbo/**",
  "node_modules/**",
  "src/generated/**",
  "next-env.d.ts",
];

export const baseConfig = defineConfig([]);
