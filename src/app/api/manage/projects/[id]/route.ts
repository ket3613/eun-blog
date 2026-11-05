import { NextRequest } from "next/server";
import { isValidId } from "@/lib/adminAuth";
import { badRequest, forwardToBackend, requireAuth, unauthorized } from "@/lib/server/backendProxy";
import { parseProjectInput, readJson } from "@/lib/server/validate";

type Ctx = { params: Promise<{ id: string }> };

// 프로젝트 수정
export async function PUT(req: NextRequest, { params }: Ctx) {
    if (!(await requireAuth())) return unauthorized();
    const { id } = await params;
    if (!isValidId(id)) return badRequest("invalid id");

    let input;
    try {
        input = parseProjectInput(await readJson(req));
    } catch (e) {
        return badRequest((e as Error).message);
    }
    return forwardToBackend(`/api/projects/${id}`, { method: "PUT", json: input });
}

// 프로젝트 삭제
export async function DELETE(_req: NextRequest, { params }: Ctx) {
    if (!(await requireAuth())) return unauthorized();
    const { id } = await params;
    if (!isValidId(id)) return badRequest("invalid id");

    return forwardToBackend(`/api/projects/${id}`, { method: "DELETE" });
}
