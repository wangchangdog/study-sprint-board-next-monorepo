import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateTaskSchema } from "@/lib/validations";
import { getTaskById, updateTask } from "@/server/services/task-service";

type RouteParams = { params: Promise<{ taskId: string }> };

/** GET /api/tasks/:id — タスク詳細 */
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const task = await getTaskById(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

/** PATCH /api/tasks/:id — タスク更新 */
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const existing = await getTaskById(taskId);

  if (!existing) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const task = await updateTask(taskId, parsed.data);
  return NextResponse.json(task);
}
