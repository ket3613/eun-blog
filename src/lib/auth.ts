import { SignJWT, jwtVerify } from "jose";

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function createToken(payload: object, expires = "1h") {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: [alg] });
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}