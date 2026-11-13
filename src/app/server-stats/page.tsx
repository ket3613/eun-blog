"use client";

import { useEffect, useState, useCallback } from "react";
import type { ServerStats } from "@/lib/dataType";
import { getServerStats } from "@/lib/backend";
import s from "@/styles/server-stats.module.css";
import c from "@/styles/page.module.css";

const REFRESH_SEC = 30;

function formatUptime(sec: number): string {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const parts = [];
    if (d > 0) parts.push(`${d}일`);
    if (h > 0) parts.push(`${h}시간`);
    if (m > 0) parts.push(`${m}분`);
    return parts.join(" ") || "방금 시작";
}

function formatBytes(bytes: number): string {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
    return `${bytes} B`;
}

function pct(used: number, total: number): number {
    if (!total) return 0;
    return Math.min(100, Math.round((used / total) * 1000) / 10);
}

function barColor(p: number): "green" | "yellow" | "red" {
    if (p < 60) return "green";
    if (p < 85) return "yellow";
    return "red";
}

function tempColor(t: number): "green" | "yellow" | "red" {
    if (t < 60) return "green";
    if (t < 75) return "yellow";
    return "red";
}

export default function ServerStatsPage() {
    const [stats, setStats]       = useState<ServerStats | null>(null);
    const [error, setError]       = useState(false);
    const [countdown, setCountdown] = useState(REFRESH_SEC);

    const load = useCallback(() => {
        getServerStats()
            .then((d) => { setStats(d); setError(false); setCountdown(REFRESH_SEC); })
            .catch(() => { setError(true); setCountdown(REFRESH_SEC); });
    }, []);

    useEffect(() => { load(); }, [load]);

    useEffect(() => {
        const tick = setInterval(() => {
            if (document.hidden) return; // 백그라운드 탭에서는 갱신 중지
            setCountdown((c) => {
                if (c <= 1) { load(); return REFRESH_SEC; }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(tick);
    }, [load]);

    const online = stats?.status === "online";
    const cpuPct  = stats ? pct(stats.cpu_usage_percent, 100) : 0;
    const memPct  = stats ? pct(stats.memory.used_bytes, stats.memory.total_bytes) : 0;
    const diskPct = stats ? pct(stats.disk.used_bytes, stats.disk.total_bytes) : 0;

    const tempState = stats ? tempColor(stats.cpu_temp_celsius) : "green";
    const state = error ? "error" : !stats ? "loading" : online ? "online" : "offline";
    const stateLabel = { error: "연결 오류", loading: "확인 중", online: "온라인", offline: "오프라인" }[state];

    return (
        <div className="page">
            <header className={c.head}>
                <h1 className={c.h1}>서버 현황</h1>
                <p className={c.lead}>
                    이 사이트가 돌아가는 라즈베리파이 5의 상태입니다. node_exporter 지표를 Prometheus에서 읽어 {REFRESH_SEC}초마다 갱신합니다.
                </p>
                <div className={s.statusRow}>
                    <p className={`${s.status} ${s[`status_${state}`]}`} role="status" aria-live="polite">
                        <span className={s.dot} aria-hidden="true" />
                        {stateLabel}
                    </p>
                    {stats && online && <p className={s.uptime}>가동 시간 {formatUptime(stats.uptime_seconds)}</p>}
                    <p className={s.refresh}>
                        <span aria-hidden="true">{countdown}초 후 갱신</span>
                        <button type="button" onClick={load} className={s.refreshButton}>지금 새로고침</button>
                    </p>
                </div>
            </header>

            {state === "error" && (
                <p className={c.empty} role="alert">
                    서버 상태를 가져오지 못했습니다. API 서버나 Prometheus가 응답하지 않습니다. {REFRESH_SEC}초마다 다시 시도합니다.
                </p>
            )}
            {state === "offline" && (
                <p className={c.empty}>Prometheus가 지표를 주지 않아 수치를 표시할 수 없습니다.</p>
            )}

            {stats && online && (
                <dl className={s.grid}>
                    <div className={s.meter}>
                        <dt>CPU 사용률</dt>
                        <dd>
                            <p className={s.value}>{stats.cpu_usage_percent.toFixed(1)}<span>%</span></p>
                            <div className={s.bar} role="progressbar" aria-label="CPU 사용률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={cpuPct}>
                                <div className={`${s.barFill} ${s[barColor(cpuPct)]}`} style={{ width: `${cpuPct}%` }} />
                            </div>
                        </dd>
                    </div>

                    <div className={s.meter}>
                        <dt>CPU 온도</dt>
                        <dd>
                            <p className={s.value}>{stats.cpu_temp_celsius.toFixed(1)}<span>°C</span></p>
                            <p className={`${s.sub} ${s[`text_${tempState}`]}`}>
                                {tempState === "green" ? "정상 범위" : tempState === "yellow" ? "높은 편 (60°C 이상)" : "과열 (75°C 이상)"}
                            </p>
                        </dd>
                    </div>

                    <div className={s.meter}>
                        <dt>메모리</dt>
                        <dd>
                            <p className={s.value}>{memPct}<span>%</span></p>
                            <div className={s.bar} role="progressbar" aria-label="메모리 사용률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={memPct}>
                                <div className={`${s.barFill} ${s[barColor(memPct)]}`} style={{ width: `${memPct}%` }} />
                            </div>
                            <p className={s.sub}>{formatBytes(stats.memory.used_bytes)} / {formatBytes(stats.memory.total_bytes)}</p>
                        </dd>
                    </div>

                    <div className={s.meter}>
                        <dt>디스크 (/)</dt>
                        <dd>
                            <p className={s.value}>{diskPct}<span>%</span></p>
                            <div className={s.bar} role="progressbar" aria-label="디스크 사용률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={diskPct}>
                                <div className={`${s.barFill} ${s[barColor(diskPct)]}`} style={{ width: `${diskPct}%` }} />
                            </div>
                            <p className={s.sub}>{formatBytes(stats.disk.used_bytes)} / {formatBytes(stats.disk.total_bytes)}</p>
                        </dd>
                    </div>
                </dl>
            )}

            <section className={c.section} aria-labelledby="tools-title" style={{ marginTop: 48 }}>
                <div>
                    <h2 id="tools-title" className={c.sectionTitle}>운영 도구</h2>
                    <p className={c.sectionNote}>접근이 제한되어 있어 로그인 화면까지만 열립니다.</p>
                </div>
                <ul className={s.tools}>
                    <li>
                        <a className="text-link" href="https://grafana.taeklab.cc" target="_blank" rel="noopener noreferrer">Grafana<span className="sr-only"> (새 창)</span></a>
                        <span>node_exporter 지표 대시보드</span>
                    </li>
                    <li>
                        <a className="text-link" href="https://jenkins.taeklab.cc/login?from=%2F" target="_blank" rel="noopener noreferrer">Jenkins<span className="sr-only"> (새 창)</span></a>
                        <span>main 브랜치 병합 시 이미지 빌드와 재배포</span>
                    </li>
                </ul>
            </section>
        </div>
    );
}
