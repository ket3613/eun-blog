import type { Metadata } from "next";
import Image from "next/image";
import s from "@/styles/profile.module.css";
import type { Profile, Skill } from "@/lib/dataType";
import { getProfile } from "@/lib/backend";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "프로필",
    description: "백엔드 엔지니어 강은택의 기술 스택과 경력",
};

const CATEGORY_COLORS: Record<number, string> = {
    1: "#3b82f6",
    2: "#a855f7",
    3: "#22c55e",
    4: "#f97316",
};

function calcDuration(start: string, end?: string | null): string {
    if (!start) return "";
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem}개월`;
    if (rem === 0) return `${years}년`;
    return `${years}년 ${rem}개월`;
}

function safeHref(url?: string | null): string {
    if (!url) return "#";
    try {
        const u = new URL(url);
        return (u.protocol === "https:" || u.protocol === "http:") ? url : "#";
    } catch {
        return "#";
    }
}

function safeMailto(email?: string | null): string {
    if (!email) return "#";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : "#";
}

function SkillTag({ sk }: { sk: Skill }) {
    const level = sk.level ?? "학습";
    const projects = sk.usedIn ? sk.usedIn.split(",").map(p => p.trim()).filter(Boolean) : [];

    return (
        <span className={s.skillTag} tabIndex={projects.length > 0 ? 0 : undefined}>
            {sk.skillName}
            <span className={`${s.skillLevelBadge} ${s[`badge_${level}`] ?? s.badge_학습}`}>
                {level}
            </span>
            <span className={s.skillTagYear}>{sk.year}년</span>
            {projects.length > 0 && (
                <span className={s.skillTooltip}>
                    <span className={s.skillTooltipTitle}>사용한 프로젝트</span>
                    {projects.map(p => (
                        <span key={p} className={s.skillTooltipItem}>📦 {p}</span>
                    ))}
                </span>
            )}
        </span>
    );
}

export default async function ProfilePage() {
    let profile: Profile;
    try {
        profile = await getProfile("강은택");
    } catch (err) {
        console.error("[profile]", err);
        return (
            <div className={s.container} role="alert">
                프로필을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </div>
        );
    }

    const skillsByCategory = profile.skills?.reduce<Record<number, Skill[]>>((acc, sk) => {
        (acc[sk.category] ??= []).push(sk);
        return acc;
    }, {}) ?? {};

    const heroSummary = profile.highlights?.join(" · ");

    return (
        <section className={s.section}>
            <header className={s.hero}>
                <div className={s.heroGlow} />
                <div className={s.row}>
                    <div className={s.avatar}>
                        <Image src="/my_image.jpeg" alt={`${profile.name} 프로필 사진`} fill sizes="(max-width: 640px) 96px, 140px" priority />
                    </div>
                    <div>
                        <h1 className={s.name}>{profile.name}</h1>
                        <p className={s.title}>{profile.title}</p>
                    </div>
                </div>

                {heroSummary && (
                    <div className={s.heroSummaryLine}>{heroSummary}</div>
                )}

                <p style={{ marginTop: 14 }}>{profile.bio}</p>
                <div className={s.actions} style={{ marginTop: 16 }}>
                    <a className={`${s.btn} ${s.btnPrimary}`} href={safeMailto(profile.email)}>이메일</a>
                    {safeHref(profile.links) !== "#" && (
                        <a className={s.btn} href={safeHref(profile.links)} target="_blank" rel="noopener noreferrer">
                            {profile.links}
                        </a>
                    )}
                    {profile.resumeUrl && safeHref(profile.resumeUrl) !== "#" && (
                        <a className={s.btn} href={safeHref(profile.resumeUrl)}>이력서 PDF</a>
                    )}
                </div>
            </header>

            <div className={s.cards}>
                {profile.skills?.length ? (
                    <section className={s.card}>
                        <h2 className={s.cardTitle}>기술스택</h2>
                        <div className={s.skillLegend}>
                            <span className={`${s.legendItem} ${s.badge_실무}`}>실무</span>
                            <span className={`${s.legendItem} ${s.badge_사이드}`}>사이드</span>
                            <span className={`${s.legendItem} ${s.badge_학습}`}>학습</span>
                        </div>
                        {Object.entries(skillsByCategory)
                            .sort(([a], [b]) => Number(a) - Number(b))
                            .map(([cat, skills]) => {
                                const color = CATEGORY_COLORS[Number(cat)] ?? "#6b7280";
                                // API에서 categoryName이 오면 그걸 사용, 없으면 첫 번째 스킬 기준
                                const label = skills[0]?.categoryName ?? `Category ${cat}`;
                                return (
                                    <div key={cat} className={s.skillGroup}>
                                        <h3 className={s.skillGroupTitle} style={{ borderLeftColor: color, color }}>
                                            {label}
                                        </h3>
                                        <div className={s.skillTags}>
                                            {skills.map((sk) => (
                                                <SkillTag key={sk.skillName} sk={sk} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </section>
                ) : null}

                {profile.experience?.length ? (
                    <section className={s.card}>
                        <h2 className={s.cardTitle}>경력</h2>
                        <ul className={s.timeline} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {profile.experience.map((e) => (
                                <li key={`${e.org}-${e.startDate}`} className={s.item}>
                                    <div className={s.itemHeader}>
                                        <span style={{ fontWeight: 700 }}>{e.role} · {e.org}</span>
                                        <span className={s.itemDuration}>{calcDuration(e.startDate, e.endDate)}</span>
                                    </div>
                                    <div className={s.period}>{e.startDate} ~ {e.endDate || "현재"}</div>
                                    <div className={s.note}>{e.note}</div>
                                    {e.stack && (
                                        <div className={s.expStack}>
                                            {e.stack.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                                                <span key={t} className={s.expStackTag}>{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}
            </div>
        </section>
    );
}
