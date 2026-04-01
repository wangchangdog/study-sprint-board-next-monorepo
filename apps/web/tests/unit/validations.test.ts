import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema, createCommentSchema } from "@/lib/validations";

describe("createTaskSchema", () => {
  it("有効なデータを受け付ける", () => {
    const result = createTaskSchema.safeParse({
      title: "テストタスク",
      description: "説明文",
      priority: "HIGH",
    });
    expect(result.success).toBe(true);
  });

  it("タイトルが空の場合はエラー", () => {
    const result = createTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("タイトルが200文字を超える場合はエラー", () => {
    const result = createTaskSchema.safeParse({ title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("タイトルのみで作成できる", () => {
    const result = createTaskSchema.safeParse({ title: "最小限のタスク" });
    expect(result.success).toBe(true);
  });

  it("不正なステータスはエラー", () => {
    const result = createTaskSchema.safeParse({
      title: "タスク",
      status: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("不正な優先度はエラー", () => {
    const result = createTaskSchema.safeParse({
      title: "タスク",
      priority: "CRITICAL",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("部分更新を受け付ける", () => {
    const result = updateTaskSchema.safeParse({ status: "DONE" });
    expect(result.success).toBe(true);
  });

  it("空オブジェクトを受け付ける", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("createCommentSchema", () => {
  it("有効なコメントを受け付ける", () => {
    const result = createCommentSchema.safeParse({ content: "コメント内容" });
    expect(result.success).toBe(true);
  });

  it("空のコメントはエラー", () => {
    const result = createCommentSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("2000文字を超えるコメントはエラー", () => {
    const result = createCommentSchema.safeParse({ content: "あ".repeat(2001) });
    expect(result.success).toBe(false);
  });
});
