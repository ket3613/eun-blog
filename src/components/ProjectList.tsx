"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/dataType";
import { projectPdfUrl } from "@/lib/backend";
import s from "@/styles/projects.module.css";

interface ProjectListProps {
    initialProjects: Project[];
    failed?: boolean;
}

export default function ProjectList({ initialProjects, failed = false }: ProjectListProps) {
    const reduceMotion = useReducedMotion();
    const [filter, setFilter] = useState<string>("ALL");

    const stacks = useMemo(() => {
        const set = new Set<string>();
        initialProjects.forEach((p) =>
            p.stack.forEach((tag) => set.add(tag.stackName))
        );
        return ["ALL", ...Array.from(set)];
    }, [initialProjects]);

    const filteredProjects = useMemo(() => {
        if (filter === "ALL") return initialProjects;
        return initialProjects.filter((p) =>
            p.stack.some((t) => t.stackName === filter)
        );
    }, [filter, initialProjects]);

    return (
        <section className={s.section}>
            {/* Hero */}
            <header className={s.hero}>
                <div className={s.glow} />
                <h1 className={s.title}>프로젝트</h1>
                <p className={s.subtitle}>운영/백엔드 중심의 실전 프로젝트 모음</p>
                <div className={s.filters} role="group" aria-label="기술 스택 필터">
                    {stacks.map(ch => (
                        <motion.button
                            key={ch}
                            type="button"
                            aria-pressed={filter === ch}
                            className={`${s.chip} ${filter === ch ? s.chipActive : ""}`}
                            onClick={() => setFilter(ch)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                            {ch}
                        </motion.button>
                    ))}
                </div>
            </header>

            {(failed || filteredProjects.length === 0) && (
                <div className={s.empty} role={failed ? "alert" : "status"}>
                    {failed ? "프로젝트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." : "등록된 프로젝트가 없습니다."}
                </div>
            )}

            {/* Grid */}
            <div className={s.grid}>
                {filteredProjects.map((p, i) => (
                    <motion.article
                        key={p.id}
                        className={s.card}
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i, 10) * 0.05 }}
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                    >
                        <div className={s.header}>
                            <div className={s.thumb}>
                                <Image src={p.image || "/file.svg"} alt="" fill sizes="64px" />
                            </div>
                            <div>
                                <h2 className={s.name}>{p.name}</h2>
                                <div className={s.meta}>
                                    {p.year ? <span>{p.year}</span> : null}
                                    <span>{p.stack[0]?.stackName ?? "스택 없음"} 외 {Math.max(0, p.stack.length - 1)}개</span>
                                </div>
                            </div>
                        </div>

                        <p className={s.summary}>{p.summary}</p>

                        {p.myRole && (
                            <div className={s.myRole}>
                                <strong className={s.myRoleLabel}>내 역할</strong>
                                {p.myRole}
                            </div>
                        )}

                        {p.description && <p className={s.description}>{p.description}</p>}

                        <div className={s.tags}>
                            {p.stack.map(tag => (
                                <span key={tag.stackName} className={s.tag}>{tag.stackName}</span>
                            ))}
                        </div>

                        {p.pdfName && (
                            <div className={s.actions}>
                                <a
                                    className={s.link}
                                    href={projectPdfUrl(p.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span aria-hidden="true">📄</span> PDF 내려받기
                                </a>
                            </div>
                        )}
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
