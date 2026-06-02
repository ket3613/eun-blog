"use client";
import { useState } from "react";

export default function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, pass }),
            });
            if (res.ok) {
                location.href = "/manage";
            } else {
                setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch {
            setErr("서버 연결 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section style={{ maxWidth: 360 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>로그인</h1>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                    required
                    placeholder="아이디"
                    value={user}
                    onChange={e => setUser(e.target.value)}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }}
                />
                <input
                    required
                    type="password"
                    placeholder="비밀번호"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#151922", color: "white", opacity: loading ? 0.6 : 1 }}
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>
                {err && <p style={{ color: "#ef4444" }}>{err}</p>}
            </form>
        </section>
    );
}
