import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listTech, createTech, saveUpload } from "@/lib/tech";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const list = await listTech();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  // 인증
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;
  if (!valid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const category = String(form.get("category") || "").trim();
  const tagsStr = String(form.get("tags") || "").trim();
  const content = String(form.get("content") || "").trim();

  if (!title || !category) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : [];

  const images: string[] = [];
  const files = form.getAll("images") as File[];
  for (const file of files) {
    if (file && typeof (file as any).arrayBuffer === "function" && file.size > 0) {
      const url = await saveUpload(file);
      images.push(url);
    }
  }

  const post = await createTech({ title, category, tags, content, images });
  return NextResponse.json(post, { status: 201 });
}
