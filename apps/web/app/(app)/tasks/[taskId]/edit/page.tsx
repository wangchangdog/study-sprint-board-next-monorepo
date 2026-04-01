import { notFound } from "next/navigation";
import { TaskForm } from "@/features/tasks";
import { getTaskById, getUsers, getLabels } from "@/server/services/task-service";

type PageProps = { params: Promise<{ taskId: string }> };

export default async function EditTaskPage({ params }: PageProps) {
  const { taskId } = await params;
  const [task, users, labels] = await Promise.all([
    getTaskById(taskId),
    getUsers(),
    getLabels(),
  ]);

  if (!task) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">タスク編集</h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <TaskForm
          users={users}
          labels={labels}
          defaultValues={{
            title: task.title,
            description: task.description ?? undefined,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate?.toISOString(),
            assigneeId: task.assigneeId ?? undefined,
            labelIds: task.taskLabels.map((tl) => tl.label.id),
          }}
          submitUrl={`/api/tasks/${task.id}`}
          method="PATCH"
        />
      </div>
    </div>
  );
}
