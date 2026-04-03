import { Priority, PrismaClient, Role, TaskStatus } from "@prisma/client";
import { hash } from "bcryptjs";
import { loadMonorepoEnv } from "../lib/monorepo-env";

loadMonorepoEnv(process.cwd());

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // パスワードハッシュ生成
  const passwordHash = await hash("password123", 12);

  // ─── ユーザー ─────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "管理者 太郎",
      email: "admin@example.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      name: "開発 花子",
      email: "user1@example.com",
      passwordHash,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      name: "テスト 次郎",
      email: "user2@example.com",
      passwordHash,
      role: Role.USER,
    },
  });

  // ─── ラベル ─────────────────────────────
  const labels = await Promise.all(
    [
      { name: "バグ", color: "#ef4444" },
      { name: "機能追加", color: "#3b82f6" },
      { name: "改善", color: "#22c55e" },
      { name: "ドキュメント", color: "#a855f7" },
      { name: "緊急", color: "#f97316" },
    ].map((label) =>
      prisma.label.upsert({
        where: { name: label.name },
        update: {},
        create: label,
      }),
    ),
  );

  // ─── タスク ─────────────────────────────
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: "プロジェクトのREADMEを整備する",
        description: "セットアップ手順、技術スタック、ディレクトリ構成を記載する",
        status: TaskStatus.DONE,
        priority: Priority.HIGH,
        assigneeId: admin.id,
        createdById: admin.id,
        dueDate: new Date("2026-04-10"),
      },
    }),
    prisma.task.create({
      data: {
        title: "ユーザー認証機能の実装",
        description: "NextAuth.jsを使ったサインイン・サインアウト機能を実装する",
        status: TaskStatus.DONE,
        priority: Priority.URGENT,
        assigneeId: user1.id,
        createdById: admin.id,
        dueDate: new Date("2026-04-15"),
      },
    }),
    prisma.task.create({
      data: {
        title: "タスク一覧画面の作成",
        description:
          "タスクの一覧表示、ステータスフィルタ、優先度でのソートを実装する",
        status: TaskStatus.IN_REVIEW,
        priority: Priority.HIGH,
        assigneeId: user1.id,
        createdById: admin.id,
        dueDate: new Date("2026-04-20"),
      },
    }),
    prisma.task.create({
      data: {
        title: "タスク作成フォームの実装",
        description: "Zodバリデーション付きのタスク作成フォームを実装する",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        assigneeId: user2.id,
        createdById: admin.id,
        dueDate: new Date("2026-04-22"),
      },
    }),
    prisma.task.create({
      data: {
        title: "ダッシュボード画面の作成",
        description: "担当タスク数、ステータス別件数、締切が近いタスクを表示する",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        assigneeId: user1.id,
        createdById: admin.id,
        dueDate: new Date("2026-04-25"),
      },
    }),
    prisma.task.create({
      data: {
        title: "コメント機能の追加",
        description: "タスク詳細画面でコメントの投稿と一覧表示ができるようにする",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        assigneeId: user2.id,
        createdById: user1.id,
        dueDate: new Date("2026-04-28"),
      },
    }),
    prisma.task.create({
      data: {
        title: "E2Eテストの導入",
        description: "Playwrightを使った基本的なE2Eテストを作成する",
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        assigneeId: user2.id,
        createdById: admin.id,
        dueDate: new Date("2026-05-05"),
      },
    }),
    prisma.task.create({
      data: {
        title: "CI/CDパイプラインの構築",
        description: "GitHub Actionsでlint、typecheck、test、buildを自動実行する",
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        assigneeId: admin.id,
        createdById: admin.id,
        dueDate: new Date("2026-05-01"),
      },
    }),
    prisma.task.create({
      data: {
        title: "レスポンシブデザインの適用",
        description: "全画面をモバイル対応させる。Tailwind CSSのブレークポイントを活用",
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        assigneeId: user1.id,
        createdById: user1.id,
        dueDate: new Date("2026-05-10"),
      },
    }),
    prisma.task.create({
      data: {
        title: "エラーハンドリングの統一",
        description: "API層とUI層のエラー処理パターンを統一し、ユーザーに適切なメッセージを表示する",
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        assigneeId: admin.id,
        createdById: user2.id,
      },
    }),
    prisma.task.create({
      data: {
        title: "設定画面の実装",
        description: "admin向けのユーザー管理・ラベル管理画面を実装する",
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        assigneeId: admin.id,
        createdById: admin.id,
        dueDate: new Date("2026-05-15"),
      },
    }),
    prisma.task.create({
      data: {
        title: "APIドキュメントの作成",
        description: "docs/api/openapi.yamlを正本として更新し、docs/api-spec.mdに補足説明を記載する",
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        assigneeId: user2.id,
        createdById: admin.id,
        dueDate: new Date("2026-05-12"),
      },
    }),
  ]);

  // ─── タスクとラベルの紐付け ───────────────
  await Promise.all([
    prisma.taskLabel.create({ data: { taskId: tasks[0].id, labelId: labels[3].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[1].id, labelId: labels[1].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[2].id, labelId: labels[1].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[3].id, labelId: labels[1].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[4].id, labelId: labels[1].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[5].id, labelId: labels[1].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[6].id, labelId: labels[2].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[9].id, labelId: labels[0].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[9].id, labelId: labels[2].id } }),
    prisma.taskLabel.create({ data: { taskId: tasks[11].id, labelId: labels[3].id } }),
  ]);

  // ─── コメント ─────────────────────────────
  await Promise.all([
    prisma.comment.create({
      data: {
        content: "README の構成は docs/architecture.md と整合性を取ってください。",
        taskId: tasks[0].id,
        authorId: user1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "NextAuth v5 の App Router 対応を確認しました。問題なさそうです。",
        taskId: tasks[1].id,
        authorId: admin.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "フィルタのUIはSelectコンポーネントで統一しましょう。",
        taskId: tasks[2].id,
        authorId: user2.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "Zodスキーマのバリデーションメッセージは日本語にしたほうが親切です。",
        taskId: tasks[3].id,
        authorId: admin.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: "エラーハンドリングのパターンは features/tasks を参考にしてください。",
        taskId: tasks[9].id,
        authorId: user1.id,
      },
    }),
  ]);

  console.log("✅ Seed completed!");
  console.log(`  Users: ${3}`);
  console.log(`  Tasks: ${tasks.length}`);
  console.log(`  Labels: ${labels.length}`);
  console.log(`  Comments: 5`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
