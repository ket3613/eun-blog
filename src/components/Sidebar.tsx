"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import s from "@/styles/sidebar.module.css";

const items = [
    { href: "/profile", label: "프로필" },
    { href: "/projects", label: "프로젝트" },
    { href: "/server-stats", label: "서버 현황" },
    { href: "https://grafana.euntaek.cc", label: "Grafana", external: true, preview: "/grafana-preview.svg" },
    { href: "https://jenkins.euntaek.cc/login?from=%2F", label: "Jenkins", external: true, preview: "/jenkins-preview.svg" }
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    async function refreshSession() {
        try {
            const res = await fetch("/api/session");
            const data = await res.json();
            setLoggedIn(!!data.loggedIn);
        } catch {
            setLoggedIn(false);
        }
    }

    useEffect(() => {
        refreshSession();
    }, [pathname]);

    function handleManageClick(e: React.MouseEvent) {
        e.preventDefault();
        if (loggedIn) {
            router.push("/manage");
        } else {
            setShowLogin(true);
        }
    }

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        setLoggedIn(false);
        window.location.href = "/";
    }

    return (
        <aside className={s.wrap}>
            <div className={s.brand}>
                <div className={s.brandInner}>
                    <div className={s.brandIcon}>✦</div>
                    <span className={s.brandTitle}>eun-Blog</span>
                </div>
                <p className={s.brandSub}>개인 포트폴리오</p>
            </div>
            <nav className={s.nav}>
                <p className={s.navSection}>메뉴</p>
                {items.map(it => (
                    it.external ? (
                        <div key={it.href} className={s.externalWrap}>
                            <a
                                href={it.href}
                                className={s.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {it.label}
                                <span className={s.previewHint} aria-label="미리보기 가능">📷</span>
                            </a>
                            {it.preview && (
                                <div className={s.previewTooltip}>
                                    <p className={s.previewLabel}>{it.label} 대시보드</p>
                                    <Image
                                        src={it.preview}
                                        alt={`${it.label} 대시보드 미리보기`}
                                        width={360}
                                        height={225}
                                        className={s.previewImage}
                                        unoptimized
                                    />
                                    <p className={s.previewNote}>접근 제한으로 내부 접속만 가능</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link key={it.href} href={it.href} className={`${s.link} ${pathname.startsWith(it.href) ? s.active : ""}`}>
                            {it.label}
                        </Link>
                    )
                ))}
                {/* 프로젝트 관리 - 로그인 필요 */}
                <a
                    href="/manage"
                    onClick={handleManageClick}
                    className={`${s.link} ${pathname.startsWith("/manage") ? s.active : ""}`}
                >
                    프로젝트 관리{!loggedIn && " 🔒"}
                </a>
            </nav>
            <div className={s.footer}>
                <div className={s.footerCard}>
                    {loggedIn ? (
                        <button
                            onClick={handleLogout}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", font: "inherit" }}
                        >
                            로그아웃
                        </button>
                    ) : (
                        <span style={{ color: "#9aa0a6" }}>비로그인 상태</span>
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
        </aside>
    );
}
