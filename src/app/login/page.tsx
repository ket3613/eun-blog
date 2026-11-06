"use client";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import s from "@/styles/auth.module.css";

export default function LoginPage() {
    const router = useRouter();
    return (
        <section className={s.page}>
            <div className={s.card}>
                <h1 className={s.title}>관리자 로그인</h1>
                <p className={s.sub}>프로젝트 관리는 로그인이 필요합니다.</p>
                <LoginForm
                    autoFocus
                    onSuccess={() => {
                        router.replace("/manage");
                        router.refresh();
                    }}
                />
            </div>
        </section>
    );
}
