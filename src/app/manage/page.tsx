import { cookies } from "next/headers";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";
import { API_BASE } from "@/lib/config";
import { Project } from "@/lib/data";
import ManageProjects from "@/components/ManageProjects";

async function fetchProjects(): Promise<Project[]> {
    try {
        const res = await fetch(`${API_BASE}/api/projects/getProjects`, {
            cache: "no-store",
            headers: { accept: "*/*" },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.success && Array.isArray(json.data) ? (json.data as Project[]) : [];
    } catch {
        return [];
    }
}

export default async function ManagePage() {
    const token = (await cookies()).get("session")?.value;
    const valid = token ? await verifyToken(token) : null;

    if (!valid) {
        return (
            <section style={{ padding: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>프로젝트 관리</h1>
                <p>접근 권한이 없습니다. <Link href="/login">로그인</Link> 하세요.</p>
            </section>
        );
    }

    const projects = await fetchProjects();
    return <ManageProjects initialProjects={projects} />;
}
