import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getTech } from "@/lib/tech";
import DeleteTechButton from "@/components/DeleteTechButton";

export default async function TechDetailPage({ params }: { params: { id: string } }) {
  const post = await getTech(params.id);
  if (!post) {
    return (
      <section>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>게시글을 찾을 수 없습니다.</h1>
        <p><Link href="/tech">목록으로</Link></p>
      </section>
    );
  }

  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;

  return (
    <section>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>{post.title}</h1>
          <div style={{ color: "#9aa0a6", fontSize: 12 }}>
            {post.category} · {new Date(post.updatedAt).toLocaleString()}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "#9aa0a6" }}>
            {post.tags.map(t => <span key={t} style={{ marginRight: 6 }}>#{t}</span>)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/tech" style={{ padding: "8px 12px", border: "1px solid #1f232b", borderRadius: 10 }}>목록</Link>
          {valid && (
            <>
              <Link href={`/tech/${post.id}/edit`} style={{ padding: "8px 12px", border: "1px solid #1f232b", borderRadius: 10, background: "#151922", color: "#fff" }}>수정</Link>
              <DeleteTechButton id={post.id} />
            </>
          )}
        </div>
      </header>

      <article style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, border: "1px solid #1f232b", borderRadius: 12, padding: 16 }}>
        {post.content}
      </article>

      {post.images.length > 0 && (
        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>이미지</h2>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
            {post.images.map((src, i) => (
              <figure key={i} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 12 }}>
                <Image src={src} alt={`image-${i}`} width={800} height={600} style={{ width: "100%", height: "auto" }} />
              </figure>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
