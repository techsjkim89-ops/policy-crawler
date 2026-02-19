/**
 * 신용평가등급확인서 필수 여부 감지 모듈
 * =========================================
 * 공고문 텍스트에서 신용평가 관련 키워드를 추출하여
 * is_credit_required 값을 자동으로 판별
 */

// 신용평가 필수 키워드 목록
const CREDIT_REQUIRED_KEYWORDS = [
    // 직접적인 신용평가 언급
    '신용평가등급확인서',
    '신용등급확인서',
    '신용평가서',
    '신용등급 확인서',
    '신용평가 등급',
    '신용등급증명',
    '신용정보조회',

    // 신용관련 요건
    '신용등급 제출',
    '신용평가 제출',
    '신용등급이 필요',
    '신용조회 동의',
    '신용정보 제공',
    '신용평가 필수',
    '신용등급 필수',

    // 특정 등급 요건
    '신용등급 7등급',
    '신용등급 6등급',
    '신용등급 5등급',
    '신용평가등급',

    // 금융 관련 (대출형 지원사업)
    '대출 심사',
    '금융 심사',
    '신용조회',
    '개인신용정보',

    // 보증 관련
    '신용보증서',
    '신용보증기금',
    '기술보증기금',
    '보증서 발급',

    // 나이스, KCB 등 신용평가기관
    '나이스평가정보',
    'NICE평가',
    'KCB',
    '코리아크레딧뷰로',
    '올크레딧'
];

// 신용평가 무관 키워드 (이 키워드가 있으면 false)
const CREDIT_NOT_REQUIRED_KEYWORDS = [
    '신용평가 불필요',
    '신용등급 무관',
    '신용조회 없음',
    '신용평가 면제',
    '신용등급 면제'
];

/**
 * 공고문 텍스트에서 신용평가 필수 여부 자동 판별
 * @param {string} text - 공고문 전문 텍스트
 * @param {string} title - 공고 제목
 * @returns {Object} { isRequired: boolean, confidence: string, matchedKeywords: string[] }
 */
function detectCreditRequirement(text, title = '') {
    const fullText = `${title} ${text}`.toLowerCase();

    // 무관 키워드 먼저 확인
    for (const keyword of CREDIT_NOT_REQUIRED_KEYWORDS) {
        if (fullText.includes(keyword.toLowerCase())) {
            return {
                isRequired: false,
                confidence: 'high',
                matchedKeywords: [keyword],
                reason: '신용평가 면제 키워드 발견'
            };
        }
    }

    // 필수 키워드 확인
    const matchedKeywords = [];
    for (const keyword of CREDIT_REQUIRED_KEYWORDS) {
        if (fullText.includes(keyword.toLowerCase())) {
            matchedKeywords.push(keyword);
        }
    }

    if (matchedKeywords.length >= 2) {
        return {
            isRequired: true,
            confidence: 'high',
            matchedKeywords,
            reason: `${matchedKeywords.length}개 신용평가 키워드 발견`
        };
    } else if (matchedKeywords.length === 1) {
        return {
            isRequired: true,
            confidence: 'medium',
            matchedKeywords,
            reason: '1개 신용평가 키워드 발견'
        };
    }

    // 키워드가 없으면 무관으로 판단
    return {
        isRequired: false,
        confidence: 'low',
        matchedKeywords: [],
        reason: '신용평가 관련 키워드 없음'
    };
}

/**
 * 카테고리별 신용평가 필요 확률 추정
 * 특정 카테고리는 신용평가가 필요할 확률이 높음
 */
const CATEGORY_CREDIT_TENDENCY = {
    'business': 0.7,      // 창업/사업 - 높음
    'employment': 0.4,    // 취업/고용 - 중간
    'housing': 0.5,       // 주거/정착 - 중간
    'medical': 0.2,       // 의료/건강 - 낮음
    'education': 0.1,     // 교육/언어 - 낮음
    'legal': 0.2,         // 법률/권익 - 낮음
    'living': 0.3,        // 생활/복지 - 낮음
    'visa': 0.1           // 비자/체류 - 낮음
};

/**
 * 복합 판정 (텍스트 분석 + 카테고리 경향)
 * @param {string} text - 공고문 전문
 * @param {string} title - 제목
 * @param {string} category - 카테고리
 */
function analyzeCreditRequirement(text, title, category) {
    const textAnalysis = detectCreditRequirement(text, title);
    const categoryTendency = CATEGORY_CREDIT_TENDENCY[category] || 0.3;

    // 텍스트 분석 결과가 확실하면 그대로 사용
    if (textAnalysis.confidence === 'high') {
        return textAnalysis;
    }

    // 불확실한 경우 카테고리 경향 참고
    if (textAnalysis.confidence === 'low' && categoryTendency >= 0.5) {
        return {
            ...textAnalysis,
            isRequired: true,
            confidence: 'estimated',
            reason: `카테고리(${category}) 경향 기반 추정`
        };
    }

    return textAnalysis;
}

module.exports = {
    detectCreditRequirement,
    analyzeCreditRequirement,
    CREDIT_REQUIRED_KEYWORDS,
    CREDIT_NOT_REQUIRED_KEYWORDS
};
