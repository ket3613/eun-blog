// 화면 표시용 작은 변환 함수 모음

/** 줄바꿈으로 구분해 저장한 본문을 항목 배열로 */
export function lines(text?: string | null): string[] {
    return (text ?? "").split("\n").map((t) => t.trim()).filter(Boolean);
}

/** 쉼표로 구분해 저장한 값을 배열로 */
export function csv(text?: string | null): string[] {
    return (text ?? "").split(",").map((t) => t.trim()).filter(Boolean);
}

function monthsBetween(start: string, end?: string | null): number {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
    // 종료일이 월말(예: 01-31)이면 그 달까지 근무한 것으로 센다
    const endsFullMonth = end ? new Date(e.getFullYear(), e.getMonth() + 1, 0).getDate() === e.getDate() : false;
    return Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + (endsFullMonth ? 1 : 0));
}

export function formatMonths(months: number): string {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem}개월`;
    if (rem === 0) return `${years}년`;
    return `${years}년 ${rem}개월`;
}

export function duration(start: string, end?: string | null): string {
    return formatMonths(monthsBetween(start, end));
}

/** 가장 이른 입사일부터 지금까지 (PDF 의 "총 경력"과 같은 기준) */
export function totalCareer(items: { startDate: string }[]): string {
    const first = items.map((i) => i.startDate).filter(Boolean).sort()[0];
    return first ? formatMonths(monthsBetween(first, null)) : "";
}

/** "2023-02-01" → "2023-02" */
export function yearMonth(date?: string | null): string {
    return date ? date.slice(0, 7) : "";
}

export function safeHref(url?: string | null): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        return u.protocol === "https:" || u.protocol === "http:" ? url : null;
    } catch {
        return null;
    }
}

export function safeMailto(email?: string | null): string | null {
    if (!email) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}
