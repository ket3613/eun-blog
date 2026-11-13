import type { Metadata } from "next";
import TroubleList from "@/components/TroubleList";
import { getTroubleshooting } from "@/lib/backend";
import type { Troubleshooting } from "@/lib/dataType";
import c from "@/styles/page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "트러블슈팅",
    description: "버전 업그레이드, 인증, 취약점 조치, 홈 서버 운영 중에 겪은 문제와 원인, 조치 기록",
};

export default async function TroubleshootingPage() {
    let items: Troubleshooting[] = [];
    let failed = false;
    try {
        items = await getTroubleshooting();
    } catch (e) {
        console.error("[troubleshooting]", e);
        failed = true;
    }

    // 배운 점까지 정리한 기록과, 원인·조치만 남긴 짧은 기록을 나눠 보여 준다
    const detailed = items.filter((t) => t.lesson && t.symptom);
    const brief = items.filter((t) => !(t.lesson && t.symptom));

    return (
        <div className="page">
            <header className={c.head}>
                <h1 className={c.h1}>트러블슈팅</h1>
                <p className={c.lead}>
                    문제를 만났을 때 어디까지 확인했고 무엇을 근거로 원인을 좁혔는지 남긴 기록입니다.
                </p>
            </header>

            {failed && (
                <p className={c.empty} role="alert">
                    기록을 불러오지 못했습니다. API 서버가 응답하지 않습니다. 잠시 후 새로고침해 주세요.
                </p>
            )}
            {!failed && items.length === 0 && (
                <p className={c.empty} role="status">등록된 기록이 없습니다.</p>
            )}

            {detailed.length > 0 && (
                <section className={c.section} aria-labelledby="ts-detailed">
                    <div>
                        <h2 id="ts-detailed" className={c.sectionTitle}>원인 추적 기록</h2>
                        <p className={c.sectionNote}>원인을 좁혀 간 과정과 배운 점까지 정리한 {detailed.length}건</p>
                    </div>
                    <TroubleList items={detailed} showProject />
                </section>
            )}

            {brief.length > 0 && (
                <section className={c.section} aria-labelledby="ts-brief">
                    <div>
                        <h2 id="ts-brief" className={c.sectionTitle}>짧은 조치 기록</h2>
                        <p className={c.sectionNote}>홈 서버를 구축하면서 만난 문제와 조치 {brief.length}건</p>
                    </div>
                    <TroubleList items={brief} showProject />
                </section>
            )}
        </div>
    );
}
