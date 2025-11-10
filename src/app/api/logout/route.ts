import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * 로그아웃 엔드포인트
 * - 세션 쿠키를 무효화하여 로그아웃 처리
 */
export async function GET() {
  // 쿠키 삭제(무효화)
  // - 동일한 속성들(secure, sameSite, path)이 설정될 때 브라우저가 정확히 덮어씀
  (await cookies()).set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.redirect("/");
}
