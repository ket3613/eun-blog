import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Next.js → Spring 호출 시 사용하는 관리자 토큰 (백엔드와 동일해야 함)
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "9f5238056f0416fdcdf2c8389cfa47883f7ccc8faa9f120c";

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
