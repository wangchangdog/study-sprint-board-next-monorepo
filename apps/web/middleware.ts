import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * 認証ミドルウェア。
 * 未認証ユーザーを /signin にリダイレクトする。
 * /signin と /api/auth は認証チェックをスキップする。
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 認証不要なパス
  const publicPaths = ["/signin", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // 未認証 → サインインページへ
  if (!req.auth) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
