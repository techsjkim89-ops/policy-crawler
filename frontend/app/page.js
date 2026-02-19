'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../src/components/Header';
import HeroSection from '../src/components/HeroSection';
import CategoryGrid from '../src/components/CategoryGrid';
import FilterSidebar from '../src/components/FilterSidebar';
import PolicyTable from '../src/components/PolicyTable';
import PolicyCard from '../src/components/PolicyCard';
import { getCategoryById } from '../src/data/categories';
import { calculateDDay } from '../src/lib/utils';

const API_BASE = '/api';



export default function HomePage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [viewMode, setViewMode] = useState('table');
    const [filters, setFilters] = useState({
        status: [],
        region: [],
        visa: [],
        requiresCreditOnly: false,
    });
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [stats, setStats] = useState({ total: 0, newCount: 0, byCategory: {}, byStatus: {} });

    const fetchPolicies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (selectedCategories.length === 1) params.set('category', selectedCategories[0]);
            if (filters.requiresCreditOnly) params.set('isCreditRequired', 'true');
            params.set('limit', '200');

            const res = await fetch(`${API_BASE}/policies?${params}`);
            const data = await res.json();
            if (data.success) { setPolicies(data.data || []); }
            else { setError(data.error || '데이터 조회 실패'); }
        } catch (err) {
            console.warn('API 연결 실패, 데모 모드:', err.message);
            try {
                const { policies: demoData } = await import('../src/data/policies');
                setPolicies(demoData);
            } catch { setError('서버 연결 실패. 서버가 실행 중인지 확인해 주세요.'); }
        } finally { setLoading(false); }
    }, [search, selectedCategories, filters.requiresCreditOnly]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            const data = await res.json();
            if (data.success) setStats(data.data);
        } catch { /* pass */ }
    }, []);

    useEffect(() => { fetchPolicies(); fetchStats(); }, [fetchPolicies, fetchStats]);
    useEffect(() => {
        const saved = localStorage.getItem('policy-bookmarks');
        if (saved) setBookmarks(JSON.parse(saved));
    }, []);
    useEffect(() => {
        localStorage.setItem('policy-bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const toggleBookmark = (id) => {
        setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
    };



    const toggleCategory = (catId) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
        );
    };

    const filteredPolicies = useMemo(() => {
        let result = [...policies];
        if (selectedCategories.length > 0) {
            result = result.filter(p => selectedCategories.includes(p.category));
        }
        if (filters.status?.length > 0) {
            result = result.filter(p => filters.status.includes(p.status));
        }
        if (filters.region?.length > 0) {
            result = result.filter(p => {
                const regions = p.targetRegion || p.target_region || [];
                return regions.includes('all') || regions.some(r => filters.region.includes(r));
            });
        }
        // 검색어 필터
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter(p =>
                (p.title || '').toLowerCase().includes(q) ||
                (p.organization || '').toLowerCase().includes(q) ||
                (p.summary || '').toLowerCase().includes(q)
            );
        }

        // 최신순 정렬: 접수중/마감임박 우선 → 시작일 내림차순
        const statusOrder = { open: 0, closing: 1, upcoming: 2, closed: 3 };
        result.sort((a, b) => {
            const sa = statusOrder[a.status] ?? 9;
            const sb = statusOrder[b.status] ?? 9;
            if (sa !== sb) return sa - sb;
            const da = new Date(a.startDate || a.start_date || 0);
            const db = new Date(b.startDate || b.start_date || 0);
            return db - da;
        });

        return result;
    }, [policies, selectedCategories, filters.status, filters.region, search]);

    return (
        <div className="min-h-screen bg-md-surface">
            <Header onSearch={setSearch} />
            <HeroSection stats={stats} />
            <CategoryGrid selected={selectedCategories} onToggle={toggleCategory} onClear={() => setSelectedCategories([])} />

            {/* Stats Bar */}
            <section className="bg-md-surface border-b border-md-outline-variant">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="font-display text-title-md text-md-on-surface">전체 정책</h2>
                            <span className="px-2.5 py-1 bg-md-primary text-md-on-primary text-label-lg rounded-full">
                                {stats.total || filteredPolicies.length}
                            </span>
                            {stats.newCount > 0 && (
                                <span className="px-2.5 py-1 bg-md-error text-md-on-error text-label-sm rounded-full">
                                    +{stats.newCount} 신규
                                </span>
                            )}
                        </div>

                        {/* M3 Segmented Button */}
                        <div className="flex items-center bg-md-surface-container-high rounded-full p-0.5">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-1.5 px-4 py-2 text-label-lg rounded-full transition-all duration-medium1 ${viewMode === 'table'
                                    ? 'bg-md-primary-container text-md-on-primary-container'
                                    : 'text-md-on-surface-variant hover:bg-md-on-surface/[0.08]'
                                    }`}
                            >
                                {viewMode === 'table' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                리스트
                            </button>
                            <button
                                onClick={() => setViewMode('card')}
                                className={`flex items-center gap-1.5 px-4 py-2 text-label-lg rounded-full transition-all duration-medium1 ${viewMode === 'card'
                                    ? 'bg-md-primary-container text-md-on-primary-container'
                                    : 'text-md-on-surface-variant hover:bg-md-on-surface/[0.08]'
                                    }`}
                            >
                                {viewMode === 'card' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                카드
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <FilterSidebar filters={filters} setFilters={setFilters} />

                    <div className="flex-1 min-w-0">
                        {/* Active Filters Display */}
                        {(selectedCategories.length > 0 || filters.requiresCreditOnly) && (
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                {selectedCategories.map(catId => {
                                    const cat = getCategoryById(catId);
                                    return (
                                        <span key={catId} className="inline-flex items-center gap-1 px-3 py-1.5 text-label-lg rounded-full text-white" style={{ backgroundColor: cat.color }}>
                                            {cat.icon} {cat.name}
                                            <button onClick={() => toggleCategory(catId)} className="ml-1 hover:opacity-70">✕</button>
                                        </span>
                                    );
                                })}
                                {filters.requiresCreditOnly && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-md-error-container text-md-on-error-container text-label-lg rounded-full">
                                        신용평가 필수
                                    </span>
                                )}
                                <span className="text-body-sm text-md-on-surface-variant ml-2">
                                    {filteredPolicies.length}건
                                </span>
                            </div>
                        )}

                        {/* Inline Search */}
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor" className="text-md-on-surface-variant">
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="정책명, 기관명으로 검색..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-md-surface-container-low border border-md-outline-variant rounded-full text-body-md text-md-on-surface placeholder:text-md-on-surface-variant/60 focus:outline-none focus:border-md-primary focus:ring-1 focus:ring-md-primary transition"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-md-on-surface-variant hover:text-md-on-surface"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
                                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="skeleton h-16 w-full" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-md-error-container border border-md-error/20 rounded-xl p-8 text-center">
                                <p className="text-title-md text-md-on-error-container mb-2">⚠️ {error}</p>
                                <button
                                    onClick={fetchPolicies}
                                    className="px-6 py-2.5 bg-md-primary text-md-on-primary rounded-full text-label-lg hover:shadow-elevation-1 transition"
                                >
                                    다시 시도
                                </button>
                            </div>
                        ) : viewMode === 'table' ? (
                            <PolicyTable
                                policies={filteredPolicies}
                                onRowClick={setSelectedPolicy}
                                onBookmark={toggleBookmark}
                                bookmarks={bookmarks}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredPolicies.map(policy => (
                                    <PolicyCard
                                        key={policy.id}
                                        policy={policy}
                                        onSelect={setSelectedPolicy}
                                        isBookmarked={bookmarks.includes(policy.id)}
                                        onToggleBookmark={toggleBookmark}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* M3 Dialog (상세 모달) */}
            {selectedPolicy && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setSelectedPolicy(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="bg-md-surface-container-low rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevation-3 animate-scaleIn"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Dialog Header */}
                        <div className="sticky top-0 bg-md-primary-container px-6 py-4 rounded-t-[28px] flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                {(selectedPolicy.requiresCreditReport || selectedPolicy.is_credit_required) && (
                                    <span className="px-2.5 py-1 bg-md-error text-md-on-error text-label-sm font-medium rounded-full">
                                        신용평가 필수
                                    </span>
                                )}
                                <span className="text-label-lg text-md-on-primary-container">{selectedPolicy.organization}</span>
                            </div>
                            <button
                                onClick={() => setSelectedPolicy(null)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-md-on-primary-container/[0.08] transition"
                                aria-label="닫기"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor" className="text-md-on-primary-container">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </svg>
                            </button>
                        </div>

                        {/* Dialog Content */}
                        <div className="p-6">
                            <h2 className="font-display text-headline-sm text-md-on-surface mb-4">{selectedPolicy.title}</h2>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-md-surface-container rounded-xl p-3">
                                    <p className="text-label-sm text-md-on-surface-variant mb-1">접수기간</p>
                                    <p className="text-body-md text-md-on-surface font-medium">
                                        {selectedPolicy.startDate || selectedPolicy.start_date || '-'} ~ {selectedPolicy.endDate || selectedPolicy.end_date || '-'}
                                    </p>
                                </div>
                                <div className="bg-md-surface-container rounded-xl p-3">
                                    <p className="text-label-sm text-md-on-surface-variant mb-1">D-Day</p>
                                    <p className={`text-body-md font-medium ${calculateDDay(selectedPolicy.endDate || selectedPolicy.end_date).urgent ? 'text-md-error' : 'text-md-primary'}`}>
                                        {calculateDDay(selectedPolicy.endDate || selectedPolicy.end_date).text}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-title-sm text-md-on-surface mb-2">사업 요약</h3>
                                <p className="text-body-md text-md-on-surface-variant leading-relaxed">
                                    {selectedPolicy.summary || '상세 내용은 원문을 확인해 주세요.'}
                                </p>
                            </div>

                            {(selectedPolicy.targetVisa || selectedPolicy.target_visa)?.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-title-sm text-md-on-surface mb-2">대상 비자</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(selectedPolicy.targetVisa || selectedPolicy.target_visa).map(v => (
                                            <span key={v} className="px-3 py-1 bg-md-primary-container text-md-on-primary-container text-label-lg rounded-full">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-md-outline-variant">
                                <a
                                    href={selectedPolicy.originalUrl || selectedPolicy.original_url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 bg-md-primary text-md-on-primary text-center text-label-lg font-medium rounded-full hover:shadow-elevation-1 transition"
                                >
                                    공고 원문 보기
                                </a>
                                <button
                                    onClick={() => toggleBookmark(selectedPolicy.id)}
                                    className={`px-6 py-3 border-2 rounded-full text-label-lg font-medium transition ${bookmarks.includes(selectedPolicy.id)
                                        ? 'border-[#F9AB00] bg-[#F9AB00]/10 text-[#F9AB00]'
                                        : 'border-md-outline text-md-on-surface-variant hover:border-md-primary hover:text-md-primary'
                                        }`}
                                >
                                    {bookmarks.includes(selectedPolicy.id) ? '★ 스크랩됨' : '☆ 스크랩'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-md-surface-container-high border-t border-md-outline-variant mt-12">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-md-primary rounded-lg flex items-center justify-center text-md-on-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                                        <path d="M200-120v-560h160v120h400v320h-80v120h-80v-120H360v120H200Zm80-80h80v-80h240v80h80v-240H280v240Zm80-320h160v-160H360v160Zm-80 320v-240 240Z" />
                                    </svg>
                                </div>
                                <span className="font-display text-title-sm text-md-on-surface">정책 아카이브</span>
                            </div>
                            <p className="text-body-sm text-md-on-surface-variant leading-relaxed">
                                외국인을 위한 정부 지원사업<br />통합 검색 플랫폼
                            </p>
                        </div>

                        {/* 서비스 */}
                        <div>
                            <h4 className="text-label-lg text-md-on-surface mb-3">서비스</h4>
                            <ul className="space-y-2">
                                <li><a href="/" className="text-body-sm text-md-on-surface-variant hover:text-md-primary transition">정책 검색</a></li>
                                <li><a href="/policies" className="text-body-sm text-md-on-surface-variant hover:text-md-primary transition">전체 정책</a></li>
                            </ul>
                        </div>

                        {/* 안내 */}
                        <div>
                            <h4 className="text-label-lg text-md-on-surface mb-3">안내</h4>
                            <ul className="space-y-2">
                                <li><span className="text-body-sm text-md-on-surface-variant">데이터 출처: 정부24, 고용노동부 등</span></li>
                                <li><span className="text-body-sm text-md-on-surface-variant">문의: support@policy-archive.kr</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-md-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-body-sm text-md-on-surface-variant">
                            © 2026 정책 아카이브. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-body-sm text-md-on-surface-variant hover:text-md-primary transition">이용약관</a>
                            <a href="#" className="text-body-sm text-md-on-surface-variant hover:text-md-primary transition">개인정보처리방침</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
