import { loadEnvConfig } from "@next/env";
import fs from "node:fs";
import path from "node:path";

const ENV_FILE_NAMES = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.development.local",
  ".env.test",
  ".env.test.local",
  ".env.production",
  ".env.production.local",
];

const hasEnvFile = (directory: string) =>
  ENV_FILE_NAMES.some((fileName) => fs.existsSync(path.join(directory, fileName)));

export const resolveEnvDirectory = (projectDirectory: string) => {
  const workspaceRoot = path.resolve(projectDirectory, "../..");

  if (hasEnvFile(projectDirectory) || !hasEnvFile(workspaceRoot)) {
    return projectDirectory;
  }

  return workspaceRoot;
};

export const loadMonorepoEnv = (projectDirectory: string) => {
  const envDirectory = resolveEnvDirectory(projectDirectory);

  loadEnvConfig(envDirectory, undefined, console, true);

  return envDirectory;
};