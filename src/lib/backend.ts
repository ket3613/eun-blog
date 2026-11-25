// Spring 백엔드(공개 API) 조회 함수 모음. 서버/클라이언트 양쪽에서 사용 가능.
// 서버에서는 내부 주소 + 메모리 캐시, 브라우저에서는 공개 주소로 매번 조회한다.
import { API_BASE, apiBase } from "@/lib/config";
import type { ApiResponse, Profile, Project, ServerStats, Troubleshooting } from "@/lib/dataType";

/** 백엔드가 404 를 돌려준 경우. 페이지에서 notFound() 로 바꿔 쓴다. */
export class NotFoundError extends Error {}

async function fetchData<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${apiBase()}${path}`, {
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

// ----- 서버 메모리 캐시 -----
// 포트폴리오 데이터는 자주 바뀌지 않으므로 서버에서 CACHE_TTL_MS 동안 재사용한다.
// 만료된 뒤에는 기존 값을 바로 돌려주고 뒤에서 새로 받아온다(stale-while-revalidate).
// 브라우저(서버 현황 30초 폴링 등)에서는 캐시하지 않는다.
const CACHE_TTL_MS = 60_000;
type CacheEntry = { data: unknown; fetchedAt: number; refreshing?: Promise<unknown> };
const cache = new Map<string, CacheEntry>();

/** 관리 화면에서 데이터를 바꾼 뒤 호출해 다음 조회부터 새 값을 받게 한다. */
export function clearApiCache(): void {
    cache.clear();
}

async function getData<T>(path: string): Promise<T> {
    if (typeof window !== "undefined") return fetchData<T>(path);

    const hit = cache.get(path);
    if (hit) {
        if (Date.now() - hit.fetchedAt > CACHE_TTL_MS && !hit.refreshing) {
            hit.refreshing = fetchData<T>(path)
                .then((data) => cache.set(path, { data, fetchedAt: Date.now() }))
                .catch((e) => console.error(`[api-cache] ${path} 갱신 실패, 이전 값 유지:`, e))
                .finally(() => { hit.refreshing = undefined; });
        }
        return hit.data as T;
    }

    const data = await fetchData<T>(path);
    cache.set(path, { data, fetchedAt: Date.now() });
    return data;
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
