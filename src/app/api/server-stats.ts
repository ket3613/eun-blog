import { ApiResponse, ServerStats } from "@/lib/dataType";

export async function getServerStats(): Promise<ServerStats> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

    const res = await fetch(`${baseUrl}/api/server-stats`, { method: "GET" });
    if (!res.ok) throw new Error("서버 상태 조회 실패");

    const body: ApiResponse<ServerStats> = await res.json();
    if (!body.success || !body.data) throw new Error("서버 상태 조회 실패");
    return body.data;
}
