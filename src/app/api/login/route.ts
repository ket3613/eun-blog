import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken } from "@/lib/auth";
import { timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string): boolean {
    try {
        const ba = Buffer.from(a);
        const bb = Buffer.from(b);
        return ba.length === bb.length && timingSafeEqual(ba, bb);
    } catch {
        return false;
    }
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const { user, pass } = body as { user?: string; pass?: string };

    const expectedUser = process.env.ADMIN_USER;
    const expectedPass = process.env.ADMIN_PASS;

    if (!expectedUser || !expectedPass) {
        console.error("ADMIN_USER or ADMIN_PASS is not configured");
        return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
    }

    if (user && pass && safeEqual(user, expectedUser) && safeEqual(pass, expectedPass)) {
        const token = await createToken({ user });
        const res = NextResponse.json({ ok: true });
        (await cookies()).set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        });
        return res;
    }

    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
}
