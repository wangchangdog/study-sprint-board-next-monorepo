import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { loadMonorepoEnv, resolveEnvDirectory } from "@/lib/monorepo-env";

const createdDirectories: string[] = [];

const createTempProject = () => {
  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "study-sprint-board-env-"),
  );

  createdDirectories.push(tempDirectory);

  const projectDirectory = path.join(tempDirectory, "apps", "web");
  fs.mkdirSync(projectDirectory, { recursive: true });

  return {
    workspaceRoot: tempDirectory,
    projectDirectory,
  };
};

afterEach(() => {
  for (const directory of createdDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("resolveEnvDirectory", () => {
  it("アプリ配下に env が無くワークスペース直下に env がある場合はワークスペース直下を返す", () => {
    const { workspaceRoot, projectDirectory } = createTempProject();

    fs.writeFileSync(path.join(workspaceRoot, ".env"), "NEXTAUTH_SECRET=test\n");

    expect(resolveEnvDirectory(projectDirectory)).toBe(workspaceRoot);
  });

  it("アプリ配下に env がある場合はアプリ配下を優先する", () => {
    const { workspaceRoot, projectDirectory } = createTempProject();

    fs.writeFileSync(path.join(workspaceRoot, ".env"), "NEXTAUTH_SECRET=root\n");
    fs.writeFileSync(path.join(projectDirectory, ".env.local"), "NEXTAUTH_SECRET=app\n");

    expect(resolveEnvDirectory(projectDirectory)).toBe(projectDirectory);
  });

  it("どこにも env が無い場合はアプリ配下を返す", () => {
    const { projectDirectory } = createTempProject();

    expect(resolveEnvDirectory(projectDirectory)).toBe(projectDirectory);
  });

  it("loadMonorepoEnv はワークスペース直下の .env から DATABASE_URL を読み込む", () => {
    const { workspaceRoot, projectDirectory } = createTempProject();
    const originalDatabaseUrl = process.env.DATABASE_URL;

    fs.writeFileSync(
      path.join(workspaceRoot, ".env"),
      'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test"\n',
    );

    delete process.env.DATABASE_URL;

    expect(loadMonorepoEnv(projectDirectory)).toBe(workspaceRoot);
    expect(process.env.DATABASE_URL).toBe(
      "postgresql://postgres:postgres@localhost:5432/test",
    );

    if (originalDatabaseUrl) {
      process.env.DATABASE_URL = originalDatabaseUrl;
      return;
    }

    delete process.env.DATABASE_URL;
  });
});