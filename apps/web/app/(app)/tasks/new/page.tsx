import { TaskForm } from "@/features/tasks";
import { getUsers, getLabels } from "@/server/services/task-service";

export default async function NewTaskPage() {
  const [users, labels] = await Promise.all([getUsers(), getLabels()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">タスク作成</h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <TaskForm
          users={users}
          labels={labels}
          submitUrl="/api/tasks"
          method="POST"
        />
      </div>
    </div>
  );
}
