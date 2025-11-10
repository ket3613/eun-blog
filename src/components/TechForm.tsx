"use client";
import { useEffect, useMemo, useState, useTransition } from "react";

/**
 * 기술 글 작성/수정 폼
 *
 * 변경 사항(로컬 개발 모드):
 * - API 호출(fetch)을 잠시 비활성화하고 주석 처리
 * - 제출 시 안내 메시지로 대체하여 네비게이션만 수행하거나 동작을 중단
 * - 프로덕션 전환 시 주석을 되돌리고 API 호출을 활성화하세요.
 */

type Init = {
  id?: string;
  title?: string;
  category?: string;
  tags?: string[];
  content?: string;
  images?: string[];
};

export default function TechForm({ init, mode = "create" }: { init?: Init; mode?: "create" | "edit" }) {
  const [title, setTitle] = useState(init?.title || "");
  const [category, setCategory] = useState(init?.category || "");
  const [tags, setTags] = useState((init?.tags || []).join(", "));
  const [content, setContent] = useState(init?.content || "");
  const [existingImages, setExistingImages] = useState<string[]>(init?.images || []);
  const [files, setFiles] = useState<FileList | null>(null);
  const [err, setErr] = useState<string>("");
  const [okMsg, setOkMsg] = useState<string>("");
  const [pending, start] = useTransition();

  useEffect(() => {
    setTitle(init?.title || "");
    setCategory(init?.category || "");
    setTags((init?.tags || []).join(", "));
    setContent(init?.content || "");
    setExistingImages(init?.images || []);
  }, [init?.id]);

  const previews = useMemo(() => {
    if (!files) return [] as string[];
    return Array.from(files).map(f => URL.createObjectURL(f));
  }, [files]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!title.trim() || !category.trim()) {
      setErr("제목과 카테고리는 필수입니다.");
      return;
    }

    const fd = new FormData();
    fd.set("title", title);
    fd.set("category", category);
    fd.set("tags", tags);
    fd.set("content", content);
    if (mode === "edit") {
      fd.set("existingImages", existingImages.join(","));
    }
    if (files) {
      Array.from(files).forEach(f => fd.append("images", f));
    }

    // [로컬 전용] API 호출 비활성화 — 서버 엔드포인트 호출 대신 안내 메시지
    alert("로컬 모드에서는 저장 API 호출이 비활성화되어 있습니다. 프로덕션 전환 시 주석을 되돌려 API 호출을 활성화하세요.");
    return;

    // --- 실제 저장 API 호출 (프로덕션에서 사용) ---
    // const url = mode === "create" ? "/api/tech" : `/api/tech/${init?.id}`;
    // const method = mode === "create" ? "POST" : "PUT";
    // const res = await fetch(url, { method, body: fd });
    // if (!res.ok) {
    //   if (res.status === 401) setErr("로그인이 필요합니다.");
    //   else setErr("저장 실패");
    //   return;
    // }
    // const data = await res.json();
    // setOkMsg("저장되었습니다.");
    // location.href = `/tech/${data.id}`;
  }

  function removeExistingImage(src: string) {
    setExistingImages(prev => prev.filter(s => s !== src));
  }

  return (
    <form onSubmit={(e) => start(() => onSubmit(e))} style={{ display: "grid", gap: 12 }}>
      <input placeholder="제목" value={title} onChange={e => setTitle(e.target.value)}
             style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />

      <input placeholder="카테고리 (예: Java, Spring)" value={category} onChange={e => setCategory(e.target.value)}
             style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />

      <input placeholder="태그(쉼표로 구분)" value={tags} onChange={e => setTags(e.target.value)}
             style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white" }} />

      <textarea placeholder="내용" value={content} onChange={e => setContent(e.target.value)} rows={12}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#0e1116", color: "white", lineHeight: 1.6 }} />

      {mode === "edit" && existingImages.length > 0 && (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontSize: 12, color: "#9aa0a6" }}>기존 이미지 (클릭하여 제거)</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {existingImages.map(src => (
              <button type="button" key={src} onClick={() => removeExistingImage(src)}
                      style={{ border: "1px solid #1f232b", borderRadius: 8, padding: 6, background: "#11151c", color: "#9aa0a6" }}>
                {src.replace("/uploads/", "")}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} />
        {previews.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 6, border: "1px solid #1f232b" }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={pending}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b", background: "#151922", color: "white" }}>
          {pending ? "저장 중..." : "저장"}
        </button>
        <a href="/tech" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #1f232b" }}>취소</a>
      </div>

      {err && <p style={{ color: "#ef4444" }}>{err}</p>}
      {okMsg && <p style={{ color: "#22c55e" }}>{okMsg}</p>}
    </form>
  );
}
