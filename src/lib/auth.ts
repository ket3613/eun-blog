import { SignJWT, jwtVerify } from "jose";

// JWT 서명 알고리즘 설정
const alg = "HS256";

// 환경변수에서 비밀키를 가져와 인코딩
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

/**
 * JWT 토큰을 생성하는 함수
 * @param payload - 토큰에 담을 데이터 객체
 * @param expires - 토큰 만료 시간 (기본값: 1시간)
 * @returns 생성된 JWT 토큰 문자열
 */
export async function createToken(payload: object, expires = "1h") {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg }) // 헤더에 알고리즘 설정
        .setIssuedAt() // 발급 시간 설정
        .setExpirationTime(expires) // 만료 시간 설정
        .sign(secret); // 비밀키로 서명
}

/**
 * JWT 토큰을 검증하고 페이로드를 반환하는 함수
 * @param token - 검증할 JWT 토큰 문자열
 * @returns 검증 성공 시 페이로드 객체, 실패 시 null
 */
export async function verifyToken(token: string) {
    try {
        // 토큰 검증 및 페이로드 추출
        const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
        return payload as Record<string, unknown>;
    } catch {
        // 검증 실패 시 null 반환
        return null;
    }
}