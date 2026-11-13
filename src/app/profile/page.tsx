import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProjectRows from "@/components/ProjectRows";
import { getProfile, getProjects } from "@/lib/backend";
import type { Credential, Profile, Project, Skill } from "@/lib/dataType";
import { duration, safeHref, safeMailto, totalCareer, yearMonth } from "@/lib/format";
import s from "@/styles/profile.module.css";
import c from "@/styles/page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "프로필",
    description: "백엔드 개발자 강은택의 핵심 역량, 기술 스택, 경력",
};

const CREDENTIAL_ORDER: Credential["type"][] = ["자격증", "수상", "교육", "학력"];

function groupSkills(skills: Skill[]): { name: string; skills: Skill[] }[] {
    // API 가 분류 순서대로 정렬해서 주므로 처음 나온 순서를 그대로 쓴다
    const groups: { name: string; skills: Skill[] }[] = [];
    for (const sk of skills) {
        const name = sk.categoryName ?? "기타";
        let g = groups.find((x) => x.name === name);
        if (!g) groups.push((g = { name, skills: [] }));
        g.skills.push(sk);
    }
    return groups;
}

export default async function ProfilePage() {
    let profile: Profile;
    try {
        profile = await getProfile("강은택");
    } catch (err) {
        console.error("[profile]", err);
        return (
            <div className="page">
                <p className={c.empty} role="alert" style={{ marginTop: 56 }}>
                    프로필을 불러오지 못했습니다. API 서버가 응답하지 않습니다. 잠시 후 새로고침해 주세요.
                </p>
            </div>
        );
    }

    // 주요 프로젝트는 실패해도 프로필은 보여 준다
    let featured: Project[] = [];
    try {
        featured = (await getProjects()).filter((p) => p.featured);
    } catch (err) {
        console.error("[profile/projects]", err);
    }

    const mail = safeMailto(profile.email);
    const github = safeHref(profile.links);
    const career = totalCareer(profile.experience);
    const facts = [
        ...(career ? [{ value: career, label: "총 경력", note: "2020-04부터 현재까지" }] : []),
        ...profile.highlights,
    ];

    return (
        <div className="page">
            <header className={s.hero}>
                <div className={s.intro}>
                    <div className={s.who}>
                        <div className={s.avatar}>
                            <Image src="/my_image.jpeg" alt="" fill sizes="56px" priority />
                        </div>
                        <p>
                            <strong className={s.name}>{profile.name}</strong>
                            <span className={s.job}>{profile.title}</span>
                        </p>
                    </div>
                    <h1 className={s.headline}>{profile.headline ?? profile.title}</h1>
                    <p className={s.bio}>{profile.bio}</p>
                    <ul className={s.contact}>
                        {mail && <li><a className={s.contactPrimary} href={mail}>{profile.email}</a></li>}
                        {github && (
                            <li>
                                <a className={s.contactLink} href={github} target="_blank" rel="noopener noreferrer">
                                    GitHub<span className="sr-only"> (새 창)</span>
                                </a>
                            </li>
                        )}
                        <li><Link className={s.contactLink} href="/projects">프로젝트 전체 보기</Link></li>
                    </ul>
                </div>

                {profile.upgrades.length > 0 && (
                    <section className={s.diff} aria-labelledby="upgrades-title">
                        <h2 id="upgrades-title" className={s.diffTitle}>운영 중에 올린 버전</h2>
                        <ol className={s.diffList}>
                            {profile.upgrades.map((u, i) => (
                                <li key={`${u.fromVersion}-${u.toVersion}`} className={s.diffItem} style={{ "--i": i } as React.CSSProperties}>
                                    <p className={s.diffDel}>
                                        <span className={s.diffSign} aria-hidden="true">−</span>
                                        <span className="sr-only">이전 </span>
                                        {u.fromVersion}
                                    </p>
                                    <p className={s.diffAdd}>
                                        <span className={s.diffSign} aria-hidden="true">+</span>
                                        <span className="sr-only">이후 </span>
                                        {u.toVersion}
                                    </p>
                                    <p className={s.diffNote}>
                                        {u.projectId != null && u.projectName ? (
                                            <Link className="text-link" href={`/projects/${u.projectId}`}>{u.projectName}</Link>
                                        ) : null}
                                        {u.note && <span>{u.note}</span>}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}
            </header>

            {facts.length > 0 && (
                <dl className={s.facts}>
                    {facts.map((f) => (
                        <div key={f.label} className={s.fact}>
                            <dt>{f.label}</dt>
                            <dd>
                                <span className={s.factValue}>{f.value}</span>
                                {f.note && <span className={s.factNote}>{f.note}</span>}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            {profile.competencies.length > 0 && (
                <section className={c.section} aria-labelledby="competency-title">
                    <h2 id="competency-title" className={c.sectionTitle}>핵심 역량</h2>
                    <dl className={s.defs}>
                        {profile.competencies.map((k) => (
                            <div key={k.title} className={s.def}>
                                <dt>{k.title}</dt>
                                <dd>{k.description}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {featured.length > 0 && (
                <section className={c.section} aria-labelledby="featured-title">
                    <div>
                        <h2 id="featured-title" className={c.sectionTitle}>주요 프로젝트</h2>
                        <p className={c.sectionNote}>항목을 누르면 배경, 해결, 판단, 결과를 볼 수 있습니다.</p>
                    </div>
                    <ProjectRows projects={featured} />
                </section>
            )}

            {profile.experience.length > 0 && (
                <section className={c.section} aria-labelledby="experience-title">
                    <h2 id="experience-title" className={c.sectionTitle}>경력</h2>
                    <ol className={s.jobs}>
                        {profile.experience.map((e) => (
                            <li key={`${e.org}-${e.startDate}`} className={s.jobItem}>
                                <p className={s.jobPeriod}>
                                    {yearMonth(e.startDate)} ~ {e.endDate ? yearMonth(e.endDate) : "재직 중"}
                                    <span>{duration(e.startDate, e.endDate)}</span>
                                </p>
                                <div>
                                    <h3 className={s.jobOrg}>{e.org}</h3>
                                    <p className={s.jobRole}>{e.role}</p>
                                    <p className={s.jobNote}>{e.note}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {profile.skills.length > 0 && (
                <section className={c.section} aria-labelledby="skills-title">
                    <div>
                        <h2 id="skills-title" className={c.sectionTitle}>기술 스택</h2>
                        <p className={c.sectionNote}>
                            <span className={s.sideMark}>점선</span>은 개인 프로젝트에서만 쓴 기술입니다.
                        </p>
                    </div>
                    <dl className={s.skills}>
                        {groupSkills(profile.skills).map((g) => (
                            <div key={g.name} className={s.skillRow}>
                                <dt>{g.name}</dt>
                                <dd className={c.tags}>
                                    {g.skills.map((sk) => (
                                        <span
                                            key={sk.skillName}
                                            className={`${c.tag} ${sk.level === "사이드" ? s.tagSide : ""}`}
                                            title={sk.usedIn ? `사용한 프로젝트: ${sk.usedIn.split(",").join(", ")}` : undefined}
                                        >
                                            {sk.skillName}
                                            {sk.level === "사이드" && <span className="sr-only"> (개인 프로젝트)</span>}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            )}

            {profile.credentials.length > 0 && (
                <section className={c.section} aria-labelledby="credential-title">
                    <h2 id="credential-title" className={c.sectionTitle}>자격 · 수상 · 학력</h2>
                    <dl className={s.skills}>
                        {CREDENTIAL_ORDER.map((type) => {
                            const rows = profile.credentials.filter((x) => x.type === type);
                            if (rows.length === 0) return null;
                            return (
                                <div key={type} className={s.skillRow}>
                                    <dt>{type}</dt>
                                    <dd>
                                        <ul className={s.creds}>
                                            {rows.map((x) => (
                                                <li key={x.title}>
                                                    <span className={s.credTitle}>
                                                        {x.title}
                                                        {(x.issuer || x.note) && (
                                                            <span className={s.credSub}>
                                                                {[x.issuer, x.note].filter(Boolean).join(", ")}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {x.period && <span className={s.credPeriod}>{x.period}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </dd>
                                </div>
                            );
                        })}
                    </dl>
                </section>
            )}
        </div>
    );
}
