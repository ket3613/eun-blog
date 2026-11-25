"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import type { Lane, Project, Skill } from "@/lib/dataType";
import { csv } from "@/lib/format";
import s from "@/styles/stack.module.css";

export type StackProject = Pick<Project, "id" | "name" | "summary"> & { period: string | null };

const LANES: { key: Lane; title: string; desc: string; area: string }[] = [
    { key: "FRONT", title: "Front", desc: "사용자가 보는 화면", area: s.front },
    { key: "BACKEND", title: "Backend", desc: "API, 데이터, 외부 연동", area: s.backend },
    { key: "INFRA", title: "인프라", desc: "빌드, 배포, 실행 환경", area: s.infra },
    { key: "LOG", title: "Log · 모니터링", desc: "로그와 지표 수집, 대시보드", area: s.log },
];

/** 로고가 없는 기술에 쓸 글자 아이콘. "EAI (SOAP)" → "EAI", "OAuth 2.0" → "OA" */
function monogram(name: string): string {
    const head = name.split(/[\s(·/]/)[0];
    if (head.length <= 3) return head;
    const caps = head.replace(/[^A-Z]/g, "");
    return (caps.length >= 2 ? caps : head).slice(0, 2);
}

/** DB 에 저장된 로고 경로는 사이트 내부 경로만 쓴다 */
function logoSrc(path?: string | null): string | null {
    return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}

/** 칸 안에서 묶음 없는 기술을 먼저, 그다음 묶음별로 (API 가 준 순서 유지) */
function groupLane(skills: Skill[]): { group: string | null; skills: Skill[] }[] {
    const groups: { group: string | null; skills: Skill[] }[] = [];
    for (const sk of skills) {
        const group = sk.laneGroup ?? null;
        let g = groups.find((x) => x.group === group);
        if (!g) groups.push((g = { group, skills: [] }));
        g.skills.push(sk);
    }
    return groups.sort((a, b) => Number(a.group != null) - Number(b.group != null));
}

function Connector({ label, kind, className }: { label: string; kind: "request" | "log"; className: string }) {
    return (
        <div className={`${s.connector} ${kind === "log" ? s.connectorLog : ""} ${className}`} aria-hidden="true">
            <span className={s.wire} />
            <span className={s.wireLabel}>{label}</span>
        </div>
    );
}

export default function StackMap({ skills, projectIndex }: { skills: Skill[]; projectIndex: Record<string, StackProject> }) {
    const [selected, setSelected] = useState<string | null>(null);
    const detailId = useId();
    const current = skills.find((sk) => sk.skillName === selected) ?? null;

    // 컴포넌트가 아니라 함수로 그린다 (렌더마다 새 컴포넌트가 되면 버튼이 다시 만들어져 포커스를 잃는다)
    function renderChip(sk: Skill) {
        const src = logoSrc(sk.imagePath);
        const active = sk.skillName === selected;
        const side = sk.level === "사이드";
        return (
            <li key={sk.skillName}>
                <button
                    type="button"
                    className={`${s.chip} ${side ? s.chipSide : ""} ${active ? s.chipActive : ""}`}
                    aria-pressed={active}
                    aria-controls={detailId}
                    onClick={() => setSelected(active ? null : sk.skillName)}
                >
                    <span className={s.logo}>
                        {src ? (
                            <Image src={src} alt="" width={20} height={20} unoptimized />
                        ) : (
                            <span className={s.mono}>{monogram(sk.skillName)}</span>
                        )}
                    </span>
                    <span className={s.chipName}>{sk.skillName}</span>
                    {side && <span className="sr-only"> (개인 프로젝트)</span>}
                </button>
            </li>
        );
    }

    const usedIn = current ? csv(current.usedIn) : [];

    return (
        <div>
            <ul className={s.legend} aria-label="범례">
                <li><span className={s.legendRequest} aria-hidden="true" />요청·배포 흐름</li>
                <li><span className={s.legendLog} aria-hidden="true" />로그·지표 수집</li>
                <li><span className={s.legendSide} aria-hidden="true" />개인 프로젝트에서만 사용</li>
            </ul>

            <div className={`${s.map} ${selected ? s.hasSelection : ""}`}>
                {LANES.map((lane) => {
                    const laneSkills = skills.filter((sk) => sk.lane === lane.key);
                    return (
                        <section key={lane.key} className={`${s.lane} ${lane.area}`} aria-label={lane.title}>
                            <header className={s.laneHead}>
                                <h2 className={s.laneTitle}>{lane.title}</h2>
                                <p className={s.laneDesc}>{lane.desc}</p>
                            </header>
                            {groupLane(laneSkills).map((g) => (
                                <div key={g.group ?? "base"} className={s.group}>
                                    {g.group && <h3 className={s.groupTitle}>{g.group}</h3>}
                                    <ul className={s.chips}>
                                        {g.skills.map(renderChip)}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    );
                })}

                <Connector label="HTTP · REST" kind="request" className={s.c1} />
                <Connector label="배포 · 실행" kind="request" className={s.c2} />
                <Connector label="RUM" kind="log" className={s.l1} />
                <Connector label="로그 · APM" kind="log" className={s.l2} />
                <Connector label="지표" kind="log" className={s.l3} />
            </div>

            <section id={detailId} className={s.detail} aria-live="polite">
                {current ? (
                    <>
                        <h2 className={s.detailTitle}>{current.skillName}</h2>
                        <p className={s.detailMeta}>
                            {current.level === "사이드" ? "개인 프로젝트에서 사용" : current.level === "실무" ? "회사 프로젝트에서 사용" : "사용 경험"}
                            {usedIn.length > 0 && `, 프로젝트 ${usedIn.length}개`}
                        </p>
                        {usedIn.length > 0 ? (
                            <ul className={s.used}>
                                {usedIn.map((name) => {
                                    const p = projectIndex[name];
                                    return (
                                        <li key={name}>
                                            {p ? (
                                                <Link className={s.usedLink} href={`/projects/${p.id}`}>
                                                    <span className={s.usedName}>{p.name}</span>
                                                    {p.summary && <span className={s.usedSummary}>{p.summary}</span>}
                                                    {p.period && <span className={s.usedPeriod}>{p.period}</span>}
                                                </Link>
                                            ) : (
                                                <span className={s.usedLink}><span className={s.usedName}>{name}</span></span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className={s.detailMeta}>연결된 프로젝트 기록이 없습니다.</p>
                        )}
                    </>
                ) : (
                    <p className={s.detailHint}>기술을 누르면 그 기술을 쓴 프로젝트가 여기에 나옵니다.</p>
                )}
            </section>
        </div>
    );
}
