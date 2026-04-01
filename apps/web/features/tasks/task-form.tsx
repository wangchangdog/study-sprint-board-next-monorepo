"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TaskFormProps = {
  users: { id: string; name: string }[];
  labels: { id: string; name: string; color: string }[];
  defaultValues?: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
    labelIds?: string[];
  };
  submitUrl: string;
  method: "POST" | "PATCH";
};

export function TaskForm({ users, labels, defaultValues, submitUrl, method }: TaskFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const selectedLabels = formData.getAll("labelIds") as string[];

    const body = {
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      status: formData.get("status") || undefined,
      priority: formData.get("priority") || undefined,
      dueDate: formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string).toISOString()
        : null,
      assigneeId: formData.get("assigneeId") || null,
      labelIds: selectedLabels.length > 0 ? selectedLabels : undefined,
    };

    const res = await fetch(submitUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "エラーが発生しました");
      setIsLoading(false);
      return;
    }

    router.push("/tasks");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            ステータス
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "TODO"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="TODO">未着手</option>
            <option value="IN_PROGRESS">進行中</option>
            <option value="IN_REVIEW">レビュー中</option>
            <option value="DONE">完了</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            優先度
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={defaultValues?.priority ?? "MEDIUM"}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="LOW">低</option>
            <option value="MEDIUM">中</option>
            <option value="HIGH">高</option>
            <option value="URGENT">緊急</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700">
            担当者
          </label>
          <select
            id="assigneeId"
            name="assigneeId"
            defaultValue={defaultValues?.assigneeId ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">未割当</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            締切日
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaultValues?.dueDate?.split("T")[0]}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700">ラベル</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {labels.map((label) => (
            <label key={label.id} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                name="labelIds"
                value={label.id}
                defaultChecked={defaultValues?.labelIds?.includes(label.id)}
                className="rounded border-gray-300"
              />
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{ backgroundColor: label.color + "20", color: label.color }}
              >
                {label.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}
