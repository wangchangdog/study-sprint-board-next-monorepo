import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validations";
import { createComment } from "@/server/services/comment-service";
import { getTaskById } from "@/server/services/task-service";

type RouteParams = { params: Promise<{ taskId: string }> };

/** POST /api/tasks/:id/comments — コメント投稿 */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const task = await getTaskById(taskId);

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = createCommentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const comment = await createComment(taskId, parsed.data, session.user.id);
  return NextResponse.json(comment, { status: 201 });
}
