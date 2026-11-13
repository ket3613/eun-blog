import Link from "next/link";
import s from "@/styles/site.module.css";

export default function SiteFooter() {
    return (
        <footer className={s.footer}>
            <div className={`page ${s.footerInner}`}>
                <p>
                    이 사이트는 집에 있는 라즈베리파이 5에서 직접 운영합니다.{" "}
                    <Link href="/server-stats" className="text-link">지금 서버 상태 보기</Link>
                </p>
            </div>
        </footer>
    );
}
