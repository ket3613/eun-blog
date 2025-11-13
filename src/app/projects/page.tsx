"use client";
import Image from "next/image";
import { projects } from "@/lib/data";
import { motion } from "framer-motion";
import s from "@/styles/projects.module.css";
import { useMemo, useState } from "react";

/**
 * 프로젝트 목록을 더 화려하고 깔끔하게 보여주는 페이지
 */
export default function ProjectsPage() {
    //필터선언
    //const [상태_변수, 상태_변경_함수] = useState(초기값);
  const [filter, setFilter] = useState<string>("ALL");

  //1.이부분 통해서 전체 기술스텍 모두 나열함
  //모든 기술스택을 set에 중복제거 기능을 사용해서 한번에 넣고 보두 표출
    // ...Array.from(set) 이건 add 기능 한번에 넣는 방법
  const stacks = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.stack.forEach(tag => set.add(tag)));
    return ["ALL", ...Array.from(set)];
  }, []);

  //3.그중에 선택한 값만 나열하고 싶으니 filter 생성
  //filter 사용법을 알아야함 사용해서 ProjeactData라는 VO<list> 를 선별
  const list = useMemo(() => {
    if (filter === "ALL") return projects;
    return projects.filter(p => p.stack.includes(filter));
  }, [filter]);

  //2.배열로 가져온거 모두 그린다
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
            <p className={s.description}>{p.description}</p>

            <div className={s.tags}>
              {p.stack.map(tag => (
                <span key={tag} className={s.tag}>{tag}</span>
              ))}
            </div>

            <div className={s.actions}>
              {p.repoUrl ? (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className={s.link}>
                    저장소
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}