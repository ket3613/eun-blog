import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";
import { isValidId } from "@/lib/adminAuth";

// 업로드된 프로젝트 이미지 프록시 (CSP img-src 'self' 유지를 위해 동일 출처로 서빙)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!isValidId(id)) {
        return new NextResponse(null, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/api/projects/${id}/image`, { cache: "no-store" });
    if (!res.ok || !res.body) {
        return new NextResponse(null, { status: res.status });
    }

    return new NextResponse(res.body, {
        status: 200,
        headers: {
            "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
            "Cache-Control": "public, max-age=300",
        },
    });
}
