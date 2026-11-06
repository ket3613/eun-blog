// Spring 백엔드(공개 API) 조회 함수 모음. 서버/클라이언트 양쪽에서 사용 가능.
import { API_BASE } from "@/lib/config";
import type { ApiResponse, Profile, Project, ServerStats } from "@/lib/dataType";

async function getData<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        cache: "no-store",
        headers: { accept: "application/json" },
        ...init,
    });
    if (!res.ok) throw new Error(`API ${path} 실패 (${res.status})`);
    const body = (await res.json()) as ApiResponse<T>;
    if (!body.success || body.data == null) throw new Error(`API ${path} 응답 오류`);
    return body.data;
}

export function getProfile(userName: string): Promise<Profile> {
    return getData<Profile>(`/api/users/getUser?userName=${encodeURIComponent(userName)}`);
}

export async function getProjects(): Promise<Project[]> {
    const data = await getData<Project[]>("/api/projects/getProjects");
    return Array.isArray(data) ? data.map((p) => ({ ...p, stack: p.stack ?? [] })) : [];
}

export function getServerStats(): Promise<ServerStats> {
    return getData<ServerStats>("/api/server-stats");
}

export function projectPdfUrl(id: Project["id"]): string {
    return `${API_BASE}/api/projects/${encodeURIComponent(String(id))}/pdf`;
}
