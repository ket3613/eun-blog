import { projects } from "@/lib/data";

/**
 * 프로젝트 목록을 보여주는 페이지
 */
export default function ProjectsPage() {
    return (
        <section>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>프로젝트</h1>
            {/* 프로젝트 목록을 그리드 레이아웃으로 표시 */}
            <div style={{ display: "grid", gap: 12 }}>
                {projects.map(p => (
                    // 각 프로젝트를 카드 형태로 표시
                    <article key={p.id} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 16 }}>
                        {/* 프로젝트 이름 */}
                        <h2 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{p.name}</h2>
                        {/* 프로젝트 요약 설명 */}
                        <p style={{ margin: "0 0 10px 0", color: "#9aa0a6" }}>{p.summary}</p>
                        {/* 사용된 기술 스택을 태그 형태로 표시 */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {p.stack.map(s => <span key={s} style={{ fontSize: 12, border: "1px solid #1f232b", padding: "4px 6px", borderRadius: 8 }}>{s}</span>)}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}