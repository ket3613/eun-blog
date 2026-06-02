import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "change-me-secret";

async function requireAuth() {
    const token = (await cookies()).get("session")?.value;
    const valid = token ? await verifyToken(token) : null;
    return !!valid;
}

// 프로젝트 생성
export async function POST(req: NextRequest) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    const body = await req.text();
    const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
        body,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
