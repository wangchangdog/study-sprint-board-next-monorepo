import Link from "next/link";
import { getTasks } from "@/server/services/task-service";

const statusLabels: Record<string, string> = {
  TODO: "未着手",
  IN_PROGRESS: "進行中",
  IN_REVIEW: "レビュー中",
  DONE: "完了",
};

const statusColors: Record<string, string> = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-purple-100 text-purple-800",
  DONE: "bg-green-100 text-green-800",
};

const priorityLabels: Record<string, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
  URGENT: "緊急",
};

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">タスク一覧</h1>
        <Link
          href="/tasks/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          新規作成
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                タイトル
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ステータス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                優先度
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                担当者
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                締切
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {task.title}
                  </Link>
                  {task._count.comments > 0 && (
                    <span className="ml-2 text-xs text-gray-400">
                      💬 {task._count.comments}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
                  >
                    {statusLabels[task.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {priorityLabels[task.priority]}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {task.assignee?.name ?? "未割当"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("ja-JP")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            タスクがありません。新しいタスクを作成してください。
          </p>
        )}
      </div>
    </div>
  );
}
