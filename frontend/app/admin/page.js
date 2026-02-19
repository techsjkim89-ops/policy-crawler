'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_BASE = '/api';

// 15개 카테고리 (config.js 기준)
const CATEGORIES = [
    { id: 'startup', name: '창업지원', icon: '🚀', group: '창업·기업' },
    { id: 'sme', name: '중소기업', icon: '🏭', group: '창업·기업' },
    { id: 'smallbiz', name: '소상공인', icon: '🏪', group: '창업·기업' },
    { id: 'employment', name: '취업·일자리', icon: '💼', group: '고용·인력' },
    { id: 'youth', name: '청년지원', icon: '🎓', group: '고용·인력' },
    { id: 'rnd', name: 'R&D·기술', icon: '🔬', group: '고용·인력' },
    { id: 'housing', name: '주거·정착', icon: '🏠', group: '생활·복지' },
    { id: 'medical', name: '의료·건강', icon: '🏥', group: '생활·복지' },
    { id: 'education', name: '교육·훈련', icon: '📚', group: '생활·복지' },
    { id: 'welfare', name: '복지·돌봄', icon: '🤝', group: '생활·복지' },
    { id: 'visa', name: '비자·체류', icon: '🛂', group: '외국인' },
    { id: 'foreigner', name: '외국인지원', icon: '🌏', group: '외국인' },
    { id: 'finance', name: '정책자금', icon: '💰', group: '금융·세제' },
    { id: 'tax', name: '세제·감면', icon: '📋', group: '금융·세제' },
    { id: 'export', name: '수출·해외', icon: '✈️', group: '기타' },
];

const STATUS_MAP = {
    open: { label: '접수중', cls: 'bg-[#C4EED0] text-[#0D652D]' },
    closing: { label: '마감임박', cls: 'bg-[#F9DEDC] text-[#410E0B]' },
    upcoming: { label: '접수예정', cls: 'bg-[#D3E3FD] text-[#041E49]' },
    closed: { label: '마감', cls: 'bg-[#E3E3E3] text-[#444746]' },
};

const TABS = [
    {
        id: 'dashboard', label: '대시보드', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160ZM120-160v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Z" /></svg>
        )
    },
    {
        id: 'policies', label: '정책 관리', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-40H440v40Zm0-160h240v-40H440v40Zm0-160h240v-40H440v40ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z" /></svg>
        )
    },
    {
        id: 'crawler', label: '크롤링', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" /></svg>
        )
    },
    {
        id: 'logs', label: '로그', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-480H200v480Zm40-40h200v-80H240v80Zm300-120H240v-80h300v80Zm180 120H540v-200h180v200ZM240-560h480v-80H240v80Z" /></svg>
        )
    },
];

export default function AdminPage() {
    const [policies, setPolicies] = useState([]);
    const [sites, setSites] = useState([]);
    const [logs, setLogs] = useState([]);
    const [scheduler, setScheduler] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [crawling, setCrawling] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [crawlingSiteId, setCrawlingSiteId] = useState(null);

    // 데이터 로드
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [policiesRes, sitesRes, logsRes, schedulerRes, statsRes] = await Promise.all([
                fetch(`${API_BASE}/policies?limit=200`).then(r => r.json()).catch(() => ({ success: false })),
                fetch(`${API_BASE}/admin/sites`).then(r => r.json()).catch(() => ({ success: false })),
                fetch(`${API_BASE}/admin/logs`).then(r => r.json()).catch(() => ({ success: false })),
                fetch(`${API_BASE}/admin/scheduler`).then(r => r.json()).catch(() => ({ success: false })),
                fetch(`${API_BASE}/stats`).then(r => r.json()).catch(() => ({ success: false })),
            ]);
            if (policiesRes.success) setPolicies(policiesRes.data || []);
            if (sitesRes.success) setSites(sitesRes.data || []);
            if (logsRes.success) setLogs(logsRes.data || []);
            if (schedulerRes.success) setScheduler(schedulerRes.data);
            if (statsRes.success) setStats(statsRes.data);
        } catch (err) {
            console.error('데이터 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // 수동 크롤링 실행
    const executeCrawl = async (siteId = null) => {
        setCrawling(true);
        if (siteId) setCrawlingSiteId(siteId);
        try {
            const url = siteId ? `${API_BASE}/admin/crawl/${siteId}` : `${API_BASE}/admin/crawl`;
            const res = await fetch(url, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                fetchAll();
            }
        } catch { /* ignore */ } finally {
            setCrawling(false);
            setCrawlingSiteId(null);
        }
    };

    // 스케줄러 토글
    const toggleScheduler = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/scheduler/toggle`, { method: 'POST' });
            const data = await res.json();
            if (data.success) setScheduler(data.data);
        } catch { /* ignore */ }
    };

    // 로딩 화면 (M3 Skeleton)
    if (loading) {
        return (
            <div className="min-h-screen bg-md-surface flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-md-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-body-md text-md-on-surface-variant">관리자 대시보드 로딩 중...</p>
                </div>
            </div>
        );
    }

    // 통계 계산
    const totalPolicies = stats?.total || policies.length;
    const openCount = stats?.byStatus?.open || policies.filter(p => p.status === 'open').length;
    const closingCount = stats?.byStatus?.closing || policies.filter(p => p.status === 'closing').length;
    const newCount = stats?.newCount || 0;
    const enabledSites = sites.filter(s => s.enabled).length;

    return (
        <div className="min-h-screen bg-md-surface">
            {/* ===== M3 Top App Bar ===== */}
            <header className="bg-md-surface-container sticky top-0 z-40 border-b border-md-outline-variant">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-md-on-surface/[0.08] transition text-md-on-surface-variant">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
                            </Link>
                            <div>
                                <h1 className="font-display text-title-lg text-md-on-surface">관리자 대시보드</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => executeCrawl()}
                                disabled={crawling}
                                className="h-10 px-6 rounded-full bg-md-primary text-md-on-primary text-label-lg font-medium hover:shadow-elevation-1 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {crawling && !crawlingSiteId ? (
                                    <div className="w-4 h-4 border-2 border-md-on-primary border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-692v-88h80v280H520v-80h168q-32-56-87.5-88T480-700q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg>
                                )}
                                <span className="hidden sm:inline">{crawling && !crawlingSiteId ? '크롤링 중...' : '전체 크롤링'}</span>
                            </button>
                        </div>
                    </div>

                    {/* M3 Navigation Tabs */}
                    <nav className="flex gap-0 -mb-px overflow-x-auto scrollbar-hide">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-2 px-5 py-3 text-label-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'text-md-primary'
                                        : 'text-md-on-surface-variant hover:text-md-on-surface'
                                    }`}
                            >
                                <span className={activeTab === tab.id ? 'text-md-primary' : 'text-md-on-surface-variant'}>{tab.icon}</span>
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-4 right-4 h-[3px] bg-md-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* ===== 대시보드 탭 ===== */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* 메트릭 카드 */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <MetricCard value={totalPolicies} label="전체 정책" color="text-md-primary" />
                            <MetricCard value={openCount} label="접수중" color="text-[#0D652D]" />
                            <MetricCard value={closingCount} label="마감임박" color="text-[#BA1A1A]" />
                            <MetricCard value={newCount} label="신규 정책" color="text-[#0B57D0]" />
                            <div className="bg-md-surface-container rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${scheduler?.enabled ? 'bg-[#0D652D]' : 'bg-[#BA1A1A]'}`}></span>
                                    <p className="text-title-md text-md-on-surface font-medium">{scheduler?.enabled ? '활성' : '비활성'}</p>
                                </div>
                                <p className="text-body-sm text-md-on-surface-variant">스케줄러</p>
                                <button
                                    onClick={toggleScheduler}
                                    className="mt-3 h-8 px-4 rounded-full border border-md-outline text-label-sm text-md-primary hover:bg-md-primary/[0.08] transition"
                                >
                                    {scheduler?.enabled ? '중지' : '시작'}
                                </button>
                            </div>
                        </div>

                        {/* 크롤링 사이트 상태 (컴팩트) */}
                        <div className="bg-md-surface-container rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-md-outline-variant/50 flex items-center justify-between">
                                <h2 className="text-title-md text-md-on-surface font-medium">크롤링 사이트 ({enabledSites}/{sites.length})</h2>
                                <button onClick={() => setActiveTab('crawler')} className="text-label-md text-md-primary hover:underline">관리 →</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-md-outline-variant/30">
                                {sites.map(site => (
                                    <div key={site.id} className="bg-md-surface-container p-4 flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${site.enabled ? 'bg-[#0D652D]' : 'bg-[#BA1A1A]'}`}></span>
                                        <span className="text-body-sm text-md-on-surface truncate">{site.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 최근 로그 */}
                        <div className="bg-md-surface-container rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-md-outline-variant/50 flex items-center justify-between">
                                <h2 className="text-title-md text-md-on-surface font-medium">최근 크롤링 로그</h2>
                                <button onClick={() => setActiveTab('logs')} className="text-label-md text-md-primary hover:underline">전체 보기 →</button>
                            </div>
                            <div className="divide-y divide-md-outline-variant/30">
                                {logs.slice(0, 5).map((log, i) => (
                                    <div key={i} className="px-6 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-[#0D652D]' : 'bg-[#BA1A1A]'}`}></span>
                                            <span className="text-body-md text-md-on-surface font-medium">{log.siteName}</span>
                                            <span className="text-body-sm text-md-on-surface-variant">{log.completedAt ? new Date(log.completedAt).toLocaleString('ko-KR') : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-body-sm">
                                            <span className="text-[#0D652D]">+{log.newAdded || 0}</span>
                                            <span className="text-md-on-surface-variant">중복 {log.duplicatesSkipped || 0}</span>
                                        </div>
                                    </div>
                                ))}
                                {logs.length === 0 && (
                                    <div className="px-6 py-10 text-center text-body-md text-md-on-surface-variant">크롤링 로그가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== 정책 관리 탭 ===== */}
                {activeTab === 'policies' && (
                    <div className="bg-md-surface-container rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-md-outline-variant/50 flex items-center justify-between">
                            <h2 className="text-title-md text-md-on-surface font-medium">정책 목록 ({policies.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-md-surface-container-high border-b border-md-outline-variant/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">정책명</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium hidden md:table-cell">기관</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">카테고리</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">상태</th>
                                        <th className="px-4 py-3 text-center text-label-sm text-md-on-surface-variant font-medium hidden sm:table-cell">신용</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium hidden lg:table-cell">마감</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-md-outline-variant/30">
                                    {policies.map(policy => {
                                        const cat = CATEGORIES.find(c => c.id === policy.category);
                                        const badge = STATUS_MAP[policy.status] || STATUS_MAP.open;
                                        return (
                                            <tr key={policy.id} className="hover:bg-md-on-surface/[0.04] transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <p className="text-body-md text-md-on-surface font-medium max-w-xs truncate">{policy.title}</p>
                                                </td>
                                                <td className="px-4 py-3.5 hidden md:table-cell">
                                                    <p className="text-body-sm text-md-on-surface-variant truncate max-w-[180px]">{policy.organization}</p>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="inline-flex items-center gap-1 text-body-sm text-md-on-surface-variant">
                                                        {cat?.icon} {cat?.name || policy.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium ${badge.cls}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                                                    {(policy.requiresCreditReport || policy.is_credit_required)
                                                        ? <span className="inline-flex items-center justify-center w-6 h-6 bg-[#BA1A1A] text-white text-[10px] rounded-full font-bold">필</span>
                                                        : <span className="text-md-on-surface-variant/40">—</span>
                                                    }
                                                </td>
                                                <td className="px-4 py-3.5 hidden lg:table-cell">
                                                    <span className="text-body-sm text-md-on-surface-variant">{policy.endDate || policy.end_date || '—'}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {policies.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <p className="text-body-lg text-md-on-surface-variant mb-4">등록된 정책이 없습니다.</p>
                                <button
                                    onClick={() => executeCrawl()}
                                    className="h-10 px-6 rounded-full bg-md-primary text-md-on-primary text-label-lg hover:shadow-elevation-1 transition"
                                >
                                    크롤링 실행
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== 크롤링 탭 ===== */}
                {activeTab === 'crawler' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-title-md text-md-on-surface font-medium">크롤링 사이트 관리</h2>
                            <button
                                onClick={() => executeCrawl()}
                                disabled={crawling}
                                className="h-10 px-6 rounded-full bg-md-primary text-md-on-primary text-label-lg hover:shadow-elevation-1 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {crawling && !crawlingSiteId ? (
                                    <div className="w-4 h-4 border-2 border-md-on-primary border-t-transparent rounded-full animate-spin" />
                                ) : null}
                                {crawling && !crawlingSiteId ? '진행 중...' : '전체 크롤링 실행'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sites.map(site => {
                                const cat = CATEGORIES.find(c => c.id === site.category);
                                const isThisCrawling = crawling && crawlingSiteId === site.id;
                                return (
                                    <div key={site.id} className="bg-md-surface-container rounded-xl p-5 hover:shadow-elevation-1 transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${site.enabled ? 'bg-[#0D652D]' : 'bg-[#BA1A1A]'}`}></span>
                                                <h3 className="text-body-lg text-md-on-surface font-medium">{site.name}</h3>
                                            </div>
                                            {cat && (
                                                <span className="px-2.5 py-0.5 bg-md-primary-container text-md-on-primary-container text-label-sm rounded-full">
                                                    {cat.icon} {cat.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-body-sm text-md-on-surface-variant truncate mb-4">{site.url}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-label-sm ${site.enabled ? 'text-[#0D652D]' : 'text-[#BA1A1A]'}`}>
                                                {site.enabled ? '활성' : '비활성'}
                                            </span>
                                            <button
                                                onClick={() => executeCrawl(site.id)}
                                                disabled={crawling}
                                                className="h-8 px-4 rounded-full border border-md-outline text-label-sm text-md-primary hover:bg-md-primary/[0.08] disabled:opacity-50 transition-all flex items-center gap-2"
                                            >
                                                {isThisCrawling && <div className="w-3 h-3 border-2 border-md-primary border-t-transparent rounded-full animate-spin" />}
                                                {isThisCrawling ? '진행 중' : '크롤링'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {sites.length === 0 && (
                                <div className="col-span-3 bg-md-surface-container rounded-xl p-16 text-center text-body-md text-md-on-surface-variant">
                                    등록된 크롤링 사이트가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== 로그 탭 ===== */}
                {activeTab === 'logs' && (
                    <div className="bg-md-surface-container rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-md-outline-variant/50">
                            <h2 className="text-title-md text-md-on-surface font-medium">크롤링 실행 로그</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-md-surface-container-high border-b border-md-outline-variant/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">상태</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">사이트</th>
                                        <th className="px-4 py-3 text-center text-label-sm text-md-on-surface-variant font-medium">발견</th>
                                        <th className="px-4 py-3 text-center text-label-sm text-md-on-surface-variant font-medium">신규</th>
                                        <th className="px-4 py-3 text-center text-label-sm text-md-on-surface-variant font-medium">중복</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium hidden md:table-cell">시간</th>
                                        <th className="px-4 py-3 text-left text-label-sm text-md-on-surface-variant font-medium hidden lg:table-cell">에러</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-md-outline-variant/30">
                                    {logs.map((log, i) => (
                                        <tr key={i} className="hover:bg-md-on-surface/[0.04] transition-colors">
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium ${log.status === 'success' ? 'bg-[#C4EED0] text-[#0D652D]' : 'bg-[#F9DEDC] text-[#410E0B]'
                                                    }`}>
                                                    {log.status === 'success' ? '성공' : '실패'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-body-md text-md-on-surface font-medium">{log.siteName}</td>
                                            <td className="px-4 py-3 text-center text-body-sm text-md-on-surface">{log.totalFound || 0}</td>
                                            <td className="px-4 py-3 text-center text-body-sm text-[#0D652D] font-medium">+{log.newAdded || 0}</td>
                                            <td className="px-4 py-3 text-center text-body-sm text-md-on-surface-variant">{log.duplicatesSkipped || 0}</td>
                                            <td className="px-4 py-3 text-body-sm text-md-on-surface-variant hidden md:table-cell">
                                                {log.completedAt ? new Date(log.completedAt).toLocaleString('ko-KR') : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-body-sm text-[#BA1A1A] max-w-xs truncate hidden lg:table-cell">{log.errorMessage || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {logs.length === 0 && (
                            <div className="px-6 py-16 text-center text-body-md text-md-on-surface-variant">크롤링 로그가 없습니다.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

// M3 Metric Card
function MetricCard({ value, label, color }) {
    return (
        <div className="bg-md-surface-container rounded-xl p-5">
            <p className={`text-display-sm font-medium ${color}`}>{value}</p>
            <p className="text-body-sm text-md-on-surface-variant mt-1">{label}</p>
        </div>
    );
}
