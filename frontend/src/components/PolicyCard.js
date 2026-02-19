'use client';

/**
 * M3 PolicyCard — Outlined Card → hover 시 Elevated 전환
 */
import { getCategoryById, getStatusMeta } from '../data/categories';
import { calculateDDay } from '../lib/utils';

export default function PolicyCard({ policy, onSelect, isBookmarked, onToggleBookmark }) {
    const endDate = policy.endDate || policy.end_date;
    const dday = calculateDDay(endDate);
    const cat = getCategoryById(policy.category);
    const status = getStatusMeta(policy.status);
    const isCredit = policy.requiresCreditReport || policy.is_credit_required;

    return (
        <article
            onClick={() => onSelect?.(policy)}
            className="group bg-md-surface-container-low border border-md-outline-variant rounded-xl overflow-hidden 
                       hover:shadow-elevation-2 hover:border-md-outline transition-all duration-medium2 ease-standard cursor-pointer animate-fadeIn"
        >
            {/* Category Color Strip */}
            <div className="h-1" style={{ backgroundColor: cat.color }} />

            {/* Content */}
            <div className="p-4">
                {/* Top Row: Category pill + D-Day */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-sm font-medium text-white"
                            style={{ backgroundColor: cat.color }}
                        >
                            {cat.icon} {cat.name}
                        </span>
                        {isCredit && (
                            <span className="px-2 py-0.5 bg-md-error-container text-md-on-error-container text-label-sm rounded-full font-medium">
                                신용필수
                            </span>
                        )}
                    </div>
                    <span className={`text-label-lg font-medium ${dday.color}`}>
                        {dday.text}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-title-sm text-md-on-surface line-clamp-2 mb-1 group-hover:text-md-primary transition-colors">
                    {policy.title}
                </h3>

                {/* Organization */}
                <p className="text-body-sm text-md-on-surface-variant mb-3">
                    {policy.organization}
                </p>

                {/* Status Badge + End Date */}
                <div className="flex items-center justify-between text-body-sm">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm font-medium ${status.badgeCls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotCls}`} />
                        {status.label}
                    </span>
                    <span className="text-md-on-surface-variant">
                        {endDate || '상시'}
                    </span>
                </div>

                {/* Visa Tags */}
                {(policy.targetVisa || policy.target_visa)?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-md-outline-variant">
                        {(policy.targetVisa || policy.target_visa).slice(0, 3).map(v => (
                            <span key={v} className="px-2 py-0.5 bg-md-primary-container text-md-on-primary-container text-label-sm rounded-full">
                                {v}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-md-outline-variant bg-md-surface-container-lowest">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleBookmark?.(policy.id); }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-md-on-surface/[0.08] ${isBookmarked ? 'text-[#F9AB00]' : 'text-md-on-surface-variant'
                        }`}
                    aria-label={isBookmarked ? '스크랩 해제' : '스크랩'}
                >
                    {isBookmarked ? '★' : '☆'}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onSelect?.(policy); }}
                    className="text-label-lg text-md-primary hover:bg-md-primary/[0.08] px-3 py-1.5 rounded-full transition"
                >
                    자세히 →
                </button>
            </div>
        </article>
    );
}
