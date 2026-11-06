import { NextRequest } from "next/server";
import { badRequest, forwardToBackend, requireAuth, unauthorized } from "@/lib/server/backendProxy";
import { parseProjectInput, readJson } from "@/lib/server/validate";

// 프로젝트 생성
export async function POST(req: NextRequest) {
    if (!(await requireAuth())) return unauthorized();

    let input;
    try {
        input = parseProjectInput(await readJson(req));
    } catch (e) {
        return badRequest((e as Error).message);
    }
    return forwardToBackend("/api/projects", { method: "POST", json: input });
}
