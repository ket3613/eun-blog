import Link from "next/link";
import type { Project } from "@/lib/dataType";
import s from "@/styles/projects.module.css";
import c from "@/styles/page.module.css";

/** 프로젝트를 한 줄씩 보여 주는 목록. 프로필과 프로젝트 페이지가 함께 쓴다. */
export default function ProjectRows({ projects }: { projects: Project[] }) {
    return (
        <ul className={c.panel}>
            {projects.map((p) => (
                <li key={p.id} className={s.row}>
                    <Link href={`/projects/${p.id}`} className={s.rowLink}>
                        <div className={s.rowMain}>
                            <h3 className={s.rowName}>{p.name}</h3>
                            <p className={s.rowSummary}>{p.summary}</p>
                        </div>
                        <dl className={s.rowMeta}>
                            {p.myRole && (
                                <div>
                                    <dt className="sr-only">역할</dt>
                                    <dd>{p.myRole}</dd>
                                </div>
                            )}
                            {p.period && (
                                <div>
                                    <dt className="sr-only">기간</dt>
                                    <dd className={s.rowPeriod}>{p.period}</dd>
                                </div>
                            )}
                        </dl>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
