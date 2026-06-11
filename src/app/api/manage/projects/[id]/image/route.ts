import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";
import { ADMIN_TOKEN, requireAuth, isValidId } from "@/lib/adminAuth";

// 이미지 업로드 (multipart 그대로 프록시)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAuth())) {
        return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    if (!isValidId(id)) {
        return NextResponse.json({ success: false, error: "invalid id" }, { status: 400 });
    }
    const formData = await req.formData();

    const res = await fetch(`${API_BASE}/api/projects/${id}/image`, {
        method: "POST",
        headers: { "X-Admin-Token": ADMIN_TOKEN },
        body: formData,
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
}
