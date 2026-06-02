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

// PDF 업로드 (multipart 그대로 프록시)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const formData = await req.formData();

    const res = await fetch(`${API_BASE}/api/projects/${id}/pdf`, {
        method: "POST",
        headers: { "X-Admin-Token": ADMIN_TOKEN },
        body: formData,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
