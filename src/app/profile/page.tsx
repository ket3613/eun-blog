"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import s from "@/styles/profile.module.css";
import { useEffect, useState } from "react";
import { Profile, Skill } from "@/lib/dataType";
import { getProfile } from "@/app/api/profile";

const CATEGORY_LABELS: Record<number, string> = {
    1: "Backend",
    2: "Frontend",
    3: "Infra",
    4: "Other",
};

const CATEGORY_COLORS: Record<number, string> = {
    1: "#3b82f6",
    2: "#a855f7",
    3: "#22c55e",
    4: "#f97316",
};

const LEVEL_LABELS: Record<string, string> = {
    "실무": "실무",
    "사이드": "사이드",
    "학습": "학습",
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
        <span className={`${s.skillTag} ${s[`skillLevel_${level}`] ?? ""}`}>
            {sk.skillName}
            <span className={`${s.skillLevelBadge} ${s[`badge_${level}`] ?? s.badge_학습}`}>
                {LEVEL_LABELS[level] ?? level}
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

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProfile("강은택")
            .then(setProfile)
            .catch((err) => {
                console.error(err);
                setError("프로필을 불러오지 못했습니다.");
            });
    }, []);

    if (error) {
        return <div className={s.container}>{error}</div>;
    }

    if (!profile) {
        return (
            <div className={s.container}>
                프로필을 불러오는 중입니다...
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
                        <Image src="/my_image.jpeg" alt={`${profile.name} avatar`} fill sizes="360px" />
                    </div>
                    <div>
                        <h1 className={s.name}>{profile.name}</h1>
                        <p className={s.title}>{profile.title}</p>
                    </div>
                </div>

                {heroSummary && (
                    <div className={s.heroSummaryLine}>
                        {heroSummary}
                    </div>
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
                                return (
                                    <div key={cat} className={s.skillGroup}>
                                        <h3
                                            className={s.skillGroupTitle}
                                            style={{ borderLeftColor: color, color }}
                                        >
                                            {CATEGORY_LABELS[Number(cat)] ?? `Category ${cat}`}
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
                                <li key={e.startDate} className={s.item}>
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
