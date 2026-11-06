// 단일 인스턴스(컨테이너 1개) 기준 메모리 기반 고정 윈도우 rate limiter.
// 인스턴스를 여러 개로 늘리면 Redis 등 공유 저장소로 교체해야 한다.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

function sweep(now: number) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

/** key 에 대한 시도를 1회 기록하고, 한도를 넘었으면 남은 대기 시간(초)을 반환한다. */
export function hit(key: string, limit: number, windowMs: number): { limited: boolean; retryAfter: number } {
    const now = Date.now();
    if (buckets.size > MAX_KEYS) sweep(now);

    let b = buckets.get(key);
    if (!b || b.resetAt <= now) {
        b = { count: 0, resetAt: now + windowMs };
        buckets.set(key, b);
    }
    b.count += 1;
    return { limited: b.count > limit, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
}

export function reset(key: string) {
    buckets.delete(key);
}

/** Cloudflare → 리버스 프록시 → 앱 구조 기준으로 클라이언트 IP 추정 */
export function clientIp(req: Request): string {
    const h = req.headers;
    return (
        h.get("cf-connecting-ip") ??
        h.get("x-real-ip") ??
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown"
    );
}
