"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function LoginModal({ onClose, onSuccess }: Props) {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // 모달 열릴 때 배경 스크롤 잠금
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // ESC 키로 닫기
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

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
                onSuccess();
            } else {
                setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch {
            setErr("서버 연결 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) return null;

    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 99999, backdropFilter: "blur(2px)",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: "100%", maxWidth: 360, background: "#0e1116",
                    border: "1px solid #1f232b", borderRadius: 14, padding: 24,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: 0 }}>로그인</h2>
                    <button
                        onClick={onClose}
                        style={{ background: "none", border: "none", color: "#9aa0a6", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </div>
                <p style={{ color: "#9aa0a6", fontSize: 13, marginTop: 0, marginBottom: 16 }}>
                    프로젝트 관리는 로그인이 필요합니다.
                </p>
                <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                    <input
                        required autoFocus placeholder="아이디"
                        value={user} onChange={e => setUser(e.target.value)}
                        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#151922", color: "white" }}
                    />
                    <input
                        required type="password" placeholder="비밀번호"
                        value={pass} onChange={e => setPass(e.target.value)}
                        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#151922", color: "white" }}
                    />
                    <button
                        type="submit" disabled={loading}
                        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #2a3140", background: "#1d2330", color: "white", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                    {err && <p style={{ color: "#ef4444", margin: 0, fontSize: 13 }}>{err}</p>}
                </form>
            </div>
        </div>,
        document.body
    );
}
