import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaskById } from "@/server/services/task-service";

const statusLabels: Record<string, string> = {
  TODO: "未着手",
  IN_PROGRESS: "進行中",
  IN_REVIEW: "レビュー中",
  DONE: "完了",
};

const priorityLabels: Record<string, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
  URGENT: "緊急",
};

type PageProps = { params: Promise<{ taskId: string }> };

export default async function TaskDetailPage({ params }: PageProps) {
  const { taskId } = await params;
  const task = await getTaskById(taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/tasks" className="text-sm text-gray-500 hover:text-gray-700">
            ← タスク一覧に戻る
          </Link>
          <h1 className="mt-2 text-2xl font-bold">{task.title}</h1>
        </div>
        <Link
          href={`/tasks/${task.id}/edit`}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          編集
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* メインコンテンツ */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-sm font-medium text-gray-500">説明</h2>
            <p className="whitespace-pre-wrap text-gray-700">
              {task.description || "説明はありません"}
            </p>
          </div>

          {/* コメント */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">
              コメント ({task.comments.length})
            </h2>

            {task.comments.length === 0 ? (
              <p className="text-sm text-gray-500">コメントはまだありません</p>
            ) : (
              <div className="space-y-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.author.name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString("ja-JP")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-gray-500">ステータス</dt>
                <dd className="mt-1 text-sm">{statusLabels[task.status]}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">優先度</dt>
                <dd className="mt-1 text-sm">{priorityLabels[task.priority]}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">担当者</dt>
                <dd className="mt-1 text-sm">{task.assignee?.name ?? "未割当"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">作成者</dt>
                <dd className="mt-1 text-sm">{task.createdBy.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">締切</dt>
                <dd className="mt-1 text-sm">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("ja-JP")
                    : "未設定"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">ラベル</dt>
                <dd className="mt-1 flex flex-wrap gap-1">
                  {task.taskLabels.length === 0 ? (
                    <span className="text-sm text-gray-400">なし</span>
                  ) : (
                    task.taskLabels.map(({ label }) => (
                      <span
                        key={label.id}
                        className="inline-block rounded-full px-2 py-0.5 text-xs"
                        style={{ backgroundColor: label.color + "20", color: label.color }}
                      >
                        {label.name}
                      </span>
                    ))
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">作成日</dt>
                <dd className="mt-1 text-sm">
                  {new Date(task.createdAt).toLocaleDateString("ja-JP")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
