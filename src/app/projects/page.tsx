import type { Metadata } from "next";
import ProjectRows from "@/components/ProjectRows";
import { getProjects } from "@/lib/backend";
import type { Project } from "@/lib/dataType";
import c from "@/styles/page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "프로젝트",
    description: "회사에서 맡은 시스템과 개인 프로젝트. 각 항목에서 배경, 해결, 판단, 결과를 볼 수 있습니다.",
};

/** 회사 프로젝트는 소속별로 묶는다 (API 가 준 순서 유지) */
function groupByOrg(projects: Project[]): { org: string; projects: Project[] }[] {
    const groups: { org: string; projects: Project[] }[] = [];
    for (const p of projects) {
        const org = p.org ?? "기타";
        let g = groups.find((x) => x.org === org);
        if (!g) groups.push((g = { org, projects: [] }));
        g.projects.push(p);
    }
    return groups;
}

export default async function ProjectsPage() {
    let projects: Project[] = [];
    let failed = false;
    try {
        projects = await getProjects();
    } catch (e) {
        console.error("[projects]", e);
        failed = true;
    }

    const work = groupByOrg(projects.filter((p) => p.kind === "WORK"));
    const personal = projects.filter((p) => p.kind !== "WORK");

    return (
        <div className="page">
            <header className={c.head}>
                <h1 className={c.h1}>프로젝트</h1>
                <p className={c.lead}>
                    회사에서 맡은 시스템과 개인 프로젝트입니다. 고객사와 시스템 이름은 일반화했습니다.
                </p>
            </header>

            {failed && (
                <p className={c.empty} role="alert">
                    프로젝트를 불러오지 못했습니다. API 서버가 응답하지 않습니다. 잠시 후 새로고침해 주세요.
                </p>
            )}
            {!failed && projects.length === 0 && (
                <p className={c.empty} role="status">등록된 프로젝트가 없습니다.</p>
            )}

            {work.map((g) => (
                <section key={g.org} className={c.section} aria-label={g.org}>
                    <div>
                        <h2 className={c.sectionTitle}>{g.org}</h2>
                        <p className={c.sectionNote}>회사 프로젝트 {g.projects.length}건</p>
                    </div>
                    <ProjectRows projects={g.projects} />
                </section>
            ))}

            {personal.length > 0 && (
                <section className={c.section} aria-label="개인 프로젝트">
                    <div>
                        <h2 className={c.sectionTitle}>개인 프로젝트</h2>
                        <p className={c.sectionNote}>라즈베리파이 5 홈 서버에서 직접 운영합니다.</p>
                    </div>
                    <ProjectRows projects={personal} />
                </section>
            )}
        </div>
    );
}
