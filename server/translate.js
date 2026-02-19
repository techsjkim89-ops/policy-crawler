/**
 * 자동 번역 모듈
 * 한국어 정책을 영어/베트남어/태국어로 번역합니다.
 * 
 * 실제 운영 시에는 Google Cloud Translation API 또는 
 * DeepL API 등을 연동하여 사용합니다.
 */

const axios = require('axios');

// 번역 API 설정 (환경변수로 관리)
const TRANSLATION_API = {
    // Google Cloud Translation API
    google: {
        enabled: false,
        apiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
        endpoint: 'https://translation.googleapis.com/language/translate/v2'
    },
    // DeepL API
    deepl: {
        enabled: false,
        apiKey: process.env.DEEPL_API_KEY || '',
        endpoint: 'https://api-free.deepl.com/v2/translate'
    }
};

/**
 * Google Cloud Translation API를 사용한 번역
 */
async function translateWithGoogle(text, targetLang) {
    if (!TRANSLATION_API.google.apiKey) {
        throw new Error('Google Translation API 키가 설정되지 않았습니다.');
    }

    const langMap = { en: 'en', vi: 'vi', th: 'th' };

    try {
        const response = await axios.post(
            `${TRANSLATION_API.google.endpoint}?key=${TRANSLATION_API.google.apiKey}`,
            {
                q: text,
                source: 'ko',
                target: langMap[targetLang],
                format: 'text'
            }
        );

        return response.data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Google 번역 오류:', error.message);
        throw error;
    }
}

/**
 * DeepL API를 사용한 번역
 */
async function translateWithDeepL(text, targetLang) {
    if (!TRANSLATION_API.deepl.apiKey) {
        throw new Error('DeepL API 키가 설정되지 않았습니다.');
    }

    const langMap = { en: 'EN', vi: 'VI', th: 'TH' }; // DeepL은 대문자 사용

    try {
        const response = await axios.post(
            TRANSLATION_API.deepl.endpoint,
            new URLSearchParams({
                auth_key: TRANSLATION_API.deepl.apiKey,
                text: text,
                source_lang: 'KO',
                target_lang: langMap[targetLang]
            })
        );

        return response.data.translations[0].text;
    } catch (error) {
        console.error('DeepL 번역 오류:', error.message);
        throw error;
    }
}

/**
 * 간단한 폴백 번역 (데모용)
 * 실제로는 API 연동이 필요합니다.
 */
function fallbackTranslate(text, targetLang) {
    // 핵심 키워드만 번역하는 간단한 매핑
    const translations = {
        en: {
            '비자': 'Visa',
            '취업': 'Employment',
            '고용': 'Employment',
            '주거': 'Housing',
            '의료': 'Medical',
            '교육': 'Education',
            '지원': 'Support',
            '신청': 'Application',
            '안내': 'Guide',
            '변경': 'Change',
            '외국인': 'Foreigner',
            '근로자': 'Worker',
            '체류': 'Stay',
            '연장': 'Extension',
            '접수': 'Reception',
            '마감': 'Deadline'
        },
        vi: {
            '비자': 'Thị thực',
            '취업': 'Việc làm',
            '고용': 'Tuyển dụng',
            '주거': 'Nhà ở',
            '의료': 'Y tế',
            '교육': 'Giáo dục',
            '지원': 'Hỗ trợ',
            '신청': 'Đăng ký',
            '안내': 'Hướng dẫn',
            '변경': 'Thay đổi',
            '외국인': 'Người nước ngoài',
            '근로자': 'Người lao động',
            '체류': 'Lưu trú',
            '연장': 'Gia hạn',
            '접수': 'Tiếp nhận',
            '마감': 'Hạn chót'
        },
        th: {
            '비자': 'วีซ่า',
            '취업': 'การจ้างงาน',
            '고용': 'การจ้างงาน',
            '주거': 'ที่อยู่อาศัย',
            '의료': 'การแพทย์',
            '교육': 'การศึกษา',
            '지원': 'สนับสนุน',
            '신청': 'สมัคร',
            '안내': 'คู่มือ',
            '변경': 'เปลี่ยนแปลง',
            '외국인': 'ชาวต่างชาติ',
            '근로자': 'คนงาน',
            '체류': 'พำนัก',
            '연장': 'ขยายเวลา',
            '접수': 'รับสมัคร',
            '마감': 'กำหนดเวลา'
        }
    };

    let translated = text;
    const dict = translations[targetLang] || {};

    for (const [korean, foreign] of Object.entries(dict)) {
        translated = translated.replace(new RegExp(korean, 'g'), foreign);
    }

    return translated;
}

/**
 * 텍스트 번역 메인 함수
 * @param {string} text - 번역할 한국어 텍스트
 * @param {string} targetLang - 대상 언어 (en, vi, th)
 * @returns {Promise<string>} - 번역된 텍스트
 */
async function translate(text, targetLang) {
    if (!text || !text.trim()) {
        return '';
    }

    try {
        // Google API가 설정된 경우 사용
        if (TRANSLATION_API.google.enabled && TRANSLATION_API.google.apiKey) {
            return await translateWithGoogle(text, targetLang);
        }

        // DeepL API가 설정된 경우 사용
        if (TRANSLATION_API.deepl.enabled && TRANSLATION_API.deepl.apiKey) {
            return await translateWithDeepL(text, targetLang);
        }

        // 폴백: 간단한 키워드 번역
        return fallbackTranslate(text, targetLang);

    } catch (error) {
        console.error(`번역 실패 (${targetLang}):`, error.message);
        // 오류 시 폴백 번역 사용
        return fallbackTranslate(text, targetLang);
    }
}

/**
 * 정책 데이터 전체 번역
 * @param {Object} policy - 정책 데이터
 * @returns {Promise<Object>} - 번역 필드가 추가된 정책 데이터
 */
async function translatePolicy(policy) {
    console.log(`📝 정책 번역 중: ${policy.title.substring(0, 30)}...`);

    const translations = {
        en: {},
        vi: {},
        th: {}
    };

    for (const lang of ['en', 'vi', 'th']) {
        try {
            translations[lang] = {
                title: await translate(policy.title, lang),
                summary: await translate(policy.summary, lang),
                // content는 길이가 길 수 있으므로 별도 필드로 저장
                content: policy.content ? await translate(policy.content, lang) : ''
            };
        } catch (error) {
            console.error(`${lang} 번역 실패:`, error.message);
            translations[lang] = {
                title: policy.title,
                summary: policy.summary,
                content: policy.content || ''
            };
        }
    }

    return {
        ...policy,
        translations,
        content_en: translations.en.content,
        content_vi: translations.vi.content,
        content_th: translations.th.content,
        translatedAt: new Date().toISOString()
    };
}

module.exports = {
    translate,
    translatePolicy
};
