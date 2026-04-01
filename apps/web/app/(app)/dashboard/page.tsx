import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardSummary } from "@/server/services/dashboard-service";

const statusLabels: Record<string, string> = {
  TODO: "未着手",
  IN_PROGRESS: "進行中",
  IN_REVIEW: "レビュー中",
  DONE: "完了",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const summary = await getDashboardSummary(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

      {/* ステータス別件数 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(summary.statusCounts).map(([status, count]) => (
          <div key={status} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{statusLabels[status]}</p>
            <p className="mt-1 text-2xl font-bold">{count}</p>
          </div>
        ))}
      </div>

      {/* 自分の担当タスク */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">自分の担当タスク数</p>
        <p className="mt-1 text-2xl font-bold">{summary.myTaskCount}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 締切が近いタスク */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">締切が近いタスク</h2>
          {summary.upcomingTasks.length === 0 ? (
            <p className="text-sm text-gray-500">該当なし</p>
          ) : (
            <ul className="space-y-2">
              {summary.upcomingTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {task.title}
                  </Link>
                  {task.dueDate && (
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(task.dueDate).toLocaleDateString("ja-JP")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 最近更新されたタスク */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">最近の更新</h2>
          {summary.recentTasks.length === 0 ? (
            <p className="text-sm text-gray-500">該当なし</p>
          ) : (
            <ul className="space-y-2">
              {summary.recentTasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {task.title}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {task.assignee?.name ?? "未割当"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
