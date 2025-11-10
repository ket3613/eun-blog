import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type TechPost = {
  id: string;
  title: string;
  category: string; // ex) Java, Spring, AWS 등
  tags: string[];
  content: string; // Markdown or plain text
  images: string[]; // public 경로 (/uploads/xxx.png)
  createdAt: string;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "tech.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads");

async function ensureDirs() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });
}

async function readAll(): Promise<TechPost[]> {
  await ensureDirs();
  try {
    const buf = await fs.readFile(dataFile, "utf8");
    return JSON.parse(buf) as TechPost[];
  } catch (e: any) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeAll(list: TechPost[]) {
  await ensureDirs();
  await fs.writeFile(dataFile, JSON.stringify(list, null, 2), "utf8");
}

export async function listTech(): Promise<TechPost[]> {
  const list = await readAll();
  // 최신순
  return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getTech(id: string): Promise<TechPost | null> {
  const list = await readAll();
  return list.find(p => p.id === id) || null;
}

export async function createTech(input: Omit<TechPost, "id" | "createdAt" | "updatedAt">): Promise<TechPost> {
  const now = new Date().toISOString();
  const post: TechPost = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  const list = await readAll();
  list.push(post);
  await writeAll(list);
  return post;
}

export async function updateTech(id: string, patch: Partial<Omit<TechPost, "id" | "createdAt" | "updatedAt">>): Promise<TechPost | null> {
  const list = await readAll();
  const idx = list.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const updated: TechPost = { ...list[idx], ...patch, updatedAt: now } as TechPost;
  list[idx] = updated;
  await writeAll(list);
  return updated;
}

export async function deleteTech(id: string): Promise<boolean> {
  const list = await readAll();
  const next = list.filter(p => p.id !== id);
  const changed = next.length !== list.length;
  if (changed) await writeAll(next);
  return changed;
}

export async function saveUpload(file: File): Promise<string> {
  await ensureDirs();
  const arrayBuffer = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, "_");
  const outPath = path.join(uploadsDir, safeName);
  await fs.writeFile(outPath, buf);
  return `/uploads/${safeName}`;
}
