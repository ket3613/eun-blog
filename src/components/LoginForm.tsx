"use client";
import { useId, useState } from "react";
import s from "@/styles/auth.module.css";

/** 로그인 페이지와 로그인 모달이 함께 쓰는 폼 */
export default function LoginForm({ onSuccess, autoFocus = false }: { onSuccess: () => void; autoFocus?: boolean }) {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const errId = useId();

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
                return;
            }
            if (res.status === 429) {
                const retry = Number(res.headers.get("Retry-After") ?? 0);
                setErr(`로그인 시도가 너무 많습니다. ${retry > 60 ? `${Math.ceil(retry / 60)}분` : `${retry}초`} 후 다시 시도해 주세요.`);
            } else if (res.status === 401) {
                setErr("아이디 또는 비밀번호가 올바르지 않습니다.");
            } else {
                setErr("일시적인 서버 오류입니다. 잠시 후 다시 시도해 주세요.");
            }
        } catch {
            setErr("서버에 연결할 수 없습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={s.form} onSubmit={onSubmit} aria-describedby={err ? errId : undefined}>
            <label className={s.field}>
                아이디
                <input
                    className={s.input}
                    required
                    autoFocus={autoFocus}
                    name="username"
                    autoComplete="username"
                    maxLength={100}
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
            </label>
            <label className={s.field}>
                비밀번호
                <input
                    className={s.input}
                    required
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    maxLength={200}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />
            </label>
            <button type="submit" className={s.submit} disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
            </button>
            {err && (
                <p id={errId} className={s.error} role="alert">
                    {err}
                </p>
            )}
        </form>
    );
}
