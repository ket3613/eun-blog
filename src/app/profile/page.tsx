import Image from "next/image";
import { profile } from "@/lib/data";

export default function ProfilePage() {
  return (
    <section style={{ display: "grid", gap: 20 }}>
      {/* 헤더 + 아바타 */}
      <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 84, height: 84, borderRadius: "50%", overflow: "hidden", border: "1px solid #1f232b" }}>
          <Image src={profile.avatar} alt={`${profile.name} avatar`} fill sizes="84px" />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{profile.name}</h1>
          <p style={{ color: "#9aa0a6", margin: "6px 0 0 0" }}>{profile.title}</p>
        </div>
      </header>

      {/* 소개 */}
      <p style={{ margin: 0 }}>{profile.bio}</p>

      {/* 하이라이트 배지 */}
      {profile.highlights?.length ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {profile.highlights.map((h) => (
            <span key={h} style={{ fontSize: 12, border: "1px solid #1f232b", padding: "6px 8px", borderRadius: 999 }}>{h}</span>
          ))}
        </div>
      ) : null}

      {/* 연락처 + 링크 */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <a href={`mailto:${profile.email}`} style={{ border: "1px solid #1f232b", padding: "8px 10px", borderRadius: 8 }}>이메일</a>
        {profile.links.map((l) => (
          <a key={l.href} href={l.href} style={{ border: "1px solid #1f232b", padding: "8px 10px", borderRadius: 8 }}>{l.label}</a>
        ))}
        {profile.resumeUrl && (
          <a href={profile.resumeUrl} style={{ border: "1px solid #1f232b", padding: "8px 10px", borderRadius: 8 }}>이력서 PDF</a>
        )}
      </div>

      {/* 기술스택: 진행바 */}
      {profile.skills?.length ? (
        <section>
          <h2 style={{ fontSize: 18, margin: "0 0 10px 0" }}>기술스택</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {profile.skills.map((s) => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9aa0a6" }}>
                  <span>{s.name}</span><span>{s.level}%</span>
                </div>
                <div style={{ height: 8, border: "1px solid #1f232b", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${s.level}%`, height: "100%", background: "#1f6feb" }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 경력 타임라인 */}
      {profile.experience?.length ? (
        <section>
          <h2 style={{ fontSize: 18, margin: "0 0 10px 0" }}>경력</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {profile.experience.map((e) => (
              <li key={e.period} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{e.role} · {e.org}</div>
                <div style={{ fontSize: 12, color: "#9aa0a6", marginTop: 2 }}>{e.period}</div>
                <div style={{ marginTop: 6 }}>{e.note}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}