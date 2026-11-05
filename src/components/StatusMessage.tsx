import s from "@/styles/status.module.css";

/** 로딩·에러·404 화면 공용 카드 */
export default function StatusMessage({ title, children, role }: { title: string; children?: React.ReactNode; role?: "status" | "alert" }) {
    return (
        <section className={s.wrap} role={role}>
            <h1 className={s.title}>{title}</h1>
            {children}
        </section>
    );
}
