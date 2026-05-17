"use client";

import { useEffect, useState, useCallback } from "react";
import { ServerStats } from "@/lib/dataType";
import { getServerStats } from "@/app/api/server-stats";
import s from "@/styles/server-stats.module.css";

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

    return (
        <section className={s.section}>
            {/* Hero */}
            <header className={s.hero}>
                <div className={s.heroGlow} />
                <div className={s.heroRow}>
                    <div>
                        <h1 className={s.heroTitle}>서버 현황</h1>
                        <p className={s.heroSub}>Raspberry Pi 5 · 실시간 모니터링</p>
                    </div>
                    <div className={`${s.statusBadge} ${error ? s.offline : online ? s.online : s.offline}`}>
                        <span className={s.dot} />
                        {error ? "연결 오류" : online ? "온라인" : "오프라인"}
                    </div>
                </div>

                {stats && online && (
                    <div className={s.uptimeRow}>
                        <span>업타임</span>
                        <span className={s.uptimeValue}>{formatUptime(stats.uptime_seconds)}</span>
                    </div>
                )}

                <div className={s.refreshRow}>
                    {countdown}초 후 자동 갱신
                    <button
                        onClick={load}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", font: "inherit", textDecoration: "underline" }}
                    >
                        지금 새로고침
                    </button>
                </div>
            </header>

            {/* Offline */}
            {(error || (!stats && !error)) && (
                <div className={s.offlineCard}>
                    <span style={{ fontSize: 32 }}>🖥️</span>
                    <span>{error ? "Prometheus에 연결할 수 없습니다." : "데이터를 불러오는 중..."}</span>
                </div>
            )}

            {/* Stats Grid */}
            {stats && online && (
                <div className={s.grid}>
                    {/* CPU 사용률 */}
                    <div className={s.card}>
                        <p className={s.cardLabel}>CPU 사용률</p>
                        <p className={s.statValue}>
                            {stats.cpu_usage_percent.toFixed(1)}
                            <span className={s.statUnit}>%</span>
                        </p>
                        <div className={s.barWrap}>
                            <div className={`${s.barFill} ${s[barColor(cpuPct)]}`} style={{ width: `${cpuPct}%` }} />
                        </div>
                    </div>

                    {/* CPU 온도 */}
                    <div className={s.card}>
                        <p className={s.cardLabel}>CPU 온도</p>
                        <p className={s.statValue} style={{ color: tempColor(stats.cpu_temp_celsius) === "red" ? "#f87171" : tempColor(stats.cpu_temp_celsius) === "yellow" ? "#facc15" : "#4ade80" }}>
                            {stats.cpu_temp_celsius.toFixed(1)}
                            <span className={s.statUnit}>°C</span>
                        </p>
                        <p className={s.statSub}>
                            {stats.cpu_temp_celsius < 60 ? "정상 온도" : stats.cpu_temp_celsius < 75 ? "주의 필요" : "과열 경고"}
                        </p>
                    </div>

                    {/* 메모리 */}
                    <div className={`${s.card} ${s.cardFull}`}>
                        <p className={s.cardLabel}>메모리</p>
                        <div className={s.detailRow}>
                            <span>{memPct}% 사용 중</span>
                            <span>{formatBytes(stats.memory.used_bytes)} / {formatBytes(stats.memory.total_bytes)}</span>
                        </div>
                        <div className={s.barWrap}>
                            <div className={`${s.barFill} ${s[barColor(memPct)]}`} style={{ width: `${memPct}%` }} />
                        </div>
                    </div>

                    {/* 디스크 */}
                    <div className={`${s.card} ${s.cardFull}`}>
                        <p className={s.cardLabel}>디스크 (/)</p>
                        <div className={s.detailRow}>
                            <span>{diskPct}% 사용 중</span>
                            <span>{formatBytes(stats.disk.used_bytes)} / {formatBytes(stats.disk.total_bytes)}</span>
                        </div>
                        <div className={s.barWrap}>
                            <div className={`${s.barFill} ${s[barColor(diskPct)]}`} style={{ width: `${diskPct}%` }} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
