import { defineConfig } from "eslint/config";

import { baseConfig } from "./base.mjs";

export const nodeConfig = defineConfig([...baseConfig]);
