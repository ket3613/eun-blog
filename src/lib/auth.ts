import { SignJWT, jwtVerify } from "jose";

const alg = "HS256";

function getSecret(): Uint8Array {
    const raw = process.env.AUTH_SECRET;
    if (!raw) throw new Error("AUTH_SECRET environment variable is not set");
    return new TextEncoder().encode(raw);
}

export async function createToken(payload: object, expires = "1h") {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(expires)
        .sign(getSecret());
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: [alg] });
        return payload as Record<string, unknown>;
    } catch {
        return null;
    }
}
