import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 리버스 프록시 뒤에서는 req.url 이 내부 주소일 수 있어 redirect 대신 JSON 으로 응답한다.
export async function POST() {
    (await cookies()).set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });
    return NextResponse.json({ ok: true });
}
