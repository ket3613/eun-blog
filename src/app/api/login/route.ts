import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";
import { ADMIN_TOKEN } from "@/lib/adminAuth";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const { user, pass } = body as { user?: string; pass?: string };

    if (!user || !pass) {
        return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
    }

    try {
        const res = await fetch(`${API_BASE}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Admin-Token": ADMIN_TOKEN,
            },
            body: JSON.stringify({ userName: user, password: pass }),
        });

        const data = await res.json();
        if (!data.success) {
            return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
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
    } catch (e) {
        console.error("[login] error:", e);
        return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
    }
}
