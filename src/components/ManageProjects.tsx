"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Project } from "@/lib/data";
import s from "@/styles/manage.module.css";

interface Props {
    initialProjects: Project[];
}

type StackItem = { stackName: string; category: number };

const EMPTY_FORM = {
    name: "",
    summary: "",
    description: "",
    myRole: "",
    year: "",
    image: "",
};

const CATEGORY_LABELS: Record<number, string> = {
    1: "Backend",
    2: "Frontend",
    3: "Infra",
    4: "Other",
};

export default function ManageProjects({ initialProjects }: Props) {
    const router = useRouter();
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // 기술 스택: 기존 스택 선택 + 직접 입력
    const [selectedStacks, setSelectedStacks] = useState<StackItem[]>([]);
    const [showNewStack, setShowNewStack] = useState(false);
    const [newStackName, setNewStackName] = useState("");
    const [newStackCategory, setNewStackCategory] = useState(1);

    // 이미지: 파일 첨부
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // 기존 프로젝트들에서 스택 수집 (이름 기준 중복 제거)
    const knownStacks = useMemo<StackItem[]>(() => {
        const map = new Map<string, StackItem>();
        initialProjects.forEach((p) =>
            (p.stack ?? []).forEach((t) => {
                if (!map.has(t.stackName)) {
                    map.set(t.stackName, { stackName: t.stackName, category: Number(t.category) || 4 });
                }
            })
        );
        return Array.from(map.values()).sort(
            (a, b) => a.category - b.category || a.stackName.localeCompare(b.stackName)
        );
    }, [initialProjects]);

    // 선택됐지만 기존 목록에 없는 스택(직접 입력분)도 칩으로 함께 표시
    const allStacks = useMemo<StackItem[]>(() => {
        const extra = selectedStacks.filter(
            (sel) => !knownStacks.some((k) => k.stackName === sel.stackName)
        );
        return [...knownStacks, ...extra];
    }, [knownStacks, selectedStacks]);

    const editingProject = editingId != null
        ? initialProjects.find((p) => p.id === editingId)
        : undefined;

    function isSelected(name: string) {
        return selectedStacks.some((t) => t.stackName === name);
    }

    function toggleStack(item: StackItem) {
        setSelectedStacks((prev) =>
            prev.some((t) => t.stackName === item.stackName)
                ? prev.filter((t) => t.stackName !== item.stackName)
                : [...prev, item]
        );
    }

    function addNewStack() {
        const name = newStackName.trim();
        if (!name) return;
        if (!isSelected(name)) {
            const existing = knownStacks.find((k) => k.stackName === name);
            setSelectedStacks((prev) => [
                ...prev,
                existing ?? { stackName: name, category: newStackCategory },
            ]);
        }
        setNewStackName("");
    }

    function handleImageChange(file: File | null) {
        setImageFile(file);
        setImagePreview((old) => {
            if (old) URL.revokeObjectURL(old);
            return file ? URL.createObjectURL(file) : null;
        });
    }

    function resetForm() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setPdfFile(null);
        setSelectedStacks([]);
        setShowNewStack(false);
        setNewStackName("");
        setNewStackCategory(1);
        handleImageChange(null);
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
        });
        setSelectedStacks(
            (p.stack ?? []).map((t) => ({ stackName: t.stackName, category: Number(t.category) || 4 }))
        );
        setPdfFile(null);
        handleImageChange(null);
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
                stack: selectedStacks,
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

            // 이미지가 선택되었으면 업로드
            if (imageFile && projectId != null) {
                const fd = new FormData();
                fd.append("file", imageFile);
                const up = await fetch(`/api/manage/projects/${projectId}/image`, {
                    method: "POST",
                    body: fd,
                });
                if (!up.ok) throw new Error(`이미지 업로드 실패 (${up.status})`);
            }

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

    // 수정 중일 때 현재 저장된 이미지 표시
    const currentImageSrc = imagePreview
        ?? (editingProject?.imagePath
            ? `/api/projects/${editingProject.id}/image`
            : editingProject?.image || null);

    return (
        <section className={s.wrap}>
            <header className={s.head}>
                <h1 className={s.title}>프로젝트 관리</h1>
                <p className={s.sub}>프로젝트를 등록·수정·삭제하고 이미지·PDF를 첨부할 수 있습니다.</p>
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

                <div className={s.field}>
                    <span>기술 스택 (클릭해서 선택)</span>
                    <div className={s.stackPicker}>
                        {allStacks.map((t) => (
                            <button
                                type="button"
                                key={t.stackName}
                                className={`${s.stackChip} ${isSelected(t.stackName) ? s.stackChipActive : ""}`}
                                onClick={() => toggleStack(t)}
                            >
                                {t.stackName}
                                <span className={s.chipCat}>{CATEGORY_LABELS[t.category] ?? "Other"}</span>
                            </button>
                        ))}
                        <button
                            type="button"
                            className={`${s.stackChip} ${s.stackChipAdd}`}
                            onClick={() => setShowNewStack((v) => !v)}
                        >
                            {showNewStack ? "− 닫기" : "+ 직접 입력"}
                        </button>
                    </div>
                    {showNewStack && (
                        <div className={s.newStackRow}>
                            <input
                                value={newStackName}
                                onChange={(e) => setNewStackName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addNewStack();
                                    }
                                }}
                                placeholder="새 스택 이름 (예: Kafka)"
                            />
                            <select
                                className={s.select}
                                value={newStackCategory}
                                onChange={(e) => setNewStackCategory(Number(e.target.value))}
                            >
                                {Object.entries(CATEGORY_LABELS).map(([v, label]) => (
                                    <option key={v} value={v}>{label}</option>
                                ))}
                            </select>
                            <button type="button" className={s.btn} onClick={addNewStack}>추가</button>
                        </div>
                    )}
                    <small className={s.hint}>
                        {selectedStacks.length > 0
                            ? `선택됨: ${selectedStacks.map((t) => t.stackName).join(", ")}`
                            : "선택된 스택이 없습니다."}
                    </small>
                </div>

                <label className={s.field}>
                    <span>이미지 첨부 (선택)</span>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                    />
                    {currentImageSrc && (
                        <div className={s.imagePreviewRow}>
                            <Image
                                src={currentImageSrc}
                                alt="프로젝트 이미지 미리보기"
                                width={64}
                                height={64}
                                className={s.imagePreview}
                                unoptimized
                            />
                            <span className={s.fileMeta}>
                                {imageFile
                                    ? `새 이미지: ${imageFile.name}`
                                    : `현재 이미지${editingProject?.imageName ? `: ${editingProject.imageName}` : ""}`}
                            </span>
                        </div>
                    )}
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
                                {p.imagePath && <span className={s.pdfBadge}>🖼️ 이미지</span>}
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
