import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TroubleList from "@/components/TroubleList";
import { getProject, NotFoundError, projectPdfUrl } from "@/lib/backend";
import type { Project, Stack } from "@/lib/dataType";
import { lines, safeHref } from "@/lib/format";
import s from "@/styles/project-detail.module.css";
import c from "@/styles/page.module.css";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

/** 숫자 id 만 허용 (경로 조작 방지). 아니면 null */
function parseId(raw: string): number | null {
    return /^\d{1,9}$/.test(raw) ? Number(raw) : null;
}

async function load(rawId: string): Promise<Project> {
    const id = parseId(rawId);
    if (id == null) notFound();
    try {
        return await getProject(id);
    } catch (e) {
        if (e instanceof NotFoundError) notFound();
        throw e; // 그 밖의 오류는 error.tsx 가 처리
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = parseId((await params).id);
    if (id == null) return { title: "프로젝트" };
    try {
        const p = await getProject(id);
        return { title: p.name, description: p.summary };
    } catch {
        return { title: "프로젝트" };
    }
}

function groupStack(stack: Stack[]): { name: string; items: string[] }[] {
    const groups: { name: string; items: string[] }[] = [];
    for (const t of stack) {
        const name = t.categoryName ?? "기타";
        let g = groups.find((x) => x.name === name);
        if (!g) groups.push((g = { name, items: [] }));
        g.items.push(t.stackName);
    }
    return groups;
}

function Bullets({ text }: { text?: string | null }) {
    const items = lines(text);
    if (items.length === 0) return null;
    if (items.length === 1) return <p>{items[0]}</p>;
    return (
        <ul className={s.bullets}>
            {items.map((t) => <li key={t}>{t}</li>)}
        </ul>
    );
}

export default async function ProjectDetailPage({ params }: Props) {
    const p = await load((await params).id);
    const site = safeHref(p.url);
    const repo = safeHref(p.repoUrl);
    const troubles = p.troubleshooting ?? [];

    return (
        <div className="page">
            <header className={c.head}>
                <Link href="/projects" className={c.back}>
                    <span aria-hidden="true">‹ </span>프로젝트 목록
                </Link>
                <h1 className={c.h1}>{p.name}</h1>
                {p.summary && <p className={c.lead}>{p.summary}</p>}

                <dl className={s.meta}>
                    <div>
                        <dt>소속</dt>
                        <dd>{p.org ?? "개인 프로젝트"}</dd>
                    </div>
                    {p.period && (
                        <div>
                            <dt>기간</dt>
                            <dd>{p.period}</dd>
                        </div>
                    )}
                    {p.myRole && (
                        <div>
                            <dt>역할</dt>
                            <dd>{p.myRole}</dd>
                        </div>
                    )}
                </dl>

                {(site || repo || p.pdfName) && (
                    <ul className={s.links}>
                        {site && <li><a className="text-link" href={site} target="_blank" rel="noopener noreferrer">사이트 열기<span className="sr-only"> (새 창)</span></a></li>}
                        {repo && <li><a className="text-link" href={repo} target="_blank" rel="noopener noreferrer">GitHub<span className="sr-only"> (새 창)</span></a></li>}
                        {p.pdfName && <li><a className="text-link" href={projectPdfUrl(p.id)} target="_blank" rel="noopener noreferrer">PDF 내려받기</a></li>}
                    </ul>
                )}
            </header>

            <section className={c.section} aria-labelledby="overview-title">
                <h2 id="overview-title" className={c.sectionTitle}>개요</h2>
                <div>
                    {p.description && <p className={s.overview}>{p.description}</p>}

                    {p.metrics.length > 0 && (
                        <dl className={s.metrics}>
                            {p.metrics.map((m) => (
                                <div key={m.label}>
                                    <dt>{m.label}</dt>
                                    <dd>{m.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </div>
            </section>

            {p.stack.length > 0 && (
                <section className={c.section} aria-labelledby="stack-title">
                    <h2 id="stack-title" className={c.sectionTitle}>기술</h2>
                    <dl className={s.stack}>
                        {groupStack(p.stack).map((g) => (
                            <div key={g.name}>
                                <dt>{g.name}</dt>
                                <dd className={c.tags}>
                                    {g.items.map((t) => <span key={t} className={c.tag}>{t}</span>)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {p.achievements.length > 0 && (
                <section className={c.section} aria-labelledby="work-title">
                    <div>
                        <h2 id="work-title" className={c.sectionTitle}>한 일</h2>
                        <p className={c.sectionNote}>{p.achievements.length}건</p>
                    </div>
                    <ol className={s.works}>
                        {p.achievements.map((a) => (
                            <li key={a.id} className={s.work}>
                                <header className={s.workHead}>
                                    <h3>{a.title}</h3>
                                    {a.period && <p>{a.period}</p>}
                                </header>
                                {a.resumeLine && <p className={s.workSummary}>{a.resumeLine}</p>}
                                <dl className={s.story}>
                                    {a.background && (
                                        <div>
                                            <dt>배경</dt>
                                            <dd><p>{a.background}</p></dd>
                                        </div>
                                    )}
                                    {a.solution && (
                                        <div>
                                            <dt>해결</dt>
                                            <dd><Bullets text={a.solution} /></dd>
                                        </div>
                                    )}
                                    {a.decision && (
                                        <div>
                                            <dt>판단</dt>
                                            <dd><Bullets text={a.decision} /></dd>
                                        </div>
                                    )}
                                    {a.result && (
                                        <div className={s.storyResult}>
                                            <dt>결과</dt>
                                            <dd><p>{a.result}</p></dd>
                                        </div>
                                    )}
                                </dl>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {troubles.length > 0 && (
                <section className={c.section} aria-labelledby="trouble-title">
                    <div>
                        <h2 id="trouble-title" className={c.sectionTitle}>트러블슈팅</h2>
                        <p className={c.sectionNote}>이 프로젝트에서 겪은 문제 {troubles.length}건</p>
                    </div>
                    <TroubleList items={troubles} />
                </section>
            )}
        </div>
    );
}
