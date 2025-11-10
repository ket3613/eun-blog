"use client";
import { useTransition } from "react";

/**
 * 기술 글 삭제 버튼
 *
 * 변경 사항(로컬 개발 모드):
 * - API 호출을 잠시 비활성화하고 주석 처리
 * - 실제 삭제 대신 안내 메시지를 표시
 * - 프로덕션 전환 시 주석을 되돌려 API 호출을 활성화하세요.
 */
export default function DeleteTechButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  async function onDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    // [로컬 전용] API 호출 비활성화
    alert("로컬 모드에서는 삭제 API 호출이 비활성화되어 있습니다. 프로덕션 전환 시 API 호출 주석을 해제하세요.");
    return;

    // --- 실제 삭제 API 호출 (프로덕션에서 사용) ---
    // const res = await fetch(`/api/tech/${id}`, { method: "DELETE" });
    // if (res.ok) {
    //   location.href = "/tech";
    // } else {
    //   alert("삭제 실패");
    // }
  }
  return (
    <button onClick={() => start(onDelete)} disabled={pending}
            style={{ padding: "8px 12px", border: "1px solid #1f232b", borderRadius: 10, background: "#2a0d0d", color: "#fff" }}>
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
