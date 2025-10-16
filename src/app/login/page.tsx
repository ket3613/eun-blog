"use client";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass })
    });
    if (res.ok) location.href = "/images";
    else setErr("로그인 실패");
  }

  return (
    <section style={{ maxWidth: 360 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>로그인</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input required placeholder="아이디" value={user} onChange={e => setUser(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />
        <input required type="password" placeholder="비밀번호" value={pass} onChange={e => setPass(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />
        <button type="submit" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#151922", color: "white" }}>
          로그인
        </button>
        {err && <p style={{ color: "#ef4444" }}>{err}</p>}
      </form>
      <p style={{ color: "#9aa0a6", marginTop: 10 }}>데모 계정: user / pass</p>
    </section>
  );
}