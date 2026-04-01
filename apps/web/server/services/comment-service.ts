import { prisma } from "@/lib/prisma";
import type { CreateCommentInput } from "@/lib/validations";

/**
 * コメントの操作を提供するサービス層。
 */

/** コメントを作成する */
export async function createComment(
  taskId: string,
  data: CreateCommentInput,
  authorId: string,
) {
  return prisma.comment.create({
    data: {
      content: data.content,
      taskId,
      authorId,
    },
    include: {
      author: { select: { id: true, name: true } },
    },
  });
}
