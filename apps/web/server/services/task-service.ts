import { prisma } from "@/lib/prisma";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validations";
import type { TaskStatus, Priority } from "@prisma/client";

/**
 * タスクの CRUD 操作を提供するサービス層。
 * DB アクセスをこの層に閉じ込め、Route Handler や Server Component から呼び出す。
 */

/** タスク一覧を取得する */
export async function getTasks(options?: {
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
}) {
  return prisma.task.findMany({
    where: {
      ...(options?.status && { status: options.status }),
      ...(options?.priority && { priority: options.priority }),
      ...(options?.assigneeId && { assigneeId: options.assigneeId }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      taskLabels: { include: { label: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

/** タスク詳細を取得する */
export async function getTaskById(taskId: string) {
  return prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      taskLabels: { include: { label: true } },
      comments: {
        include: { author: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/** タスクを作成する */
export async function createTask(data: CreateTaskInput, createdById: string) {
  const { labelIds, dueDate, ...taskData } = data;

  return prisma.task.create({
    data: {
      ...taskData,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById,
      ...(labelIds?.length && {
        taskLabels: {
          create: labelIds.map((labelId) => ({ labelId })),
        },
      }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      taskLabels: { include: { label: true } },
    },
  });
}

/** タスクを更新する */
export async function updateTask(taskId: string, data: UpdateTaskInput) {
  const { labelIds, dueDate, ...taskData } = data;

  // ラベルの更新がある場合は既存を削除して再作成
  if (labelIds !== undefined) {
    await prisma.taskLabel.deleteMany({ where: { taskId } });
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...taskData,
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(labelIds?.length && {
        taskLabels: {
          create: labelIds.map((labelId) => ({ labelId })),
        },
      }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      taskLabels: { include: { label: true } },
    },
  });
}

/** 全ユーザー一覧（担当者選択用） */
export async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
}

/** 全ラベル一覧 */
export async function getLabels() {
  return prisma.label.findMany({ orderBy: { name: "asc" } });
}
