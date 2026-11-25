// API 기본 URL (서버/클라이언트 공통). NEXT_PUBLIC_* 는 빌드 시점에 번들에 고정된다.
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.taeklab.cc").replace(/\/+$/, "");

/**
 * 지금 실행 중인 쪽에서 API 를 부를 때 쓸 주소.
 * - 서버(Next.js): API_INTERNAL_URL(런타임 환경변수)이 있으면 그 내부 주소로 바로 붙는다.
 *   같은 서버의 API 를 공개 도메인으로 부르면 Cloudflare 를 한 바퀴 돌아 느려지기 때문.
 * - 브라우저: 항상 공개 주소(API_BASE).
 */
export function apiBase(): string {
    if (typeof window === "undefined") {
        const internal = process.env.API_INTERNAL_URL;
        if (internal) return internal.replace(/\/+$/, "");
    }
    return API_BASE;
}
