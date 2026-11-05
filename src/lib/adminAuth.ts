import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Next.js → Spring 호출 시 사용하는 관리자 토큰 (백엔드와 동일해야 함)
// 소스에 기본값을 두지 않는다. 환경변수 누락 시 요청 시점에 실패시킨다.
export function getAdminToken(): string {
    const token = process.env.ADMIN_TOKEN;
    if (!token) throw new Error("ADMIN_TOKEN environment variable is not set");
    return token;
}

// 세션 쿠키 검증
export async function requireAuth(): Promise<boolean> {
    const token = (await cookies()).get("session")?.value;
    const valid = token ? await verifyToken(token) : null;
    return !!valid;
}

// 프로젝트 id가 숫자(SERIAL PK)인지 검증 - 경로 주입 차단
export function isValidId(id: string): boolean {
    return /^\d+$/.test(id);
}
