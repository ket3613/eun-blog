import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "서버 현황",
    description: "Raspberry Pi 5 홈서버 실시간 상태",
};

export default function ServerStatsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
