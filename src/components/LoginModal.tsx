"use client";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import LoginForm from "@/components/LoginForm";
import s from "@/styles/auth.module.css";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function LoginModal({ onClose, onSuccess }: Props) {
    const titleId = useId();
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        const prevFocus = document.activeElement as HTMLElement | null;
        document.body.style.overflow = "hidden";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            // 포커스가 모달 밖으로 나가지 않도록 Tab 순환
            if (e.key === "Tab" && dialogRef.current) {
                const f = dialogRef.current.querySelectorAll<HTMLElement>("button, input, [href], [tabindex]:not([tabindex='-1'])");
                if (!f.length) return;
                const first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
            prevFocus?.focus?.();
        };
    }, [onClose]);

    // 클라이언트에서 열릴 때만 렌더링되므로 document 를 바로 사용해도 안전
    return createPortal(
        <div className={s.overlay} onClick={onClose}>
            <div
                ref={dialogRef}
                className={s.card}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={s.head}>
                    <h2 id={titleId} className={s.title}>로그인</h2>
                    <button type="button" className={s.close} onClick={onClose} aria-label="닫기">×</button>
                </div>
                <p className={s.sub}>프로젝트 관리는 로그인이 필요합니다.</p>
                <LoginForm autoFocus onSuccess={onSuccess} />
            </div>
        </div>,
        document.body,
    );
}
