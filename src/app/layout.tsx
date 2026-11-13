import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import "@/app/globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// 빌드 시점에 폰트를 내려받아 자체 호스팅 (외부 요청·레이아웃 흔들림 제거)
// 한글 글꼴은 글자 묶음이 많아 preload 하지 않고 필요한 조각만 받게 둔다.
const plexKr = IBM_Plex_Sans_KR({
    weight: ["400", "500", "600", "700"],
    display: "swap",
    preload: false,
    variable: "--font-plex-kr",
});
// 버전 문자열, 수치처럼 코드에 가까운 값에만 쓴다.
const plexMono = IBM_Plex_Mono({
    weight: ["400", "500"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-plex-mono",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://euntaek.cc";
const DESCRIPTION = "레거시 시스템을 멈추지 않고 안전하게 바꾸는 백엔드 개발자 강은택의 경력, 프로젝트, 트러블슈팅 기록";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: "강은택 · 백엔드 개발자", template: "%s | 강은택" },
    description: DESCRIPTION,
    openGraph: {
        type: "website",
        locale: "ko_KR",
        siteName: "강은택 포트폴리오",
        title: "강은택 · 백엔드 개발자",
        description: DESCRIPTION,
        images: [{ url: "/my_image.jpeg" }],
    },
};

export const viewport: Viewport = {
    themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" className={`${plexKr.variable} ${plexMono.variable}`}>
            <body>
                <a href="#main" className="skip-link">본문으로 건너뛰기</a>
                <SiteHeader />
                <main id="main" tabIndex={-1}>
                    {children}
                </main>
                <SiteFooter />
            </body>
        </html>
    );
}
