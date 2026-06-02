"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/data";
import s from "@/styles/manage.module.css";

interface Props {
    initialProjects: Project[];
}

const EMPTY_FORM = {
    name: "",
    summary: "",
    description: "",
    myRole: "",
    year: "",
    image: "",
    stackText: "",
};

// "SpringBoot:1" 형식 텍스트 → stack 배열
function parseStack(text: string) {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [name, cat] = line.split(":").map((x) => x.trim());
            return { stackName: name, category: Number(cat) || 4 };
        });
}

// stack 배열 → 텍스트
function stackToText(stack: Project["stack"]) {
    return (stack ?? [])
        .map((t) => `${t.stackName}:${t.category}`)
        .join("\n");
}

export default function ManageProjects({ initialProjects }: Props) {
    const router = useRouter();
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    function resetForm() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setPdfFile(null);
    }

    function startEdit(p: Project) {
        setEditingId(p.id);
        setForm({
            name: p.name ?? "",
            summary: p.summary ?? "",
            description: p.description ?? "",
            myRole: p.myRole ?? "",
            year: p.year ?? "",
            image: p.image ?? "",
            stackText: stackToText(p.stack),
        });
        setPdfFile(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setBusy(true);
        setMsg(null);
        try {
            const payload = {
                name: form.name,
                summary: form.summary,
                description: form.description,
                myRole: form.myRole,
                year: form.year,
                image: form.image,
                stack: parseStack(form.stackText),
            };

            const url = editingId
                ? `/api/manage/projects/${editingId}`
                : `/api/manage/projects`;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`저장 실패 (${res.status})`);
            const json = await res.json();

            // 신규 등록 시 반환된 id, 수정이면 기존 id
            const projectId = editingId ?? json.data;

            // PDF가 선택되었으면 업로드
            if (pdfFile && projectId != null) {
                const fd = new FormData();
                fd.append("file", pdfFile);
                const up = await fetch(`/api/manage/projects/${projectId}/pdf`, {
                    method: "POST",
                    body: fd,
                });
                if (!up.ok) throw new Error(`PDF 업로드 실패 (${up.status})`);
            }

            setMsg(editingId ? "수정되었습니다." : "등록되었습니다.");
            resetForm();
            router.refresh();
        } catch (err) {
            setMsg(err instanceof Error ? err.message : "오류가 발생했습니다.");
        } finally {
            setBusy(false);
        }
    }

    async function handleDelete(id: number | string) {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setBusy(true);
        setMsg(null);
        try {
            const res = await fetch(`/api/manage/projects/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`삭제 실패 (${res.status})`);
            setMsg("삭제되었습니다.");
            if (editingId === id) resetForm();
            router.refresh();
        } catch (err) {
            setMsg(err instanceof Error ? err.message : "오류가 발생했습니다.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <section className={s.wrap}>
            <header className={s.head}>
                <h1 className={s.title}>프로젝트 관리</h1>
                <p className={s.sub}>프로젝트를 등록·수정·삭제하고 PDF를 첨부할 수 있습니다.</p>
            </header>

            {msg && <div className={s.msg}>{msg}</div>}

            {/* 등록/수정 폼 */}
            <form className={s.form} onSubmit={handleSubmit}>
                <h2 className={s.formTitle}>{editingId ? "프로젝트 수정" : "새 프로젝트 등록"}</h2>
                <div className={s.grid}>
                    <label className={s.field}>
                        <span>이름 *</span>
                        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </label>
                    <label className={s.field}>
                        <span>연도</span>
                        <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2025" />
                    </label>
                </div>

                <label className={s.field}>
                    <span>요약</span>
                    <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </label>

                <label className={s.field}>
                    <span>설명</span>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </label>

                <label className={s.field}>
                    <span>내 역할</span>
                    <textarea rows={2} value={form.myRole} onChange={(e) => setForm({ ...form, myRole: e.target.value })} placeholder="REST API 설계, 배포 자동화 등" />
                </label>

                <label className={s.field}>
                    <span>이미지 경로</span>
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/SpringBoot.svg" />
                </label>

                <label className={s.field}>
                    <span>기술 스택 (한 줄에 하나, 형식: 이름:카테고리번호)</span>
                    <textarea
                        rows={5}
                        value={form.stackText}
                        onChange={(e) => setForm({ ...form, stackText: e.target.value })}
                        placeholder={"SpringBoot:1\nJava:1\nReact:2\nAWS:3\nDatadog:4"}
                    />
                    <small className={s.hint}>1:Backend 2:Frontend 3:Infra 4:Other</small>
                </label>

                <label className={s.field}>
                    <span>PDF 첨부 (선택)</span>
                    <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
                </label>

                <div className={s.actions}>
                    <button type="submit" className={s.btnPrimary} disabled={busy}>
                        {busy ? "처리 중..." : editingId ? "수정 저장" : "등록"}
                    </button>
                    {editingId && (
                        <button type="button" className={s.btn} onClick={resetForm} disabled={busy}>
                            취소
                        </button>
                    )}
                </div>
            </form>

            {/* 목록 */}
            <div className={s.list}>
                <h2 className={s.formTitle}>등록된 프로젝트 ({initialProjects.length})</h2>
                {initialProjects.map((p) => (
                    <div key={p.id} className={s.row}>
                        <div className={s.rowInfo}>
                            <div className={s.rowName}>
                                {p.name}
                                {p.pdfName && <span className={s.pdfBadge}>📎 PDF</span>}
                            </div>
                            <div className={s.rowMeta}>
                                {p.year} · {p.stack?.length ?? 0}개 스택
                            </div>
                        </div>
                        <div className={s.rowActions}>
                            <button className={s.btn} onClick={() => startEdit(p)} disabled={busy}>수정</button>
                            <button className={s.btnDanger} onClick={() => handleDelete(p.id)} disabled={busy}>삭제</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
