import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/adminAuth";
import { getProjects } from "@/lib/backend";
import type { Project } from "@/lib/dataType";
import ManageProjects from "@/components/ManageProjects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "프로젝트 관리",
    robots: { index: false, follow: false },
};

export default async function ManagePage() {
    // middleware 에서 1차로 막지만, 페이지에서도 한 번 더 확인 (심층 방어)
    if (!(await requireAuth())) redirect("/login");

    let projects: Project[] = [];
    try {
        projects = await getProjects();
    } catch (e) {
        console.error("[manage]", e);
    }
    return <ManageProjects initialProjects={projects} />;
}
