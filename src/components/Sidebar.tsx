"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "@/styles/sidebar.module.css";

const items = [
    { href: "/profile", label: "프로필" },
    { href: "/projects", label: "프로젝트" },
    { href: "/images", label: "이미지(로그인)" },
    { href: "https://jenkins.euntaek.cc/login?from=%2F", label: "Jenkins", external: true }
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className={s.wrap}>
            <div className={s.brand}>eun-Blog</div>
            <nav className={s.nav}>
                {items.map(it => (
                    it.external ? (
                        <a key={it.href} href={it.href} className={s.link} target="_blank" rel="noopener noreferrer">
                            {it.label}
                        </a>
                    ) : (
                        <Link key={it.href} href={it.href} className={`${s.link} ${pathname.startsWith(it.href) ? s.active : ""}`}>
                            {it.label}
                        </Link>
                    )
                ))}
            </nav>
            <div className={s.footer}>
                <Link href="/login">로그인</Link> · <a href="/api/logout">로그아웃</a>
            </div>
        </aside>
    );
}
