'use client';

/**
 * M3 PolicyTable — Data Table 스타일
 */
import { getCategoryById, getStatusMeta } from '../data/categories';
import { calculateDDay } from '../lib/utils';

export default function PolicyTable({ policies, onRowClick, bookmarks, onBookmark }) {
    if (!policies?.length) {
        return (
            <div className="bg-md-surface-container-low border border-md-outline-variant rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-md-surface-container-high rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📋</span>
                </div>
                <p className="text-title-md text-md-on-surface mb-1">정책 데이터가 없습니다</p>
                <p className="text-body-md text-md-on-surface-variant">검색 조건을 변경해 보세요</p>
            </div>
        );
    }

    return (
        <div className="bg-md-surface-container-low border border-md-outline-variant rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-md-outline-variant">
                            <th className="px-3 py-3 text-left text-label-sm text-md-on-surface-variant font-medium w-8"></th>
                            <th className="px-3 py-3 text-left text-label-sm text-md-on-surface-variant font-medium">정책명</th>
                            <th className="px-3 py-3 text-left text-label-sm text-md-on-surface-variant font-medium whitespace-nowrap">분야</th>
                            <th className="px-3 py-3 text-left text-label-sm text-md-on-surface-variant font-medium hidden md:table-cell">기관</th>
                            <th className="px-3 py-3 text-center text-label-sm text-md-on-surface-variant font-medium whitespace-nowrap">상태</th>
                            <th className="px-3 py-3 text-center text-label-sm text-md-on-surface-variant font-medium whitespace-nowrap">D-Day</th>
                            <th className="px-3 py-3 text-center text-label-sm text-md-on-surface-variant font-medium w-12">신용</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-md-outline-variant">
                        {policies.map((policy, idx) => {
                            const cat = getCategoryById(policy.category);
                            const dday = calculateDDay(policy.endDate || policy.end_date);
                            const status = getStatusMeta(policy.status);
                            const isBookmarked = bookmarks?.includes(policy.id);
                            const isCredit = policy.requiresCreditReport || policy.is_credit_required;

                            return (
                                <tr
                                    key={policy.id || idx}
                                    onClick={() => onRowClick?.(policy)}
                                    className="group hover:bg-md-primary/[0.04] cursor-pointer transition-colors duration-short3"
                                >
                                    {/* Bookmark */}
                                    <td className="px-3 py-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onBookmark?.(policy.id); }}
                                            className={`text-base transition ${isBookmarked ? 'text-[#F9AB00]' : 'text-md-outline opacity-0 group-hover:opacity-100'}`}
                                            aria-label={isBookmarked ? '스크랩 해제' : '스크랩'}
                                        >
                                            {isBookmarked ? '★' : '☆'}
                                        </button>
                                    </td>

                                    {/* Title */}
                                    <td className="px-3 py-3">
                                        <p className="text-body-md text-md-on-surface font-medium line-clamp-1 group-hover:text-md-primary transition-colors">
                                            {policy.title}
                                        </p>
                                    </td>

                                    {/* Category */}
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm text-white whitespace-nowrap"
                                            style={{ backgroundColor: cat.color }}
                                        >
                                            {cat.icon} {cat.name}
                                        </span>
                                    </td>

                                    {/* Organization */}
                                    <td className="px-3 py-3 text-body-sm text-md-on-surface-variant truncate max-w-[150px] hidden md:table-cell">
                                        {policy.organization}
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-medium whitespace-nowrap ${status.badgeCls}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dotCls}`} />
                                            {status.label}
                                        </span>
                                    </td>

                                    {/* D-Day */}
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <span className={`text-label-lg font-medium ${dday.urgent ? 'text-md-error' : 'text-md-primary'}`}>
                                            {dday.text}
                                        </span>
                                    </td>

                                    {/* Credit */}
                                    <td className="px-3 py-3 text-center">
                                        {isCredit ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-md-error text-md-on-error text-label-sm rounded-full font-medium">
                                                필
                                            </span>
                                        ) : (
                                            <span className="text-md-outline">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
