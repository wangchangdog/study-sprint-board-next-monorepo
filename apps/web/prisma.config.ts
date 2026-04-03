import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

import { loadMonorepoEnv } from "./lib/monorepo-env";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

loadMonorepoEnv(projectDirectory);

export default defineConfig({
  schema: path.join(projectDirectory, "prisma/schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});