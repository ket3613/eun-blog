// Spring 백엔드(공개 API) 조회 함수 모음. 서버/클라이언트 양쪽에서 사용 가능.
import { API_BASE } from "@/lib/config";
import type { ApiResponse, Profile, Project, ServerStats, Troubleshooting } from "@/lib/dataType";

/** 백엔드가 404 를 돌려준 경우. 페이지에서 notFound() 로 바꿔 쓴다. */
export class NotFoundError extends Error {}

async function getData<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        cache: "no-store",
        headers: { accept: "application/json" },
        ...init,
    });
    if (res.status === 404) throw new NotFoundError(`API ${path} 없음`);
    if (!res.ok) throw new Error(`API ${path} 실패 (${res.status})`);
    const body = (await res.json()) as ApiResponse<T>;
    if (!body.success || body.data == null) throw new Error(`API ${path} 응답 오류`);
    return body.data;
}

function normalizeProject(p: Project): Project {
    return { ...p, stack: p.stack ?? [], metrics: p.metrics ?? [], achievements: p.achievements ?? [] };
}

export async function getProfile(userName: string): Promise<Profile> {
    const p = await getData<Profile>(`/api/users/getUser?userName=${encodeURIComponent(userName)}`);
    return {
        ...p,
        skills: p.skills ?? [],
        experience: p.experience ?? [],
        competencies: p.competencies ?? [],
        highlights: p.highlights ?? [],
        credentials: p.credentials ?? [],
        upgrades: p.upgrades ?? [],
    };
}

export async function getProjects(): Promise<Project[]> {
    const data = await getData<Project[]>("/api/projects/getProjects");
    return Array.isArray(data) ? data.map(normalizeProject) : [];
}

/** 프로젝트 상세 (관련 트러블슈팅 포함). 없으면 NotFoundError */
export async function getProject(id: number): Promise<Project> {
    return normalizeProject(await getData<Project>(`/api/projects/${id}`));
}

export async function getTroubleshooting(): Promise<Troubleshooting[]> {
    const data = await getData<Troubleshooting[]>("/api/troubleshooting");
    return Array.isArray(data) ? data : [];
}

export function getServerStats(): Promise<ServerStats> {
    return getData<ServerStats>("/api/server-stats");
}

export function projectPdfUrl(id: Project["id"]): string {
    return `${API_BASE}/api/projects/${encodeURIComponent(String(id))}/pdf`;
}
