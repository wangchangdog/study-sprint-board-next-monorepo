import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/features/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-bold text-gray-900">
            Study Sprint Board
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              ダッシュボード
            </Link>
            <Link href="/tasks" className="text-sm text-gray-600 hover:text-gray-900">
              タスク
            </Link>
            {(session?.user as { role?: string })?.role === "ADMIN" && (
              <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900">
                設定
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session?.user?.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
