"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import s from "@/styles/profile.module.css";
import {useEffect, useState} from "react";
import {Profile} from "@/lib/dataType";
import {getProfile} from "@/app/api/profile";

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

    // 1) 아직 아무것도 안 받은 상태 (SSR/CSR 첫 렌더 동일)
    if (!profile && !error) {
        return <div>프로필 불러오는 중...</div>;
    }

    // 2) 에러 상태
    if (error) {
        return <div>{error}</div>;
    }

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
            <p className={s.title}>{profile.position}</p>
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
            <div className={s.skillsGrid}>
              {profile.skills.map((sk) => (
                <div className={s.skillRow} key={sk.skillName}>
                  <div className={s.skillMeta}>
                    <span>{sk.skillName}</span>
                    <span>{sk.year}년</span>
                  </div>
                </div>
              ))}
            </div>
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