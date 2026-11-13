import Link from "next/link";
import type { Troubleshooting } from "@/lib/dataType";
import { lines } from "@/lib/format";
import s from "@/styles/trouble.module.css";

function Step({ label, text, kind }: { label: string; text?: string | null; kind?: "fix" | "lesson" }) {
    const items = lines(text);
    if (items.length === 0) return null;
    return (
        <div className={`${s.step} ${kind === "fix" ? s.stepFix : ""} ${kind === "lesson" ? s.stepLesson : ""}`}>
            <dt>{label}</dt>
            <dd>
                {items.length === 1 ? items[0] : (
                    <ol className={s.trace}>
                        {items.map((t) => <li key={t}>{t}</li>)}
                    </ol>
                )}
            </dd>
        </div>
    );
}

/** 증상 → 원인 → 조치 → 배운 점 순서로 보여 주는 트러블슈팅 목록 */
export default function TroubleList({ items, showProject = false }: { items: Troubleshooting[]; showProject?: boolean }) {
    return (
        <ul className={s.list}>
            {items.map((t) => (
                <li key={t.id} className={s.item}>
                    <h3 className={s.title}>{t.title}</h3>
                    {showProject && t.projectId != null && t.projectName && (
                        <p className={s.project}>
                            <Link className="text-link" href={`/projects/${t.projectId}`}>{t.projectName}</Link>
                        </p>
                    )}
                    <dl className={s.steps}>
                        <Step label="증상" text={t.symptom} />
                        <Step label="원인" text={t.cause} />
                        <Step label="조치" text={t.resolution} kind="fix" />
                        <Step label="배운 점" text={t.lesson} kind="lesson" />
                    </dl>
                </li>
            ))}
        </ul>
    );
}
