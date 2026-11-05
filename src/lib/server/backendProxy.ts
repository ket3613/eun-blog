import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";
import { getAdminToken, requireAuth } from "@/lib/adminAuth";

export const unauthorized = () =>
    NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });

export const badRequest = (error: string) =>
    NextResponse.json({ success: false, error }, { status: 400 });

/**
 * 관리자 인증을 확인한 뒤 Spring 백엔드로 요청을 전달한다.
 * 백엔드가 JSON 이 아닌 응답(HTML 에러 페이지 등)을 줘도 500 크래시 없이 502 로 감싼다.
 */
export async function forwardToBackend(
    path: string,
    init: { method: string; json?: unknown; body?: BodyInit },
): Promise<NextResponse> {
    const headers: Record<string, string> = { "X-Admin-Token": getAdminToken() };
    let body = init.body;
    if (init.json !== undefined) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(init.json);
    }

    let res: Response;
    try {
        res = await fetch(`${API_BASE}${path}`, { method: init.method, headers, body, cache: "no-store" });
    } catch (e) {
        console.error(`[proxy] ${init.method} ${path} failed:`, e);
        return NextResponse.json({ success: false, error: "backend unreachable" }, { status: 502 });
    }

    const data = await res.json().catch(() => null);
    if (data === null) {
        return NextResponse.json({ success: false, error: "invalid backend response" }, { status: 502 });
    }
    return NextResponse.json(data, { status: res.status });
}

export { requireAuth };
