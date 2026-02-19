'use client';

/**
 * M3 FilterSidebar — 데스크탑 사이드바 + 모바일 바텀시트
 */
import { useState, useEffect } from 'react';

export default function FilterSidebar({ filters, setFilters }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const statusOptions = [
        { id: 'open', label: '접수중', color: 'bg-[#CEEAD6] text-[#0D652D]' },
        { id: 'closing', label: '마감임박', color: 'bg-md-error-container text-md-error' },
        { id: 'upcoming', label: '접수예정', color: 'bg-md-primary-container text-md-on-primary-container' },
    ];

    const regionOptions = [
        '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종',
        '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
    ];

    const toggleFilter = (key, value) => {
        setFilters(prev => {
            const current = prev[key] || [];
            return {
                ...prev,
                [key]: current.includes(value)
                    ? current.filter(v => v !== value)
                    : [...current, value],
            };
        });
    };

    const clearAll = () => {
        setFilters({ status: [], region: [], visa: [], requiresCreditOnly: false });
    };

    const hasFilters = filters.status?.length > 0 || filters.region?.length > 0 ||
        filters.visa?.length > 0 || filters.requiresCreditOnly;

    // 모바일 바텀시트 열릴 때 스크롤 잠금
    useEffect(() => {
        if (mobileOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const filterActiveCount = (filters.status?.length || 0) + (filters.region?.length || 0) + (filters.requiresCreditOnly ? 1 : 0);

    const FilterContent = () => (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-title-md text-md-on-surface font-display">필터</h3>
                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="text-label-lg text-md-primary hover:bg-md-primary/[0.08] px-2 py-1 rounded-full transition"
                    >
                        초기화
                    </button>
                )}
            </div>

            {/* Credit Report Switch (M3 Standard) */}
            <div className="bg-md-surface-container-low border border-md-outline-variant rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                        <p className="text-label-lg text-md-on-surface">신용평가 필수</p>
                        <p className="text-body-sm text-md-on-surface-variant">신용평가가 필요한 사업만</p>
                    </div>
                    <div className="relative flex-shrink-0 ml-3">
                        <input
                            type="checkbox"
                            checked={filters.requiresCreditOnly}
                            onChange={(e) => setFilters(prev => ({ ...prev, requiresCreditOnly: e.target.checked }))}
                            className="sr-only peer"
                        />
                        {/* Track */}
                        <div className="w-[52px] h-[32px] rounded-full transition-colors duration-200
                                      bg-[#79747E] peer-checked:bg-md-primary" />
                        {/* Thumb */}
                        <div className="absolute top-1/2 left-[6px] -translate-y-1/2
                                      w-[20px] h-[20px] rounded-full transition-all duration-200 ease-in-out
                                      bg-white shadow-md
                                      peer-checked:translate-x-[20px] peer-checked:w-[24px] peer-checked:h-[24px] peer-checked:left-[3px]
                                      flex items-center justify-center overflow-hidden">
                        </div>
                        {/* Check icon */}
                        <svg
                            className="absolute top-1/2 -translate-y-1/2 left-[10px] w-[14px] h-[14px] text-md-primary
                                       opacity-0 pointer-events-none transition-all duration-200
                                       peer-checked:opacity-100 peer-checked:translate-x-[20px] peer-checked:left-[8px]"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </label>
            </div>

            {/* Status Filter Chips */}
            <div className="bg-md-surface-container-low border border-md-outline-variant rounded-xl p-4">
                <p className="text-label-lg text-md-on-surface mb-3">접수 상태</p>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map(opt => {
                        const isSelected = filters.status?.includes(opt.id);
                        return (
                            <button
                                key={opt.id}
                                onClick={() => toggleFilter('status', opt.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-lg transition-all duration-short4 ${isSelected
                                    ? `${opt.color} ring-1 ring-current`
                                    : 'bg-md-surface border border-md-outline text-md-on-surface-variant hover:bg-md-surface-container-high'
                                    }`}
                            >
                                {isSelected && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Region Filter */}
            <div className="bg-md-surface-container-low border border-md-outline-variant rounded-xl p-4">
                <p className="text-label-lg text-md-on-surface mb-3">지역</p>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {regionOptions.map(region => {
                        const isSelected = filters.region?.includes(region);
                        return (
                            <button
                                key={region}
                                onClick={() => toggleFilter('region', region)}
                                className={`px-2.5 py-1 rounded-full text-label-md transition-all duration-short4 ${isSelected
                                    ? 'bg-md-primary text-md-on-primary'
                                    : 'bg-md-surface border border-md-outline text-md-on-surface-variant hover:bg-md-surface-container-high'
                                    }`}
                            >
                                {region}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            {hasFilters && (
                <div className="bg-md-primary-container rounded-xl p-3 animate-fadeIn">
                    <p className="text-label-sm text-md-on-primary-container">
                        {[
                            filters.status?.length > 0 && `상태 ${filters.status.length}개`,
                            filters.region?.length > 0 && `지역 ${filters.region.length}개`,
                            filters.requiresCreditOnly && '신용평가 필수',
                        ].filter(Boolean).join(' · ')}
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-64 flex-shrink-0 hidden lg:block">
                <div className="sticky top-24">
                    <FilterContent />
                </div>
            </aside>

            {/* Mobile FAB — 우측 하단 */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2 h-14 px-5 bg-md-primary-container text-md-on-primary-container rounded-2xl shadow-elevation-3 hover:shadow-elevation-4 transition-all duration-medium2"
                aria-label="필터 열기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                    <path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z" />
                </svg>
                <span className="text-label-lg font-medium">필터</span>
                {filterActiveCount > 0 && (
                    <span className="w-5 h-5 bg-md-primary text-md-on-primary text-label-sm rounded-full flex items-center justify-center">
                        {filterActiveCount}
                    </span>
                )}
            </button>

            {/* Mobile Bottom Sheet */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Scrim */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 bg-md-surface-container-low rounded-t-[28px] p-6 pt-2 max-h-[85vh] overflow-y-auto animate-slideUp">
                        {/* Drag handle */}
                        <div className="flex justify-center py-3 mb-2">
                            <div className="w-8 h-1 bg-md-on-surface-variant/30 rounded-full" />
                        </div>

                        <FilterContent />

                        {/* 적용 버튼 */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="w-full mt-6 h-12 bg-md-primary text-md-on-primary rounded-full text-label-lg font-medium hover:shadow-elevation-1 transition"
                        >
                            {hasFilters ? `필터 적용 (${filterActiveCount}개)` : '닫기'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
