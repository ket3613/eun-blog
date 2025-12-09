"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/lib/data";
import s from "@/styles/projects.module.css";

interface ProjectListProps {
    initialProjects: Project[];
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
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
                <div className={s.filters}>
                    {stacks.map(ch => (
                        <motion.button
                            key={ch}
                            className={`${s.chip} ${filter === ch ? s.chipActive : ""}`}
                            onClick={() => setFilter(ch)}
                            whileHover={{ scale: 1.5}}
                            whileTap={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                            {ch}
                        </motion.button>
                    ))}
                </div>
            </header>

            {/* Grid */}
            <div className={s.grid}>
                {filteredProjects.map((p, i) => (
                    <motion.article
                        key={p.id}
                        className={s.card}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                    >
                        <div className={s.header}>
                            <div className={s.thumb}>
                                <Image src={p.image || "/file.svg"} alt={`${p.name} thumbnail`} fill sizes="64px" />
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
                        <p className={s.description}>{p.description}</p>

                        <div className={s.tags}>
                            {p.stack.map(tag => (
                                <span key={tag.stackName} className={s.tag}>{tag.stackName}</span>
                            ))}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
