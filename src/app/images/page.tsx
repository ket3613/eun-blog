import Image from "next/image";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { protectedImages } from "@/lib/data";

export default async function ImagesPage() {
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;

  if (!valid) {
    return (
      <section>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>이미지</h1>
        <p>접근 권한이 없습니다. <a href="/login">로그인</a> 하세요.</p>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>이미지</h1>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
        {protectedImages.map(img => (
          <figure key={img.id} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 12 }}>
            <Image src={img.src} alt={img.alt} width={400} height={260} style={{ width: "100%", height: "auto" }} />
            <figcaption style={{ fontSize: 12, color: "#9aa0a6", marginTop: 6 }}>{img.alt}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}