'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './Header';
import FilterSidebar from './FilterSidebar';
import PolicyCard from './PolicyCard';
import PolicyTable from './PolicyTable';

const API_BASE = '/api';



function calculateDDay(endDate) {
    if (!endDate) return { text: '상시', urgent: false };
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: '마감', urgent: false };
    if (diff === 0) return { text: 'D-Day', urgent: true };
    if (diff <= 7) return { text: `D-${diff}`, urgent: true };
    return { text: `D-${diff}`, urgent: false };
}

export default function PolicyList() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [filters, setFilters] = useState({
        status: [],
        region: [],
        visa: [],
        requiresCreditOnly: false,
    });
    const [viewMode, setViewMode] = useState('card');

    const fetchPolicies = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/policies?limit=200`);
            const data = await res.json();
            if (data.success) setPolicies(data.data || []);
        } catch (e) {
            console.error('정책 로드 실패:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

    const filtered = useMemo(() => {
        let result = policies;

        // 카테고리 필터
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 상태 필터
        if (selectedStatus !== 'all') {
            result = result.filter(p => p.status === selectedStatus);
        }

        // 검색 필터
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.title?.toLowerCase().includes(q) ||
                p.organization?.toLowerCase().includes(q) ||
                p.summary?.toLowerCase().includes(q)
            );
        }

        return result;
    }, [policies, selectedCategory, selectedStatus, search]);

    return (
        <div className="min-h-screen bg-md-surface">
            <Header
                onSearch={setSearch}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex gap-6">
                    {/* 필터 사이드바 */}
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                    />

                    {/* 정책 리스트 */}
                    <section className="flex-1">
                        {/* 상단 정보 바 */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-body-md text-md-on-surface-variant">
                                검색 결과 <span className="font-medium text-md-on-surface">{filtered.length}</span>건
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${viewMode === 'card' ? 'bg-md-primary-container text-md-on-primary-container' : 'text-md-on-surface-variant hover:bg-md-on-surface/[0.08]'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520Z" /></svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${viewMode === 'table' ? 'bg-md-primary-container text-md-on-primary-container' : 'text-md-on-surface-variant hover:bg-md-on-surface/[0.08]'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M120-200v-560h720v560H120Zm80-400h560v-80H200v80Zm199 160h162v-80H399v80Zm0 160h162v-80H399v80ZM200-440h119v-80H200v80Zm441 0h119v-80H641v80ZM200-280h119v-80H200v80Zm441 0h119v-80H641v80Z" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* 로딩 */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-10 h-10 border-3 border-md-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* 정책 카드/테이블 */}
                        {!loading && viewMode === 'card' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.map(p => (
                                    <PolicyCard key={p.id} policy={p} dday={calculateDDay(p.endDate || p.end_date)} />
                                ))}
                            </div>
                        )}

                        {!loading && viewMode === 'table' && (
                            <PolicyTable policies={filtered} />
                        )}

                        {!loading && filtered.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-display-sm mb-2">🔍</p>
                                <p className="text-body-lg text-md-on-surface-variant">조건에 맞는 정책이 없습니다.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
