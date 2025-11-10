
"use client";
import { useState } from "react";

/**
 * 로그인 폼을 제공하는 클라이언트 컴포넌트
 *
 * 변경 사항(로컬 개발 모드):
 * - 요청에 따라 실제 로그인 API 호출을 잠시 비활성화하고 주석 처리
 * - 미들웨어에서 개발 환경은 인증을 우회하므로, 제출 시 바로 보호 페이지로 이동
 * - 프로덕션 전환 시 아래 주석을 되돌리고 API 호출을 활성화하세요.
 */
export default function LoginPage() {
    // 사용자 아이디 상태
    const [user, setUser] = useState("");
    // 비밀번호 상태
    const [pass, setPass] = useState("");
    // 에러 메시지 상태
    const [err, setErr] = useState("");

    /**
     * 로그인 폼 제출 처리 함수
     */
    async function onSubmit(e: React.FormEvent) {
        // 기본 폼 제출 동작 방지
        e.preventDefault();
        // 에러 메시지 초기화
        setErr("");

        // [로컬 전용] API 호출 비활성화 — 미들웨어가 개발 환경에서는 인증을 우회합니다.
        // 따라서 로그인 버튼 클릭 시 바로 보호 페이지로 이동시킵니다.
        // 프로덕션에서는 아래 주석을 원복하여 실제 API를 호출하세요.
        location.href = "/images";
        return;

        // --- 실제 API 호출 (프로덕션에서 사용) ---
        // const res = await fetch("/api/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ user, pass })
        // });
        // if (res.ok) location.href = "/images";
        // else setErr("로그인 실패");
    }

    return (
        <section style={{ maxWidth: 360 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>로그인</h1>
            {/* 로그인 폼 */}
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                {/* 아이디 입력 필드 */}
                <input required placeholder="아이디" value={user} onChange={e => setUser(e.target.value)}
                       style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />
                {/* 비밀번호 입력 필드 */}
                <input required type="password" placeholder="비밀번호" value={pass} onChange={e => setPass(e.target.value)}
                       style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />
                {/* 로그인 버튼 */}
                <button type="submit" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#151922", color: "white" }}>
                    로그인
                </button>
                {/* 에러 메시지 표시 영역 */}
                {err && <p style={{ color: "#ef4444" }}>{err}</p>}
            </form>
            {/* 데모 계정 안내 */}
            <p style={{ color: "#9aa0a6", marginTop: 10 }}>데모 계정: user / pass</p>
        </section>
    );
}