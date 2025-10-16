import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { user, pass } = await req.json();
  // 데모 검증. 나중에 DB/API로 교체
  if (user === "user" && pass === "pass") {
    const token = await createToken({ uid: user }, "2h");
    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}