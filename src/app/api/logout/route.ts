import { NextResponse } from "next/server";

// GET 요청으로 로그아웃을 처리하는 함수
export async function GET() {
    // 루트 경로로 리다이렉트 응답 생성
    const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));

    // 세션 쿠키를 빈 값으로 설정하고 즉시 만료시켜 로그아웃 처리
    res.cookies.set("session","", { path:"/", httpOnly:true, maxAge:0 });

    return res;
}