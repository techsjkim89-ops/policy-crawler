/**
 * Firestore 데이터 구조 (JSON 스키마 예시)
 * ===================================================
 * 
 * 이 파일은 Firestore 컬렉션 및 문서 구조를 정의합니다.
 * 실제 데이터베이스에서 사용되는 스키마의 참조 문서입니다.
 */

export const firestoreSchema = {
    /**
     * =====================================
     * policies 컬렉션 (정책/공고 데이터)
     * =====================================
     */
    policies: {
        _collectionPath: "policies",
        _documentId: "auto-generated (Firestore UID)",

        // 문서 필드 구조
        fields: {
            // 기본 정보
            title: "string - 정책/공고 제목",
            agency: "string - 소관 기관명 (예: 고용노동부)",
            category: "string - 카테고리 (employment, visa, housing, medical, legal, education, living, business)",

            // 일정 정보
            start_date: "timestamp - 접수/공고 시작일",
            end_date: "timestamp - 접수/공고 마감일",
            status: "string - 상태 (open, closing, upcoming, closed)",

            // 신용평가 관련
            is_credit_required: "boolean - 신용평가등급확인서 필수 여부",

            // 다국어 콘텐츠
            content_ko: "string - 한국어 전문 내용",
            content_en: "string - 영어 번역 내용",
            content_vn: "string - 베트남어 번역 내용",
            summary_ko: "string - 한국어 요약",
            summary_en: "string - 영어 요약",
            summary_vn: "string - 베트남어 요약",

            // 대상 정보
            target_visa: "array<string> - 대상 비자 유형 ['E-9', 'E-7', 'F-2', ...]",
            target_region: "array<string> - 대상 지역 ['all', 'seoul', 'gyeonggi', ...]",

            // 원본 정보
            original_url: "string - 원본 공고문 URL",
            source_site: "string - 출처 사이트 (bizinfo, hikorea, etc)",

            // 메타 정보
            views: "number - 조회수",
            created_at: "timestamp - 문서 생성일",
            updated_at: "timestamp - 문서 수정일",
            crawled_at: "timestamp - 크롤링 수집일"
        }
    },

    /**
     * =====================================
     * users 컬렉션 (사용자 정보)
     * =====================================
     */
    users: {
        _collectionPath: "users",
        _documentId: "Firebase Auth UID",

        fields: {
            email: "string - 이메일",
            display_name: "string - 표시 이름",
            visa_type: "string - 사용자 비자 유형 (선택)",
            region: "string - 사용자 지역 (선택)",
            language: "string - 선호 언어 (ko, en, vn)",
            created_at: "timestamp - 가입일",
            last_login: "timestamp - 마지막 로그인"
        },

        // 서브 컬렉션: 북마크
        subCollections: {
            bookmarks: {
                _collectionPath: "users/{userId}/bookmarks",
                _documentId: "policy ID",
                fields: {
                    policy_id: "string - 정책 문서 ID",
                    policy_title: "string - 정책 제목 (캐싱용)",
                    bookmarked_at: "timestamp - 스크랩 일시"
                }
            }
        }
    },

    /**
     * =====================================
     * crawl_logs 컬렉션 (크롤링 로그)
     * =====================================
     */
    crawl_logs: {
        _collectionPath: "crawl_logs",
        _documentId: "auto-generated",

        fields: {
            site_name: "string - 크롤링 사이트명",
            site_url: "string - 크롤링 URL",
            status: "string - 결과 (success, failure)",
            policies_found: "number - 발견된 정책 수",
            policies_saved: "number - 저장된 정책 수",
            error_message: "string - 오류 메시지 (실패 시)",
            started_at: "timestamp - 시작 시간",
            completed_at: "timestamp - 완료 시간"
        }
    }
};

/**
 * =====================================
 * 샘플 데이터 (JSON 예시)
 * =====================================
 */
export const samplePolicyDocument = {
    // policies 컬렉션의 단일 문서 예시
    id: "policy_2026_001",
    title: "2026년 외국인근로자 고용허가제 신규 입국자 모집",
    agency: "고용노동부",
    category: "employment",

    start_date: "2026-01-15T00:00:00Z",
    end_date: "2026-02-28T23:59:59Z",
    status: "open",

    is_credit_required: true,

    content_ko: "2026년 외국인근로자 고용허가제를 통한 신규 입국자 모집 공고입니다...",
    content_en: "This is a recruitment notice for new foreign workers through the Employment Permit System 2026...",
    content_vn: "Đây là thông báo tuyển dụng lao động nước ngoài thông qua hệ thống giấy phép lao động 2026...",

    summary_ko: "외국인근로자 고용허가제 신규 입국자 모집. 제조업, 농축산업, 어업 분야.",
    summary_en: "EPS new worker recruitment for manufacturing, agriculture, and fishing sectors.",
    summary_vn: "Tuyển dụng lao động mới EPS cho ngành sản xuất, nông nghiệp và thủy sản.",

    target_visa: ["E-9"],
    target_region: ["all"],

    original_url: "https://www.eps.go.kr/notice/12345",
    source_site: "eps",

    views: 3847,
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-01-10T09:00:00Z",
    crawled_at: "2026-01-10T09:00:00Z"
};

export const sampleUserDocument = {
    // users 컬렉션의 단일 문서 예시
    id: "user_abc123",
    email: "worker@example.com",
    display_name: "Nguyen Van",
    visa_type: "E-9",
    region: "gyeonggi",
    language: "vn",
    created_at: "2025-06-15T10:30:00Z",
    last_login: "2026-02-06T08:00:00Z"
};

export const sampleBookmarkDocument = {
    // users/{userId}/bookmarks 서브컬렉션 문서 예시
    policy_id: "policy_2026_001",
    policy_title: "2026년 외국인근로자 고용허가제 신규 입국자 모집",
    bookmarked_at: "2026-02-05T14:30:00Z"
};
