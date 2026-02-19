/**
 * 공용 유틸리티 함수 (Single Source of Truth)
 * page.js, PolicyCard.js, PolicyTable.js 등에서 공유
 */

/**
 * D-Day 계산
 * @param {string|null} endDate - 마감일 (ISO string 또는 YYYY-MM-DD)
 * @returns {{ text: string, urgent: boolean, color: string }}
 */
export function calculateDDay(endDate) {
    if (!endDate) return { text: '상시', urgent: false, color: 'text-md-on-surface-variant' };
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: '마감', urgent: false, color: 'text-md-on-surface-variant' };
    if (diff === 0) return { text: 'D-Day', urgent: true, color: 'text-md-error' };
    if (diff <= 7) return { text: `D-${diff}`, urgent: true, color: 'text-md-error' };
    return { text: `D-${diff}`, urgent: false, color: 'text-md-primary' };
}

/**
 * 날짜 포맷 (한국어)
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

/**
 * 정책 객체에서 필드 추출 (snake_case / camelCase 호환)
 */
export function getPolicyField(policy, camel, snake) {
    return policy[camel] || policy[snake];
}
