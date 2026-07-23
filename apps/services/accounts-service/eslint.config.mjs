import { defineConfig } from "eslint/config";

import { baseConfig } from "@growblic/eslint-config/base";
import { nodeConfig } from "@growblic/eslint-config/node";

export default defineConfig([
  ...baseConfig,
  ...nodeConfig,
  {
    ignores: ["dist/**", ".test-dist/**"],
  },
]);
