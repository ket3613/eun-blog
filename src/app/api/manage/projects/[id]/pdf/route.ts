import { NextRequest } from "next/server";
import { isValidId } from "@/lib/adminAuth";
import { badRequest, forwardToBackend, requireAuth, unauthorized } from "@/lib/server/backendProxy";
import { assertPdf, MAX_PDF_BYTES } from "@/lib/server/validate";

// PDF 업로드 (검증 후 파일만 백엔드로 전달)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAuth())) return unauthorized();
    const { id } = await params;
    if (!isValidId(id)) return badRequest("invalid id");

    // multipart 파싱 전에 선언된 크기로 1차 차단
    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > MAX_PDF_BYTES + 64 * 1024) return badRequest("file: 최대 20MB");

    let file: File;
    try {
        file = await assertPdf((await req.formData()).get("file"));
    } catch (e) {
        return badRequest((e as Error).message);
    }

    const fd = new FormData();
    fd.append("file", file, file.name);
    return forwardToBackend(`/api/projects/${id}/pdf`, { method: "POST", body: fd });
}
