import Link from "next/link";
import { listTech } from "@/lib/tech";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function TechListPage() {
  const posts = await listTech();
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;

  // 카테고리로 그룹핑
  const groups = posts.reduce<Record<string, typeof posts>>( (acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});
  const categories = Object.keys(groups).sort();

  return (
    <section>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>개인 기술 게시판</h1>
          <p style={{ color: "#9aa0a6" }}>기술별로 정리된 글과 이미지</p>
        </div>
        {valid && (
          <Link href="/tech/new" style={{ padding: "8px 12px", border: "1px solid #1f232b", borderRadius: 10, background: "#151922", color: "white" }}>
            새 글 작성
          </Link>
        )}
      </header>

      {categories.length === 0 && (
        <p style={{ color: "#9aa0a6" }}>아직 작성된 글이 없습니다.</p>
      )}

      <div style={{ display: "grid", gap: 20 }}>
        {categories.map(cat => (
          <section key={cat} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{cat}</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              {groups[cat].map(p => (
                <li key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 8, border: "1px solid #1f232b", borderRadius: 8 }}>
                  <div>
                    <Link href={`/tech/${p.id}`} style={{ fontWeight: 600 }}>{p.title}</Link>
                    <div style={{ fontSize: 12, color: "#9aa0a6", marginTop: 4 }}>
                      {p.tags.map(t => (
                        <span key={t} style={{ marginRight: 6 }}>#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#9aa0a6" }}>{new Date(p.updatedAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
