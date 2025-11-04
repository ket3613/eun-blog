
"use client";
import { useState } from "react";

/**
 * 로그인 폼을 제공하는 클라이언트 컴포넌트
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

        // 로그인 API 호출
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, pass })
        });

        // 로그인 성공 시 이미지 페이지로 이동
        if (res.ok) location.href = "/images";
        // 로그인 실패 시 에러 메시지 표시
        else setErr("로그인 실패");
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