import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";
import styles from "@/styles/layout.module.css";

// 빌드 시점에 폰트를 내려받아 자체 호스팅 (외부 요청·레이아웃 흔들림 제거)
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://euntaek.cc";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: "eun-blog · 강은택 포트폴리오", template: "%s | eun-blog" },
    description: "Java/Spring 백엔드 엔지니어 강은택의 프로필, 프로젝트, 홈서버 현황",
    openGraph: {
        type: "website",
        locale: "ko_KR",
        siteName: "eun-blog",
        title: "eun-blog · 강은택 포트폴리오",
        description: "Java/Spring 백엔드 엔지니어 강은택의 프로필, 프로젝트, 홈서버 현황",
        images: [{ url: "/my_image.jpeg" }],
    },
};

export const viewport: Viewport = {
    themeColor: "#1e1b4b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={inter.variable}>
            <body>
                <a href="#main" className="skip-link">본문으로 건너뛰기</a>
                <div className={styles.container}>
                    <Sidebar />
                    <main id="main" className={styles.main} tabIndex={-1}>
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
