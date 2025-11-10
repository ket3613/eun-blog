import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTech, updateTech, deleteTech, saveUpload } from "@/lib/tech";
import { verifyToken } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await getTech(params.id);
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;
  if (!valid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const category = String(form.get("category") || "").trim();
  const tagsStr = String(form.get("tags") || "").trim();
  const content = String(form.get("content") || "").trim();
  const keepStr = String(form.get("existingImages") || "").trim();

  if (!title || !category) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const tags = tagsStr ? tagsStr.split(",").map(s => s.trim()).filter(Boolean) : [];

  const images: string[] = keepStr ? keepStr.split(",").map(s => s.trim()).filter(Boolean) : [];
  const files = form.getAll("images") as File[];
  for (const file of files) {
    if (file && typeof (file as any).arrayBuffer === "function" && file.size > 0) {
      const url = await saveUpload(file);
      images.push(url);
    }
  }

  const updated = await updateTech(params.id, { title, category, tags, content, images });
  if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;
  if (!valid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const ok = await deleteTech(params.id);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
