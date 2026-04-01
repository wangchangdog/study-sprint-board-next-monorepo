import { prisma } from "@/lib/prisma";

/**
 * ダッシュボード用のサマリーデータを提供するサービス層。
 */

export async function getDashboardSummary(userId: string) {
  const [myTaskCount, statusCounts, upcomingTasks, recentTasks] = await Promise.all([
    // 自分の担当タスク数
    prisma.task.count({ where: { assigneeId: userId } }),

    // ステータス別件数
    prisma.task.groupBy({
      by: ["status"],
      _count: { status: true },
    }),

    // 締切が近いタスク（未完了で締切が7日以内）
    prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: { not: "DONE" },
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: {
        taskLabels: { include: { label: true } },
      },
    }),

    // 最近更新されたタスク
    prisma.task.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        assignee: { select: { id: true, name: true } },
        taskLabels: { include: { label: true } },
      },
    }),
  ]);

  // ステータス別件数をオブジェクトに変換
  const statusMap: Record<string, number> = {};
  for (const item of statusCounts) {
    statusMap[item.status] = item._count.status;
  }

  return {
    myTaskCount,
    statusCounts: {
      TODO: statusMap.TODO ?? 0,
      IN_PROGRESS: statusMap.IN_PROGRESS ?? 0,
      IN_REVIEW: statusMap.IN_REVIEW ?? 0,
      DONE: statusMap.DONE ?? 0,
    },
    upcomingTasks,
    recentTasks,
  };
}
