"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import s from "@/styles/site.module.css";

const items = [
    { href: "/profile", label: "프로필" },
    { href: "/projects", label: "프로젝트" },
    { href: "/troubleshooting", label: "트러블슈팅" },
    { href: "/server-stats", label: "서버 현황" },
];

export default function SiteHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        let alive = true;
        fetch("/api/session", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => alive && setLoggedIn(!!data.loggedIn))
            .catch(() => alive && setLoggedIn(false));
        return () => { alive = false; };
    }, [pathname]);

    function handleManageClick(e: React.MouseEvent) {
        if (loggedIn) return; // 로그인 상태면 링크 그대로 이동
        e.preventDefault();
        setShowLogin(true);
    }

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" }).catch(() => undefined);
        setLoggedIn(false);
        window.location.href = "/";
    }

    const onManage = pathname.startsWith("/manage");

    return (
        <header className={s.header}>
            <div className={`page ${s.bar}`}>
                <Link href="/profile" className={s.brand}>
                    강은택
                    <span className={s.brandRole}>백엔드 개발자</span>
                </Link>

                <nav className={s.nav} aria-label="주요 메뉴">
                    {items.map((it) => {
                        const active = pathname.startsWith(it.href);
                        return (
                            <Link
                                key={it.href}
                                href={it.href}
                                aria-current={active ? "page" : undefined}
                                className={`${s.navLink} ${active ? s.navActive : ""}`}
                            >
                                {it.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={s.admin}>
                    <Link
                        href="/manage"
                        onClick={handleManageClick}
                        aria-current={onManage ? "page" : undefined}
                        className={`${s.adminLink} ${onManage ? s.navActive : ""}`}
                    >
                        {loggedIn ? "프로젝트 관리" : "관리자 로그인"}
                    </Link>
                    {loggedIn && (
                        <button type="button" onClick={handleLogout} className={s.adminLink}>
                            로그아웃
                        </button>
                    )}
                </div>
            </div>

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSuccess={() => {
                        setShowLogin(false);
                        setLoggedIn(true);
                        router.push("/manage");
                    }}
                />
            )}
        </header>
    );
}
