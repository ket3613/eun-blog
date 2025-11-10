"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "@/styles/sidebar.module.css";

const items = [
    { href: "/profile", label: "프로필" },
    { href: "/projects", label: "프로젝트" },
    { href: "/tech", label: "기술 게시판" },
    { href: "/images", label: "이미지(로그인)" }
];

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className={s.wrap}>
            <div className={s.brand}>eun-blog(React)</div>
            <nav className={s.nav}>
                {items.map(it => (
                    <Link key={it.href} href={it.href} className={`${s.link} ${pathname.startsWith(it.href) ? s.active : ""}`}>
                        {it.label}
                    </Link>
                ))}
            </nav>
            <div className={s.footer}>
                <a href="/login">로그인</a> · <a href="/api/logout">로그아웃</a>
            </div>
        </aside>
    );
}