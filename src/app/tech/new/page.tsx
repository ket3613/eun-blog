import TechForm from "@/components/TechForm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function NewTechPage() {
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;

  if (!valid) {
    return (
      <section>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>새 글 작성</h1>
        <p>접근 권한이 없습니다. <a href="/login">로그인</a> 하세요.</p>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 840 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>새 글 작성</h1>
      <TechForm mode="create" />
    </section>
  );
}
