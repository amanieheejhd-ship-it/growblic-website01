import { defineConfig } from "eslint/config";
import nxEslintPlugin from "@nx/eslint-plugin";

export const buildArtifactIgnores = [
  ".next/**",
  "out/**",
  "build/**",
  "dist/**",
  ".test-dist/**",
  "coverage/**",
  ".turbo/**",
  "node_modules/**",
  "src/generated/**",
  "next-env.d.ts",
];

// Architectural boundaries between workspace projects, enforced from each
// project's nx tags (see "nx": { "tags": [...] } in every package.json):
//   scope:frontend    Next.js apps — may only use shared contracts/validation
//   scope:service     NestJS services — the only projects allowed to touch data
//   scope:service-lib server-side shared libs (nest-common, internship-shared)
//   scope:data        the Prisma database package
//   scope:shared      browser-safe shared packages (contracts, validation)
//   scope:tooling     eslint/tsconfig packages
export const moduleBoundaries = defineConfig([
  {
    plugins: { "@nx": nxEslintPlugin },
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: false,
          depConstraints: [
            {
              sourceTag: "scope:frontend",
              onlyDependOnLibsWithTags: ["scope:shared", "scope:tooling"],
            },
            {
              sourceTag: "scope:service",
              onlyDependOnLibsWithTags: [
                "scope:shared",
                "scope:service-lib",
                "scope:data",
                "scope:tooling",
              ],
            },
            {
              sourceTag: "scope:service-lib",
              onlyDependOnLibsWithTags: [
                "scope:shared",
                "scope:service-lib",
                "scope:tooling",
              ],
            },
            {
              sourceTag: "scope:shared",
              onlyDependOnLibsWithTags: ["scope:shared", "scope:tooling"],
            },
            {
              sourceTag: "scope:data",
              onlyDependOnLibsWithTags: ["scope:tooling"],
            },
          ],
        },
      ],
    },
  },
]);

export const baseConfig = defineConfig([...moduleBoundaries]);
