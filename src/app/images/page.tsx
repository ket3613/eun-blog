import Image from "next/image";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { protectedImages } from "@/lib/data";

/**
 * 인증된 사용자만 접근 가능한 이미지 갤러리 페이지
 */
export default async function ImagesPage() {
    // 쿠키에서 세션 토큰 가져오기
    const token = (await cookies()).get("session")?.value;

    // 토큰이 있으면 검증, 없으면 null
    const valid = token ? await verifyToken(token) : null;

    // 인증되지 않은 사용자에게는 로그인 안내 메시지 표시
    if (!valid) {
        return (
            <section>
                <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>이미지</h1>
                <p>접근 권한이 없습니다. <a href="/login">로그인</a> 하세요.</p>
            </section>
        );
    }

    // 인증된 사용자에게 이미지 갤러리 표시
    return (
        <section>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>이미지</h1>
            {/* 그리드 레이아웃으로 이미지 목록 표시 */}
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
                {protectedImages.map(img => (
                    <figure key={img.id} style={{ border: "1px solid #1f232b", borderRadius: 12, padding: 12 }}>
                        {/* Next.js Image 컴포넌트로 최적화된 이미지 로드 */}
                        <Image src={img.src} alt={img.alt} width={400} height={260} style={{ width: "100%", height: "auto" }} />
                        {/* 이미지 설명 텍스트 */}
                        <figcaption style={{ fontSize: 12, color: "#9aa0a6", marginTop: 6 }}>{img.alt}</figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}