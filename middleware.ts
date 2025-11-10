import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * 보호 라우트를 위한 인증 미들웨어
 * - HttpOnly 세션 쿠키(`session`)를 검증하여 접근 허용/차단
 * - 로컬 개발(NODE_ENV !== 'production')에서는 로그인 없이 접근 허용(요청에 따른 임시 설정)
 */
export async function middleware(req: NextRequest) {
  // 1) 로컬/개발 환경에서는 인증 우회 (요청사항: 일단 로컬에서 접속 가능하도록)
  //    프로덕션으로 배포 시 아래 분기를 제거하거나 주석 해제 지시에 따라 수정하십시오.
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  // 2) 프로덕션: HttpOnly 쿠키에서 세션 토큰 추출
  const token = req.cookies.get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  // 3) 토큰 검증 (유효하지 않으면 로그인 페이지로 리다이렉트)
  const valid = await verifyToken(token);
  if (!valid) return NextResponse.redirect(new URL("/login", req.url));

  // 4) 통과
  return NextResponse.next();
}

export const config = {
  // 인증이 필요한 경로만 매칭
  matcher: [
    "/images/:path*",
    "/tech/new",
    "/tech/:path*/edit"
  ]
};