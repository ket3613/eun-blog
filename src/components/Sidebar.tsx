"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import s from "@/styles/sidebar.module.css";

const items = [
    { href: "/profile", label: "프로필" },
    { href: "/projects", label: "프로젝트" },
    { href: "/server-stats", label: "서버 현황" },
    { href: "/images", label: "이미지(로그인)" },
    { href: "https://grafana.euntaek.cc", label: "Grafana", external: true, preview: "/grafana-preview.svg" },
    { href: "https://jenkins.euntaek.cc/login?from=%2F", label: "Jenkins", external: true, preview: "/jenkins-preview.svg" }
];

export default function Sidebar() {
    const pathname = usePathname();

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/";
    }

    return (
        <aside className={s.wrap}>
            <div className={s.brand}>eun-Blog</div>
            <nav className={s.nav}>
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
            </nav>
            <div className={s.footer}>
                <Link href="/login">로그인</Link>
                {" · "}
                <button
                    onClick={handleLogout}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", font: "inherit" }}
                >
                    로그아웃
                </button>
            </div>
        </aside>
    );
}
