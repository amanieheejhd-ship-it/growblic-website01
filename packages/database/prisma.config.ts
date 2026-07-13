import "dotenv/config";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, env } from "prisma/config";

const packageRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  schema: join(packageRoot, "prisma/schema.prisma"),

  migrations: {
    path: join(packageRoot, "prisma/migrations"),
  },

  datasource: {
    url: env("DIRECT_URL"),
  },
});
