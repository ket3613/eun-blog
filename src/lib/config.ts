// API 기본 URL (서버/클라이언트 공통). NEXT_PUBLIC_* 는 빌드 시점에 번들에 고정된다.
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.taeklab.cc").replace(/\/+$/, "");
