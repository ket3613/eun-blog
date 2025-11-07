"use client";
import Image from "next/image";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import s from "@/styles/projects.module.css";
import { useMemo, useState } from "react";

/**
 * 프로젝트 목록을 더 화려하고 깔끔하게 보여주는 페이지
 */
export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>("ALL");

  const stacks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.stack.forEach(s => set.add(s)));
    return ["ALL", ...Array.from(set)];
  }, []);

  const list = useMemo(() => {
    if (filter === "ALL") return projects;
    return projects.filter(p => p.stack.includes(filter));
  }, [filter]);

  return (
    <section className={s.section}>
      {/* Hero */}
      <header className={s.hero}>
        <div className={s.glow} />
        <h1 className={s.title}>프로젝트</h1>
        <p className={s.subtitle}>운영/백엔드 중심의 실전 프로젝트 모음</p>
        <div className={s.filters}>
          {stacks.map(ch => (
            <button
              key={ch}
              className={`${s.chip} ${filter === ch ? s.chipActive : ""}`}
              onClick={() => setFilter(ch)}
            >
              {ch}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className={s.grid}>
        {list.map((p, i) => (
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
                  <span>{p.stack[0]} 외 {Math.max(0, p.stack.length - 1)}개</span>
                </div>
              </div>
            </div>

            <p className={s.summary}>{p.summary}</p>

            <div className={s.tags}>
              {p.stack.map(tag => (
                <span key={tag} className={s.tag}>{tag}</span>
              ))}
            </div>

            <div className={s.actions}>
              {p.demoUrl ? (
                <a href={p.demoUrl} target="_blank" rel="noreferrer" className={s.link}>
                  <FiExternalLink /> 데모
                </a>
              ) : null}
              {p.repoUrl ? (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className={s.link}>
                  <FiGithub /> 저장소
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}