// 관리 API 입력 검증 (외부 라이브러리 없이 필요한 범위만)

export type ProjectInput = {
    name: string;
    summary: string;
    description: string;
    myRole: string;
    year: string;
    image: string;
    stack: { stackName: string; category: number }[];
};

const LIMITS = { name: 200, summary: 500, description: 5000, myRole: 2000, year: 20, image: 300 } as const;
export const MAX_JSON_BYTES = 64 * 1024;
export const MAX_PDF_BYTES = 20 * 1024 * 1024;

function str(v: unknown, max: number, field: string): string {
    if (v == null) return "";
    if (typeof v !== "string") throw new Error(`${field}: 문자열이어야 합니다`);
    const s = v.trim();
    if (s.length > max) throw new Error(`${field}: 최대 ${max}자`);
    return s;
}

/** 허용된 필드만 추려서 반환. 잘못된 입력이면 Error 를 던진다. */
export function parseProjectInput(raw: unknown): ProjectInput {
    if (!raw || typeof raw !== "object") throw new Error("잘못된 요청 형식");
    const o = raw as Record<string, unknown>;

    const name = str(o.name, LIMITS.name, "name");
    if (!name) throw new Error("name: 필수 항목");

    // next/image 로 렌더링되므로 사이트 내부 경로만 허용 ("//host" 같은 프로토콜 상대 URL 차단)
    const image = str(o.image, LIMITS.image, "image");
    if (image && (!image.startsWith("/") || image.startsWith("//"))) {
        throw new Error("image: '/' 로 시작하는 내부 경로만 허용");
    }

    if (o.stack != null && !Array.isArray(o.stack)) throw new Error("stack: 배열이어야 합니다");
    const stackRaw = (o.stack as unknown[] | undefined) ?? [];
    if (stackRaw.length > 50) throw new Error("stack: 최대 50개");
    const stack = stackRaw.map((t, i) => {
        const r = (t ?? {}) as Record<string, unknown>;
        const stackName = str(r.stackName, 50, `stack[${i}].stackName`);
        const category = Number(r.category);
        if (!stackName) throw new Error(`stack[${i}].stackName: 필수 항목`);
        if (!Number.isInteger(category) || category < 1 || category > 99) throw new Error(`stack[${i}].category: 정수`);
        return { stackName, category };
    });

    return {
        name,
        summary: str(o.summary, LIMITS.summary, "summary"),
        description: str(o.description, LIMITS.description, "description"),
        myRole: str(o.myRole, LIMITS.myRole, "myRole"),
        year: str(o.year, LIMITS.year, "year"),
        image,
        stack,
    };
}

/** 요청 본문을 크기 제한과 함께 JSON 으로 읽는다. */
export async function readJson(req: Request): Promise<unknown> {
    const text = await req.text();
    if (text.length > MAX_JSON_BYTES) throw new Error("요청 본문이 너무 큽니다");
    try {
        return JSON.parse(text);
    } catch {
        throw new Error("JSON 형식이 아닙니다");
    }
}

/** 업로드 파일이 실제 PDF 인지(크기·MIME·매직 바이트) 확인 */
export async function assertPdf(file: unknown): Promise<File> {
    if (!(file instanceof File)) throw new Error("file: PDF 파일이 필요합니다");
    if (file.size === 0) throw new Error("file: 빈 파일");
    if (file.size > MAX_PDF_BYTES) throw new Error("file: 최대 20MB");
    if (file.type && file.type !== "application/pdf") throw new Error("file: PDF 형식만 허용");
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (String.fromCharCode(...head) !== "%PDF-") throw new Error("file: 올바른 PDF 가 아닙니다");
    return file;
}
