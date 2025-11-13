import TechForm from "@/components/TechForm";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getTech } from "@/lib/tech";
import Link from "next/link";

export default async function EditTechPage({ params }: { params: { id: string } }) {
  const token = (await cookies()).get("session")?.value;
  const valid = token ? await verifyToken(token) : null;
  if (!valid) {
    return (
      <section>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>글 수정</h1>
        <p>접근 권한이 없습니다. <Link href="/login">로그인</Link> 하세요.</p>
      </section>
    );
  }

  const post = await getTech(params.id);
  if (!post) {
    return (
      <section>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>게시글을 찾을 수 없습니다.</h1>
        <p><Link href="/tech">목록으로</Link></p>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 840 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>글 수정</h1>
      <TechForm mode="edit" init={post} />
    </section>
  );
}
