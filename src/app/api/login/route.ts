import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";
import { getAdminToken } from "@/lib/adminAuth";
import { clientIp, hit, reset } from "@/lib/server/rateLimit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 10;    // IP 당 15분에 10회
const MAX_PER_USER = 20;  // 계정 당 15분에 20회 (IP 를 바꿔가며 시도하는 경우 대비)

const fail = () => NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });

export async function POST(req: Request) {
    const ip = clientIp(req);
    const byIp = hit(`login:ip:${ip}`, MAX_PER_IP, WINDOW_MS);
    if (byIp.limited) return tooMany(byIp.retryAfter);

    const body = await req.json().catch(() => ({}));
    const { user, pass } = body as { user?: unknown; pass?: unknown };
    if (typeof user !== "string" || typeof pass !== "string" || !user || !pass || user.length > 100 || pass.length > 200) {
        return fail();
    }

    const userKey = `login:user:${user.toLowerCase()}`;
    const byUser = hit(userKey, MAX_PER_USER, WINDOW_MS);
    if (byUser.limited) return tooMany(byUser.retryAfter);

    try {
        const res = await fetch(`${API_BASE}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Admin-Token": getAdminToken() },
            body: JSON.stringify({ userName: user, password: pass }),
            cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
        if (!res.ok || !data?.success) {
            // 응답 시간으로 계정 존재 여부를 추측하기 어렵게 약간 지연
            await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
            return fail();
        }

        reset(`login:ip:${ip}`);
        reset(userKey);

        const token = await createToken({ user });
        (await cookies()).set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        });
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("[login] error:", e);
        return NextResponse.json({ ok: false, error: "server error" }, { status: 500 });
    }
}

function tooMany(retryAfter: number) {
    return NextResponse.json(
        { ok: false, error: "too_many_attempts", retryAfter },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
}
