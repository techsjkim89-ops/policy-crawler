/**
 * 카테고리 마스터 데이터 (Single Source of Truth)
 * PolicyCard, PolicyTable, CategoryGrid, admin/page.js 등에서 공유
 */

export const CATEGORIES = [
    // 창업·기업
    { id: 'startup', name: '창업지원', icon: '🚀', group: '창업·기업', color: '#EA4335' },
    { id: 'sme', name: '중소기업', icon: '🏭', group: '창업·기업', color: '#FA7B17' },
    { id: 'smallbiz', name: '소상공인', icon: '🏪', group: '창업·기업', color: '#F9AB00' },
    // 고용·인력
    { id: 'employment', name: '취업·일자리', icon: '💼', group: '고용·인력', color: '#1A73E8' },
    { id: 'youth', name: '청년지원', icon: '🎓', group: '고용·인력', color: '#4285F4' },
    { id: 'rnd', name: 'R&D·기술', icon: '🔬', group: '고용·인력', color: '#669DF6' },
    // 생활·복지
    { id: 'housing', name: '주거·정착', icon: '🏠', group: '생활·복지', color: '#34A853' },
    { id: 'medical', name: '의료·건강', icon: '🏥', group: '생활·복지', color: '#0D652D' },
    { id: 'education', name: '교육·훈련', icon: '📚', group: '생활·복지', color: '#188038' },
    { id: 'welfare', name: '복지·돌봄', icon: '🤝', group: '생활·복지', color: '#81C995' },
    // 외국인
    { id: 'visa', name: '비자·체류', icon: '🛂', group: '외국인', color: '#9334E6' },
    { id: 'foreigner', name: '외국인지원', icon: '🌏', group: '외국인', color: '#A142F4' },
    // 금융·세제
    { id: 'finance', name: '정책자금', icon: '💰', group: '금융·세제', color: '#E37400' },
    { id: 'tax', name: '세제·감면', icon: '📋', group: '금융·세제', color: '#B06000' },
    // 기타
    { id: 'export', name: '수출·해외', icon: '✈️', group: '기타', color: '#185ABC' },
];

/** id → 카테고리 메타 빠른 조회 맵 */
export const CATEGORY_MAP = Object.fromEntries(
    CATEGORIES.map(c => [c.id, c])
);

/** 그룹 목록 (순서 보장) */
export const CATEGORY_GROUPS = [...new Set(CATEGORIES.map(c => c.group))];

/** id로 카테고리 조회 (fallback 포함) */
export function getCategoryById(id) {
    return CATEGORY_MAP[id] || { id, name: id, icon: '📄', group: '기타', color: '#5F6368' };
}

/** 상태 뱃지 매핑 */
export const STATUS_MAP = {
    open: { label: '접수중', dotCls: 'bg-md-tertiary', badgeCls: 'bg-[#CEEAD6] text-[#0D652D]' },
    closing: { label: '마감임박', dotCls: 'bg-md-error', badgeCls: 'bg-md-error-container text-md-error' },
    upcoming: { label: '접수예정', dotCls: 'bg-md-primary', badgeCls: 'bg-md-primary-container text-md-on-primary-container' },
    closed: { label: '마감', dotCls: 'bg-md-on-surface-variant', badgeCls: 'bg-md-surface-container-high text-md-on-surface-variant' },
};

export function getStatusMeta(status) {
    return STATUS_MAP[status] || STATUS_MAP.closed;
}
