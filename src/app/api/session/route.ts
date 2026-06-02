import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// GET /api/session - 현재 로그인 상태 확인
export async function GET() {
    const token = (await cookies()).get("session")?.value;
    if (!token) return NextResponse.json({ loggedIn: false });

    const valid = await verifyToken(token);
    return NextResponse.json({ loggedIn: !!valid });
}
