'use client';

/**
 * M3 CategoryGrid — 다중 선택 Chip 그룹
 */
import { CATEGORIES, CATEGORY_GROUPS } from '../data/categories';

export default function CategoryGrid({ selected = [], onToggle, onClear }) {
    const hasSelection = selected.length > 0;

    return (
        <section className="bg-md-surface-container-low border-b border-md-outline-variant">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="font-display text-title-lg text-md-on-surface">분야별 탐색</h2>
                        {hasSelection && (
                            <span className="px-2 py-0.5 bg-md-primary text-md-on-primary text-label-sm rounded-full">
                                {selected.length}개 선택
                            </span>
                        )}
                    </div>
                    {hasSelection && (
                        <button
                            onClick={onClear}
                            className="flex items-center gap-1 px-3 py-1.5 text-label-lg text-md-primary hover:bg-md-primary/[0.08] rounded-full transition"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            전체 해제
                        </button>
                    )}
                </div>

                {/* Category Chips by Group */}
                <div className="space-y-3">
                    {CATEGORY_GROUPS.map(group => (
                        <div key={group} className="flex items-center gap-2 flex-wrap">
                            <span className="text-label-sm text-md-on-surface-variant w-16 flex-shrink-0 hidden sm:block">
                                {group}
                            </span>
                            <div className="flex gap-2 flex-wrap">
                                {CATEGORIES.filter(c => c.group === group).map(cat => {
                                    const isSelected = selected.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => onToggle(cat.id)}
                                            className={`group flex items-center gap-2 px-4 py-2 rounded-full text-label-lg transition-all duration-short4 ${isSelected
                                                ? 'text-white shadow-elevation-1'
                                                : 'bg-md-surface text-md-on-surface border border-md-outline hover:shadow-elevation-1'
                                                }`}
                                            style={isSelected ? { backgroundColor: cat.color } : {}}
                                        >
                                            <span className="text-base">{cat.icon}</span>
                                            <span>{cat.name}</span>
                                            {isSelected && (
                                                <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
