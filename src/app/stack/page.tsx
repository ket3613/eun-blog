import type { Metadata } from "next";
import StackMap, { type StackProject } from "@/components/StackMap";
import { getProfile, getProjects } from "@/lib/backend";
import type { Project, Skill } from "@/lib/dataType";
import c from "@/styles/page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "기술 지도",
    description: "써 본 언어와 라이브러리를 화면, 백엔드, 인프라, 로그·모니터링 순서로 정리한 기술 지도",
};

export default async function StackPage() {
    let skills: Skill[] = [];
    try {
        skills = (await getProfile("강은택")).skills.filter((sk) => sk.lane);
    } catch (e) {
        console.error("[stack]", e);
        return (
            <div className="page">
                <header className={c.head}>
                    <h1 className={c.h1}>기술 지도</h1>
                </header>
                <p className={c.empty} role="alert">
                    기술 목록을 불러오지 못했습니다. API 서버가 응답하지 않습니다. 잠시 후 새로고침해 주세요.
                </p>
            </div>
        );
    }

    // 기술을 누르면 사용한 프로젝트로 이어지도록 이름 → 프로젝트 정보만 넘긴다 (실패해도 지도는 보여 준다)
    let projects: Project[] = [];
    try {
        projects = await getProjects();
    } catch (e) {
        console.error("[stack/projects]", e);
    }
    const projectIndex: Record<string, StackProject> = {};
    for (const p of projects) {
        projectIndex[p.name] = { id: p.id, name: p.name, period: p.period ?? null, summary: p.summary };
    }

    return (
        <div className="page">
            <header className={c.head}>
                <h1 className={c.h1}>기술 지도</h1>
                <p className={c.lead}>
                    실제로 써 본 언어와 라이브러리를 요청이 흐르는 순서대로 놓았습니다. 기술을 누르면 사용한 프로젝트가 나옵니다.
                </p>
            </header>

            {skills.length === 0 ? (
                <p className={c.empty} role="status">기술 지도에 표시할 기술이 없습니다.</p>
            ) : (
                <StackMap skills={skills} projectIndex={projectIndex} />
            )}
        </div>
    );
}
