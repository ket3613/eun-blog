import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    (await cookies()).set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });
    return NextResponse.redirect(new URL("/", req.url));
}
