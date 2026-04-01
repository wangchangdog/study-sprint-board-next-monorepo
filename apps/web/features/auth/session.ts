import { auth } from "@/lib/auth";

/**
 * 認証済みユーザーのセッション情報を取得するヘルパー。
 * Server Component や Route Handler で使用する。
 */
export async function getRequiredSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}
