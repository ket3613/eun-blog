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

// 프로젝트 수정
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.text();
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
        body,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}

// 프로젝트 삭제
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": ADMIN_TOKEN },
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
