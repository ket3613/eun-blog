import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";
import { ADMIN_TOKEN, requireAuth } from "@/lib/adminAuth";

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
