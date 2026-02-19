'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_BASE = '/api';

// M3 아이콘 (인라인 SVG)
const Icons = {
    back: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
        </svg>
    ),
    refresh: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
        </svg>
    ),
    play: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
            <path d="M320-200v-560l440 280-440 280Z" />
        </svg>
    ),
    schedule: (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
            <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
        </svg>
    ),
    check: (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
    ),
    error: (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
    ),
    policy: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
            <path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Z" />
        </svg>
    ),
};

function MetricCard({ value, label, icon, variant = 'default' }) {
    const variants = {
        default: 'bg-md-surface-container-low border border-md-outline-variant',
        primary: 'bg-md-primary-container',
        success: 'bg-md-tertiary-container',
        error: 'bg-md-error-container',
    };
    const textVariants = {
        default: 'text-md-on-surface',
        primary: 'text-md-on-primary-container',
        success: 'text-[#0D652D]',
        error: 'text-md-on-error-container',
    };
    const subVariants = {
        default: 'text-md-on-surface-variant',
        primary: 'text-md-on-primary-container/70',
        success: 'text-[#0D652D]/70',
        error: 'text-md-on-error-container/70',
    };

    return (
        <div className={`rounded-xl p-5 transition-all duration-medium2 hover:shadow-elevation-1 ${variants[variant]}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
            </div>
            <p className={`text-headline-sm font-display font-medium ${textVariants[variant]}`}>{value}</p>
            <p className={`text-body-sm mt-0.5 ${subVariants[variant]}`}>{label}</p>
        </div>
    );
}

export default function LogsPage() {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scheduler, setScheduler] = useState({ enabled: false });
    const [crawling, setCrawling] = useState(false);
    const [expandedLog, setExpandedLog] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [logsRes, statsRes, schedulerRes] = await Promise.all([
                fetch(`${API_BASE}/admin/logs`).then(r => r.json()).catch(() => ({ success: false })),
                fetch(`${API_BASE}/stats`).then(r => r.json()).catch(() => ({ success: false })),
                fetch(`${API_BASE}/admin/scheduler`).then(r => r.json()).catch(() => ({ success: false })),
            ]);

            if (logsRes.success) setLogs(logsRes.data || []);
            if (statsRes.success) setStats(statsRes.data || null);
            if (schedulerRes.success) setScheduler(schedulerRes.data || { enabled: false });
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleManualCrawl = async () => {
        setCrawling(true);
        try {
            const res = await fetch(`${API_BASE}/admin/crawl`, { method: 'POST' });
            const data = await res.json();
            if (data.success) fetchData();
        } catch { /* ignore */ } finally {
            setCrawling(false);
        }
    };

    const toggleScheduler = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/scheduler/toggle`, { method: 'POST' });
            const data = await res.json();
            if (data.success) setScheduler(data.data);
        } catch { /* ignore */ }
    };

    // 로딩
    if (loading) {
        return (
            <div className="min-h-screen bg-md-surface flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-md-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-body-md text-md-on-surface-variant">로그 데이터 로딩 중...</p>
                </div>
            </div>
        );
    }

    const successCount = logs.filter(l => l.status === 'success').length;
    const errorCount = logs.filter(l => l.status !== 'success').length;
    const totalNew = logs.reduce((sum, l) => sum + (l.new_added || 0), 0);

    return (
        <div className="min-h-screen bg-md-surface">
            {/* ===== M3 Top App Bar ===== */}
            <header className="bg-md-surface-container sticky top-0 z-40 border-b border-md-outline-variant">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="w-10 h-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:bg-md-on-surface/[0.08] transition"
                            >
                                {Icons.back}
                            </Link>
                            <div>
                                <h1 className="font-display text-title-lg text-md-on-surface">수집 로그</h1>
                                <p className="text-label-sm text-md-on-surface-variant -mt-0.5 hidden sm:block">
                                    크롤링 실행 기록 및 모니터링
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* 새로고침 */}
                            <button
                                onClick={fetchData}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-md-on-surface-variant hover:bg-md-on-surface/[0.08] transition"
                                title="새로고침"
                            >
                                {Icons.refresh}
                            </button>

                            {/* 스케줄러 토글 */}
                            <button
                                onClick={toggleScheduler}
                                className={`hidden sm:flex items-center gap-2 h-10 px-4 rounded-full text-label-lg transition-all duration-medium2
                                    ${scheduler.enabled
                                        ? 'bg-md-tertiary-container text-[#0D652D] hover:shadow-elevation-1'
                                        : 'bg-md-surface-container-high text-md-on-surface-variant hover:bg-md-surface-container-highest'
                                    }`}
                            >
                                {Icons.schedule}
                                <span>{scheduler.enabled ? '스케줄러 ON' : '스케줄러 OFF'}</span>
                            </button>

                            {/* 수동 크롤링 */}
                            <button
                                onClick={handleManualCrawl}
                                disabled={crawling}
                                className="flex items-center gap-2 h-10 px-5 bg-md-primary text-md-on-primary rounded-full text-label-lg hover:shadow-elevation-1 transition-all duration-medium2 disabled:opacity-60"
                            >
                                {crawling ? (
                                    <div className="w-4 h-4 border-2 border-md-on-primary border-t-transparent rounded-full animate-spin" />
                                ) : Icons.play}
                                <span className="hidden sm:inline">{crawling ? '크롤링 중...' : '수동 크롤링'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* ===== 스케줄러 상태 배너 ===== */}
                <div className={`rounded-xl p-4 mb-6 flex items-center justify-between transition-colors duration-medium2
                    ${scheduler.enabled
                        ? 'bg-md-primary-container'
                        : 'bg-md-surface-container-high'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${scheduler.enabled ? 'bg-md-primary text-md-on-primary' : 'bg-md-on-surface/[0.12] text-md-on-surface-variant'}`}>
                            {Icons.schedule}
                        </div>
                        <div>
                            <p className={`text-title-sm ${scheduler.enabled ? 'text-md-on-primary-container' : 'text-md-on-surface'}`}>
                                자동 크롤링 스케줄
                            </p>
                            <p className={`text-body-sm ${scheduler.enabled ? 'text-md-on-primary-container/70' : 'text-md-on-surface-variant'}`}>
                                매일 <strong>오전 9시</strong>와 <strong>오후 6시</strong>에 자동 실행
                                {scheduler.lastRun && ` · 마지막 실행: ${new Date(scheduler.lastRun).toLocaleString('ko-KR')}`}
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-label-lg font-medium
                        ${scheduler.enabled
                            ? 'bg-md-tertiary text-md-on-tertiary'
                            : 'bg-md-on-surface/[0.12] text-md-on-surface-variant'
                        }`}>
                        <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${scheduler.enabled ? 'bg-white animate-pulse' : 'bg-md-on-surface-variant'}`} />
                            {scheduler.enabled ? '활성' : '비활성'}
                        </span>
                    </div>
                </div>

                {/* ===== 통계 카드 ===== */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <MetricCard value={stats?.total || 0} label="전체 정책" icon="📋" variant="default" />
                    <MetricCard value={stats?.newCount || totalNew || 0} label="신규 정책" icon="🆕" variant="primary" />
                    <MetricCard value={stats?.byStatus?.open || 0} label="접수중" icon="✅" variant="success" />
                    <MetricCard value={stats?.byStatus?.closing || 0} label="마감임박" icon="⏰" variant="error" />
                </div>

                {/* ===== 크롤링 결과 요약 칩 ===== */}
                {logs.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <span className="text-label-lg text-md-on-surface-variant">최근 실행:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#CEEAD6] text-[#0D652D] text-label-md rounded-full">
                            {Icons.check} 성공 {successCount}건
                        </span>
                        {errorCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-md-error-container text-md-error text-label-md rounded-full">
                                {Icons.error} 실패 {errorCount}건
                            </span>
                        )}
                    </div>
                )}

                {/* ===== 로그 테이블 ===== */}
                <div className="bg-md-surface-container-low border border-md-outline-variant rounded-xl overflow-hidden">
                    {/* 테이블 헤더 */}
                    <div className="px-5 py-4 border-b border-md-outline-variant flex items-center justify-between">
                        <h2 className="font-display text-title-md text-md-on-surface">크롤링 로그</h2>
                        <span className="text-label-md text-md-on-surface-variant">{logs.length}건</span>
                    </div>

                    {logs.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <div className="w-16 h-16 bg-md-surface-container-high rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📭</span>
                            </div>
                            <p className="text-title-md text-md-on-surface mb-1">크롤링 로그가 없습니다</p>
                            <p className="text-body-md text-md-on-surface-variant mb-6">수동 크롤링을 실행하면 결과가 여기에 표시됩니다.</p>
                            <button
                                onClick={handleManualCrawl}
                                disabled={crawling}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-md-primary text-md-on-primary rounded-full text-label-lg hover:shadow-elevation-1 transition disabled:opacity-60"
                            >
                                {Icons.play} 크롤링 시작
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-md-outline-variant">
                                        <th className="px-5 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">사이트</th>
                                        <th className="px-5 py-3 text-left text-label-sm text-md-on-surface-variant font-medium w-20">상태</th>
                                        <th className="px-5 py-3 text-center text-label-sm text-md-on-surface-variant font-medium w-16">발견</th>
                                        <th className="px-5 py-3 text-center text-label-sm text-md-on-surface-variant font-medium w-16">신규</th>
                                        <th className="px-5 py-3 text-center text-label-sm text-md-on-surface-variant font-medium w-16">중복</th>
                                        <th className="px-5 py-3 text-left text-label-sm text-md-on-surface-variant font-medium hidden md:table-cell">에러</th>
                                        <th className="px-5 py-3 text-right text-label-sm text-md-on-surface-variant font-medium w-36">완료 시간</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-md-outline-variant">
                                    {logs.map((log, index) => {
                                        const isSuccess = log.status === 'success';
                                        const isExpanded = expandedLog === index;

                                        return (
                                            <>
                                                <tr
                                                    key={log.id || index}
                                                    onClick={() => setExpandedLog(isExpanded ? null : index)}
                                                    className="group hover:bg-md-primary/[0.04] cursor-pointer transition-colors duration-short3"
                                                >
                                                    {/* 사이트명 */}
                                                    <td className="px-5 py-3.5">
                                                        <span className="text-body-md text-md-on-surface font-medium">
                                                            {log.site_name || log.siteId || '-'}
                                                        </span>
                                                    </td>

                                                    {/* 상태 */}
                                                    <td className="px-5 py-3.5">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-medium
                                                            ${isSuccess
                                                                ? 'bg-[#CEEAD6] text-[#0D652D]'
                                                                : 'bg-md-error-container text-md-error'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-md-tertiary' : 'bg-md-error'}`} />
                                                            {isSuccess ? '성공' : '실패'}
                                                        </span>
                                                    </td>

                                                    {/* 발견 */}
                                                    <td className="px-5 py-3.5 text-center text-body-md text-md-on-surface-variant">
                                                        {log.total_found || log.totalFound || 0}
                                                    </td>

                                                    {/* 신규 */}
                                                    <td className="px-5 py-3.5 text-center">
                                                        <span className={`text-body-md font-medium ${(log.new_added || log.newAdded) > 0 ? 'text-md-primary' : 'text-md-on-surface-variant'}`}>
                                                            {(log.new_added || log.newAdded) > 0 ? `+${log.new_added || log.newAdded}` : '0'}
                                                        </span>
                                                    </td>

                                                    {/* 중복 */}
                                                    <td className="px-5 py-3.5 text-center text-body-md text-md-on-surface-variant">
                                                        {log.duplicates_skipped || log.duplicatesSkipped || 0}
                                                    </td>

                                                    {/* 에러 (데스크탑) */}
                                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                                        {(log.error_message || log.errorMessage) ? (
                                                            <span className="text-body-sm text-md-error truncate block max-w-[200px]">
                                                                {log.error_message || log.errorMessage}
                                                            </span>
                                                        ) : (
                                                            <span className="text-body-sm text-md-on-surface-variant">—</span>
                                                        )}
                                                    </td>

                                                    {/* 시간 */}
                                                    <td className="px-5 py-3.5 text-right">
                                                        <span className="text-body-sm text-md-on-surface-variant">
                                                            {log.completed_at || log.completedAt
                                                                ? new Date(log.completed_at || log.completedAt).toLocaleString('ko-KR', {
                                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                })
                                                                : '-'
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>

                                                {/* 확장 상세 (모바일 에러 표시 등) */}
                                                {isExpanded && (log.error_message || log.errorMessage) && (
                                                    <tr key={`${log.id || index}-detail`} className="bg-md-error-container/30">
                                                        <td colSpan={7} className="px-5 py-3">
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-md-error mt-0.5">{Icons.error}</span>
                                                                <p className="text-body-sm text-md-error">
                                                                    {log.error_message || log.errorMessage}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 자동 갱신 안내 */}
                <p className="text-center text-body-sm text-md-on-surface-variant mt-6">
                    30초마다 자동 갱신됩니다 · 마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
                </p>
            </main>
        </div>
    );
}
