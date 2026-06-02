import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const { user, pass } = body as { user?: string; pass?: string };

    if (!user || !pass) {
        return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
    }

    try {
        const res = await fetch(`${API_BASE}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: user, password: pass }),
        });

        const data = await res.json();
        if (!res.ok || data.status !== "ok") {
            return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
    }

    const token = await createToken({ user });
    const response = NextResponse.json({ ok: true });
    (await cookies()).set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
    });
    return response;
}
