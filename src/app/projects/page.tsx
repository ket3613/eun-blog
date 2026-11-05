import type { Metadata } from "next";
import ProjectList from "@/components/ProjectList";
import { getProjects } from "@/lib/backend";
import type { Project } from "@/lib/dataType";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "프로젝트",
    description: "운영/백엔드 중심의 실전 프로젝트 모음",
};

export default async function ProjectsPage() {
    let projects: Project[] = [];
    let failed = false;
    try {
        projects = await getProjects();
    } catch (e) {
        console.error("[projects]", e);
        failed = true;
    }
    return <ProjectList initialProjects={projects} failed={failed} />;
}
