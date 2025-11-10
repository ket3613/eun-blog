import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";

/**
 * 로그인 엔드포인트 (서버 전용)
 * - HttpOnly 세션 쿠키를 발급하여 XSS로부터 토큰 탈취를 방지
 * - sameSite=strict 로 CSRF 기본 차단 (교차 도메인 폼 전송 차단)
 * - secure 플래그는 프로덕션(HTTPS)에서만 활성화 — 로컬 개발 편의를 위해 비활성화
 */
export async function POST(req: Request) {
  // JSON 파싱 실패 시에도 서버가 500이 아니라 정상 흐름을 타도록 기본값 처리
  const body = await req.json().catch(() => ({}));
  const { user, pass } = body as { user?: string; pass?: string };

  // 데모 계정 검증 (실서비스에서는 안전한 인증으로 교체 필요)
  if (user === "user" && pass === "pass") {
    // 토큰 페이로드에는 최소한의 식별 정보만 포함 (PII 지양)
    const token = await createToken({ user });

    // 응답 바디는 최소 정보만 반환 (쿠키는 Set-Cookie 헤더로 전달)
    const res = NextResponse.json({ ok: true });

    // HttpOnly 세션 쿠키 설정
    // - httpOnly: 클라이언트 JS로 접근 불가 (XSS 완화)
    // - secure: HTTPS에서만 전송 (프로덕션에서만 true)
    // - sameSite: strict로 교차 사이트 요청 차단 (CSRF 기본 차단)
    // - path: 루트로 지정하여 전체 경로에서 유효
    // - maxAge: 1시간 (필요시 짧게 조정 권장)
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1h
    });
    return res;
  }

  // 인증 실패 시 구체 정보는 노출하지 않음 (브루트포스 힌트 방지)
  return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
}
