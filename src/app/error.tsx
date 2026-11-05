"use client";
import { useEffect } from "react";
import Link from "next/link";
import StatusMessage from "@/components/StatusMessage";
import s from "@/styles/status.module.css";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <StatusMessage title="문제가 발생했습니다" role="alert">
            <p>일시적인 오류일 수 있습니다. 잠시 후 다시 시도해 주세요.</p>
            <div className={s.actions}>
                <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={reset}>다시 시도</button>
                <Link className={s.btn} href="/">홈으로</Link>
            </div>
        </StatusMessage>
    );
}
