import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTaskSchema } from "@/lib/validations";
import { getTasks, createTask } from "@/server/services/task-service";
import type { TaskStatus, Priority } from "@prisma/client";

/** GET /api/tasks — タスク一覧 */
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as TaskStatus | null;
  const priority = searchParams.get("priority") as Priority | null;
  const assigneeId = searchParams.get("assigneeId");

  const tasks = await getTasks({
    ...(status && { status }),
    ...(priority && { priority }),
    ...(assigneeId && { assigneeId }),
  });

  return NextResponse.json(tasks);
}

/** POST /api/tasks — タスク作成 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const task = await createTask(parsed.data, session.user.id);
  return NextResponse.json(task, { status: 201 });
}
