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

    return (
        <section className={s.section}>
            {/* Hero */}
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
                <p style={{ marginTop: 14 }}>{profile.bio}</p>
                {profile.highlights?.length ? (
                    <div className={s.badges} style={{ marginTop: 12 }}>
                        {profile.highlights.map((h, i) => (
                            <motion.span
                                key={h}
                                className={s.badge}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                                whileHover={{ y: -2, scale: 1.03 }}
                            >
                                {h}
                            </motion.span>
                        ))}
                    </div>
                ) : null}
                <div className={s.actions} style={{ marginTop: 16 }}>
                    <a className={`${s.btn} ${s.btnPrimary}`} href={`mailto:${profile.email}`}>이메일</a>
                    <a className={s.btn} href={profile.links} target="_blank" rel="noreferrer">
                        {profile.links}
                    </a>
                    {profile.resumeUrl && (
                        <a className={s.btn} href={profile.resumeUrl}>이력서 PDF</a>
                    )}
                </div>
            </header>

            {/* Cards grid */}
            <div className={s.cards}>
                {/* Skills */}
                {profile.skills?.length ? (
                    <section className={s.card}>
                        <h2 className={s.cardTitle}>기술스택</h2>
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
                                                <span key={sk.skillName} className={s.skillTag} style={{ borderColor: `${color}33` }}>
                                                    {sk.skillName}
                                                    <span className={s.skillTagYear}>{sk.year}년</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </section>
                ) : null}

                {/* Experience */}
                {profile.experience?.length ? (
                    <section className={s.card}>
                        <h2 className={s.cardTitle}>경력</h2>
                        <ul className={s.timeline} style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {profile.experience.map((e) => (
                                <li key={e.startDate} className={s.item}>
                                    <div style={{ fontWeight: 700 }}>{e.role} · {e.org}</div>
                                    <div className={s.period}>{e.startDate} ~ {e.endDate}</div>
                                    <div className={s.note}>{e.note}</div>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}
            </div>
        </section>
    );
}
