/**
 * Firebase 데이터 구조 및 더미 데이터
 * 실제 Firebase 연동 시 이 구조로 Firestore에 저장
 */

// Firestore 컬렉션 구조 (JSON)
export const firestoreSchema = {
    // policies 컬렉션
    policies: {
        docId: "auto-generated",
        fields: {
            title: "string - 정책/사업명",
            organization: "string - 소관기관",
            category: "string - 카테고리 (visa, employment, housing, medical, legal, living)",
            status: "string - 상태 (open, closing, upcoming, closed)",
            startDate: "timestamp - 접수 시작일",
            endDate: "timestamp - 접수 마감일",
            targetVisa: "array - 대상 비자 유형 [E-9, E-7, F-2, etc]",
            targetRegion: "array - 대상 지역 [서울, 경기, 부산, etc]",
            summary: "string - 정책 요약",
            content: "string - 상세 내용",
            originalUrl: "string - 원본 공고 URL",
            pdfUrl: "string - PDF 파일 URL (optional)",
            views: "number - 조회수",
            translations: {
                en: { title: "", summary: "" },
                vi: { title: "", summary: "" },
                th: { title: "", summary: "" }
            },
            createdAt: "timestamp",
            updatedAt: "timestamp"
        }
    },

    // users 컬렉션 (스크랩 기능용)
    users: {
        docId: "user-uid",
        fields: {
            email: "string",
            displayName: "string",
            bookmarks: "array - 스크랩한 정책 ID 목록",
            createdAt: "timestamp"
        }
    },

    // categories 컬렉션
    categories: {
        docId: "category-id",
        fields: {
            id: "string",
            name: "string - 한국어 이름",
            nameEn: "string - 영어 이름",
            icon: "string - 아이콘 이모지",
            color: "string - 테마 색상"
        }
    }
};

// 카테고리 데이터
export const categories = [
    { id: 'visa', name: '비자·체류', nameEn: 'Visa', icon: '🛂', color: 'blue' },
    { id: 'employment', name: '취업·고용', nameEn: 'Employment', icon: '💼', color: 'green' },
    { id: 'housing', name: '주거·정착', nameEn: 'Housing', icon: '🏠', color: 'orange' },
    { id: 'medical', name: '의료·건강', nameEn: 'Medical', icon: '🏥', color: 'red' },
    { id: 'legal', name: '법률·권익', nameEn: 'Legal', icon: '⚖️', color: 'purple' },
    { id: 'education', name: '교육·언어', nameEn: 'Education', icon: '📚', color: 'cyan' },
    { id: 'living', name: '생활·복지', nameEn: 'Living', icon: '🤝', color: 'pink' },
    { id: 'business', name: '창업·사업', nameEn: 'Business', icon: '🚀', color: 'yellow' },
];

// 비자 유형
export const visaTypes = [
    { id: 'E-9', name: 'E-9 (비전문취업)' },
    { id: 'E-7', name: 'E-7 (특정활동)' },
    { id: 'E-2', name: 'E-2 (회화지도)' },
    { id: 'F-2', name: 'F-2 (거주)' },
    { id: 'F-4', name: 'F-4 (재외동포)' },
    { id: 'F-5', name: 'F-5 (영주)' },
    { id: 'F-6', name: 'F-6 (결혼이민)' },
    { id: 'D-2', name: 'D-2 (유학)' },
    { id: 'H-2', name: 'H-2 (방문취업)' },
    { id: 'employer', name: '고용주/사업자' },
];

// 지역
export const regions = [
    { id: 'all', name: '전국' },
    { id: 'seoul', name: '서울' },
    { id: 'gyeonggi', name: '경기' },
    { id: 'incheon', name: '인천' },
    { id: 'busan', name: '부산' },
    { id: 'daegu', name: '대구' },
    { id: 'gwangju', name: '광주' },
    { id: 'daejeon', name: '대전' },
    { id: 'ulsan', name: '울산' },
    { id: 'sejong', name: '세종' },
    { id: 'gangwon', name: '강원' },
    { id: 'chungbuk', name: '충북' },
    { id: 'chungnam', name: '충남' },
    { id: 'jeonbuk', name: '전북' },
    { id: 'jeonnam', name: '전남' },
    { id: 'gyeongbuk', name: '경북' },
    { id: 'gyeongnam', name: '경남' },
    { id: 'jeju', name: '제주' },
];

// 더미 정책 데이터 (2025년 1월 이후)
export const policies = [
    // === 2025년 정책들 ===
    {
        id: '101',
        title: '2025년 상반기 외국인근로자 고용허가제 입국 쿼터 배정',
        organization: '고용노동부',
        category: 'employment',
        status: 'closed',
        startDate: '2025-01-10',
        endDate: '2025-02-28',
        targetVisa: ['E-9'],
        targetRegion: ['all'],
        requiresCreditReport: true,
        summary: '2025년 상반기 외국인근로자 입국 쿼터 12만명 배정. 제조업 7만명, 농축산업 3만명, 어업 2만명.',
        content: '고용허가제를 통한 2025년 상반기 외국인근로자 입국 쿼터가 확정되었습니다.',
        originalUrl: 'https://www.eps.go.kr',
        views: 8542,
        translations: {
            en: { title: '2025 H1 EPS Foreign Worker Quota Allocation', summary: '120,000 foreign worker quota allocated for H1 2025.' },
            vi: { title: 'Phân bổ hạn ngạch lao động nước ngoài H1 2025', summary: 'Phân bổ 120.000 hạn ngạch lao động nước ngoài cho H1 2025.' },
            th: { title: 'การจัดสรรโควต้าแรงงานต่างชาติ H1 2025', summary: 'จัดสรรโควต้าแรงงานต่างชาติ 120,000 คนสำหรับ H1 2025' }
        }
    },
    {
        id: '102',
        title: 'E-7-4 숙련기능인력 비자 점수제 개편 안내',
        organization: '법무부 출입국외국인정책본부',
        category: 'visa',
        status: 'closed',
        startDate: '2025-02-01',
        endDate: '2025-03-31',
        targetVisa: ['E-9', 'H-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: 'E-7-4 숙련기능인력 비자 점수제가 개편되었습니다. 한국어능력, 근속기간, 자격증 가점 항목이 조정됩니다.',
        content: '숙련기능인력 비자(E-7-4)는 E-9 또는 H-2 비자로 4년 이상 근무한 외국인이 전환할 수 있는 비자입니다.',
        originalUrl: 'https://www.immigration.go.kr',
        views: 6721,
        translations: {
            en: { title: 'E-7-4 Skilled Worker Visa Point System Reform', summary: 'E-7-4 visa point system reformed with adjusted criteria.' },
            vi: { title: 'Cải cách hệ thống điểm visa E-7-4', summary: 'Hệ thống điểm visa E-7-4 được cải cách.' },
            th: { title: 'การปฏิรูประบบคะแนนวีซ่า E-7-4', summary: 'ระบบคะแนนวีซ่า E-7-4 ได้รับการปฏิรูป' }
        }
    },
    {
        id: '103',
        title: '외국인 유학생 아르바이트 시간 확대 시행',
        organization: '법무부',
        category: 'employment',
        status: 'closed',
        startDate: '2025-03-01',
        endDate: '2025-03-31',
        targetVisa: ['D-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: 'D-2 유학생의 아르바이트 허용 시간이 주 25시간에서 30시간으로 확대됩니다.',
        content: '인력난 해소 및 유학생 생활 안정을 위해 아르바이트 허용 시간이 확대됩니다.',
        originalUrl: 'https://www.immigration.go.kr',
        views: 4523,
        translations: {
            en: { title: 'Expanded Part-time Work Hours for International Students', summary: 'D-2 student part-time work hours expanded from 25 to 30 hours per week.' },
            vi: { title: 'Mở rộng giờ làm thêm cho sinh viên quốc tế', summary: 'Giờ làm thêm của sinh viên D-2 mở rộng từ 25 lên 30 giờ/tuần.' },
            th: { title: 'ขยายเวลาทำงานพาร์ทไทม์สำหรับนักศึกษาต่างชาติ', summary: 'เวลาทำงานพาร์ทไทม์ของนักศึกษา D-2 ขยายจาก 25 เป็น 30 ชั่วโมงต่อสัปดาห์' }
        }
    },
    {
        id: '104',
        title: '2025년 다문화가족 정착지원금 신청',
        organization: '여성가족부',
        category: 'living',
        status: 'closed',
        startDate: '2025-04-01',
        endDate: '2025-05-31',
        targetVisa: ['F-6'],
        targetRegion: ['all'],
        requiresCreditReport: true,
        summary: '결혼이민자 가정에 최대 300만원의 정착지원금을 지급합니다. 소득 기준 및 체류 기간 요건 확인 필요.',
        content: '다문화가족의 안정적인 정착을 위한 경제적 지원 사업입니다.',
        originalUrl: 'https://www.mogef.go.kr',
        views: 3245,
        translations: {
            en: { title: '2025 Multicultural Family Settlement Support Fund', summary: 'Up to 3 million won settlement support for marriage migrant families.' },
            vi: { title: 'Quỹ hỗ trợ định cư gia đình đa văn hóa 2025', summary: 'Hỗ trợ tới 3 triệu won cho gia đình di cư kết hôn.' },
            th: { title: 'กองทุนสนับสนุนการตั้งถิ่นฐานครอบครัวพหุวัฒนธรรม 2025', summary: 'สนับสนุนสูงสุด 3 ล้านวอนสำหรับครอบครัวผู้อพยพแต่งงาน' }
        }
    },
    {
        id: '105',
        title: '외국인 건강보험 의무가입 면제 대상 확대',
        organization: '보건복지부',
        category: 'medical',
        status: 'closed',
        startDate: '2025-05-01',
        endDate: '2025-06-30',
        targetVisa: ['D-2', 'D-4'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '단기 체류 외국인 중 본국 보험이 있는 경우 건강보험 의무가입 면제 신청이 가능합니다.',
        content: '외국인 건강보험 가입 부담 경감을 위한 면제 대상이 확대됩니다.',
        originalUrl: 'https://www.mohw.go.kr',
        views: 5678,
        translations: {
            en: { title: 'Expanded Health Insurance Exemption for Foreigners', summary: 'Short-term foreign residents with home country insurance can apply for exemption.' },
            vi: { title: 'Mở rộng miễn bảo hiểm y tế cho người nước ngoài', summary: 'Người nước ngoài lưu trú ngắn hạn có bảo hiểm từ nước nhà có thể xin miễn.' },
            th: { title: 'ขยายการยกเว้นประกันสุขภาพสำหรับชาวต่างชาติ', summary: 'ชาวต่างชาติพำนักระยะสั้นที่มีประกันจากประเทศต้นทางสามารถขอยกเว้นได้' }
        }
    },
    {
        id: '106',
        title: '경기도 외국인 근로자 기숙사 지원사업',
        organization: '경기도청',
        category: 'housing',
        status: 'closed',
        startDate: '2025-06-01',
        endDate: '2025-07-31',
        targetVisa: ['E-9', 'H-2'],
        targetRegion: ['gyeonggi'],
        requiresCreditReport: true,
        summary: '경기도 소재 사업장 외국인 근로자에게 월 20만원의 주거비를 지원합니다.',
        content: '열악한 주거환경 개선을 위해 경기도에서 주거비 지원 사업을 시행합니다.',
        originalUrl: 'https://www.gg.go.kr',
        views: 2345,
        translations: {
            en: { title: 'Gyeonggi Province Foreign Worker Housing Support', summary: '200,000 won monthly housing support for foreign workers in Gyeonggi.' },
            vi: { title: 'Hỗ trợ nhà ở cho lao động nước ngoài tỉnh Gyeonggi', summary: 'Hỗ trợ 200.000 won/tháng cho lao động nước ngoài tại Gyeonggi.' },
            th: { title: 'สนับสนุนที่พักอาศัยแรงงานต่างชาติจังหวัดคยองกี', summary: 'สนับสนุน 200,000 วอนต่อเดือนสำหรับแรงงานต่างชาติในคยองกี' }
        }
    },
    {
        id: '107',
        title: '2025년 하반기 사회통합프로그램 (KIIP) 수강생 모집',
        organization: '법무부',
        category: 'education',
        status: 'closed',
        startDate: '2025-07-01',
        endDate: '2025-08-15',
        targetVisa: ['E-9', 'F-2', 'F-6'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: 'F-2 거주비자 신청을 위한 사회통합프로그램 수강생을 모집합니다. 무료 한국어 및 사회 교육.',
        content: '사회통합프로그램(KIIP)은 이민자의 한국 사회 적응을 돕는 무료 교육 프로그램입니다.',
        originalUrl: 'https://www.socinet.go.kr',
        views: 4123,
        translations: {
            en: { title: '2025 H2 KIIP (Social Integration Program) Recruitment', summary: 'Free Korean language and social education for F-2 visa applicants.' },
            vi: { title: 'Tuyển sinh KIIP (Chương trình hội nhập xã hội) H2 2025', summary: 'Giáo dục tiếng Hàn và xã hội miễn phí cho người xin visa F-2.' },
            th: { title: 'รับสมัคร KIIP (โปรแกรมบูรณาการทางสังคม) H2 2025', summary: 'การศึกษาภาษาเกาหลีและสังคมฟรีสำหรับผู้สมัครวีซ่า F-2' }
        }
    },
    {
        id: '108',
        title: '외국인 투자기업 채용박람회',
        organization: '대한무역투자진흥공사(KOTRA)',
        category: 'employment',
        status: 'closed',
        startDate: '2025-09-01',
        endDate: '2025-09-30',
        targetVisa: ['E-7', 'F-2', 'F-4'],
        targetRegion: ['seoul'],
        summary: '외국인 투자기업 50개사가 참여하는 채용박람회가 개최됩니다. E-7 비자 스폰 기업 다수 참여.',
        content: '서울 코엑스에서 개최되는 외국인 대상 채용박람회입니다.',
        originalUrl: 'https://www.kotra.or.kr',
        views: 3567,
        translations: {
            en: { title: 'Foreign Investment Company Job Fair', summary: '50 foreign investment companies participating, many E-7 visa sponsors.' },
            vi: { title: 'Hội chợ việc làm công ty đầu tư nước ngoài', summary: '50 công ty đầu tư nước ngoài tham gia, nhiều nhà tài trợ visa E-7.' },
            th: { title: 'งานแสดงสินค้าบริษัทลงทุนต่างชาติ', summary: 'บริษัทลงทุนต่างชาติ 50 แห่งเข้าร่วม มีผู้สนับสนุนวีซ่า E-7 มากมาย' }
        }
    },
    {
        id: '109',
        title: '2025년 외국인 창업비자(D-8) 요건 완화',
        organization: '중소벤처기업부',
        category: 'business',
        status: 'closed',
        startDate: '2025-10-01',
        endDate: '2025-11-30',
        targetVisa: ['D-2', 'E-7'],
        targetRegion: ['all'],
        summary: 'D-8 창업비자 신청 시 필요한 최소 투자금이 1억원에서 5천만원으로 완화됩니다.',
        content: '외국인 창업 활성화를 위해 D-8 비자 요건이 대폭 완화됩니다.',
        originalUrl: 'https://www.k-startup.go.kr',
        views: 2890,
        translations: {
            en: { title: '2025 D-8 Startup Visa Requirements Relaxed', summary: 'Minimum investment for D-8 visa reduced from 100M to 50M won.' },
            vi: { title: 'Yêu cầu visa khởi nghiệp D-8 2025 được nới lỏng', summary: 'Đầu tư tối thiểu giảm từ 100 triệu xuống 50 triệu won.' },
            th: { title: 'ข้อกำหนดวีซ่าสตาร์ทอัพ D-8 ปี 2025 ผ่อนคลาย', summary: 'การลงทุนขั้นต่ำลดจาก 100 ล้านเป็น 50 ล้านวอน' }
        }
    },
    {
        id: '110',
        title: '전국 외국인 지원센터 확대 운영',
        organization: '법무부',
        category: 'living',
        status: 'closed',
        startDate: '2025-11-01',
        endDate: '2025-12-31',
        targetVisa: ['E-9', 'F-6', 'all'],
        targetRegion: ['all'],
        summary: '전국 외국인 지원센터가 17개에서 25개로 확대됩니다. 통역, 상담, 민원 서비스 제공.',
        content: '외국인 주민 편의 증진을 위해 지원센터가 확대 운영됩니다.',
        originalUrl: 'https://www.immigration.go.kr',
        views: 1987,
        translations: {
            en: { title: 'National Foreign Resident Support Centers Expansion', summary: 'Support centers expanding from 17 to 25 nationwide.' },
            vi: { title: 'Mở rộng trung tâm hỗ trợ người nước ngoài toàn quốc', summary: 'Trung tâm hỗ trợ mở rộng từ 17 lên 25 trên toàn quốc.' },
            th: { title: 'ขยายศูนย์สนับสนุนชาวต่างชาติทั่วประเทศ', summary: 'ศูนย์สนับสนุนขยายจาก 17 เป็น 25 แห่งทั่วประเทศ' }
        }
    },
    // === 2026년 정책들 ===
    {
        id: '1',
        title: '2026년 외국인근로자 고용허가제 신규 입국자 모집',
        organization: '고용노동부',
        category: 'employment',
        status: 'open',
        startDate: '2026-01-15',
        endDate: '2026-02-28',
        targetVisa: ['E-9'],
        targetRegion: ['all'],
        requiresCreditReport: true,
        summary: '2026년 외국인근로자 고용허가제를 통한 신규 입국자 모집 공고입니다. 제조업, 농축산업, 어업 등 분야별 쿼터가 배정됩니다.',
        content: '고용허가제는 국내 인력을 구하지 못한 중소기업이 합법적으로 외국인근로자를 고용할 수 있도록 하는 제도입니다...',
        originalUrl: 'https://www.eps.go.kr',
        views: 3847,
        translations: {
            en: { title: '2026 Employment Permit System New Worker Recruitment', summary: 'Recruitment notice for new foreign workers through EPS 2026.' },
            vi: { title: 'Tuyển dụng lao động nước ngoài năm 2026', summary: 'Thông báo tuyển dụng lao động nước ngoài thông qua EPS 2026.' },
            th: { title: 'การรับสมัครคนงานต่างชาติปี 2026', summary: 'ประกาศรับสมัครแรงงานต่างชาติผ่าน EPS 2026' }
        }
    },
    {
        id: '2',
        title: 'E-9 비자 체류기간 연장 특례 시행 안내',
        organization: '법무부 출입국외국인정책본부',
        category: 'visa',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: 'E-9 비자 소지자의 체류기간 연장을 위한 특례 조치가 시행됩니다. 최대 4년 10개월까지 체류 가능합니다.',
        content: '이번 특례 조치는 숙련기능인력 확보를 위해 E-9 비자 소지자의 장기 체류를 지원하기 위한 것입니다...',
        originalUrl: 'https://www.immigration.go.kr',
        views: 5621,
        translations: {
            en: { title: 'E-9 Visa Extension Special Measures', summary: 'Special measures for E-9 visa holders to extend their stay up to 4 years and 10 months.' },
            vi: { title: 'Gia hạn visa E-9 đặc biệt', summary: 'Biện pháp đặc biệt cho người có visa E-9 gia hạn lưu trú.' },
            th: { title: 'มาตรการพิเศษขยายวีซ่า E-9', summary: 'มาตรการพิเศษสำหรับผู้ถือวีซ่า E-9 ขยายระยะเวลาพำนัก' }
        }
    },
    {
        id: '3',
        title: '외국인 건강보험 지역가입자 보험료 경감 지원',
        organization: '국민건강보험공단',
        category: 'medical',
        status: 'closing',
        startDate: '2026-01-01',
        endDate: '2026-02-10',
        targetVisa: ['F-2', 'F-4', 'F-5', 'F-6'],
        targetRegion: ['all'],
        requiresCreditReport: true,
        summary: '소득 수준에 따른 건강보험료 경감 혜택을 받을 수 있습니다. 월 소득 기준 최대 50% 감면됩니다.',
        content: '2026년부터 저소득 외국인 지역가입자를 대상으로 건강보험료 경감 지원이 확대됩니다...',
        originalUrl: 'https://www.nhis.or.kr',
        views: 2134,
        translations: {
            en: { title: 'Health Insurance Premium Reduction for Foreigners', summary: 'Support for reducing health insurance premiums based on income level.' },
            vi: { title: 'Giảm phí bảo hiểm y tế cho người nước ngoài', summary: 'Hỗ trợ giảm phí bảo hiểm y tế theo mức thu nhập.' },
            th: { title: 'ลดเบี้ยประกันสุขภาพสำหรับชาวต่างชาติ', summary: 'สนับสนุนการลดเบี้ยประกันสุขภาพตามระดับรายได้' }
        }
    },
    {
        id: '4',
        title: '서울시 외국인 임대주택 입주자 모집',
        organization: '서울주택도시공사(SH)',
        category: 'housing',
        status: 'upcoming',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        targetVisa: ['E-9', 'E-7', 'D-2', 'F-2'],
        targetRegion: ['seoul'],
        requiresCreditReport: true,
        summary: '서울시 소재 외국인 전용 공공임대주택 입주자를 모집합니다. 시세 대비 80% 수준의 저렴한 임대료로 거주 가능합니다.',
        content: '서울주택도시공사에서는 외국인 근로자와 유학생의 주거안정을 위해 전용 임대주택을 공급합니다...',
        originalUrl: 'https://www.i-sh.co.kr',
        views: 1876,
        translations: {
            en: { title: 'Seoul Foreign Resident Housing Recruitment', summary: 'Recruitment for public rental housing for foreigners in Seoul.' },
            vi: { title: 'Tuyển người thuê nhà công cộng cho người nước ngoài tại Seoul', summary: 'Tuyển người thuê nhà công cộng cho người nước ngoài tại Seoul.' },
            th: { title: 'รับสมัครผู้เช่าบ้านสาธารณะสำหรับชาวต่างชาติในโซล', summary: 'รับสมัครผู้เช่าบ้านสาธารณะสำหรับชาวต่างชาติในโซล' }
        }
    },
    {
        id: '5',
        title: '다문화가족 무료 법률상담 서비스',
        organization: '법률구조공단',
        category: 'legal',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['F-6'],
        targetRegion: ['all'],
        summary: '결혼이민자 및 다문화가족을 위한 무료 법률 상담 서비스입니다. 이혼, 양육권, 체류 문제 등 상담 가능합니다.',
        content: '대한법률구조공단에서는 다문화가족의 법률 문제 해결을 지원하기 위해 무료 상담 서비스를 제공합니다...',
        originalUrl: 'https://www.klac.or.kr',
        views: 987,
        translations: {
            en: { title: 'Free Legal Consultation for Multicultural Families', summary: 'Free legal counseling for marriage migrants and multicultural families.' },
            vi: { title: 'Tư vấn pháp luật miễn phí cho gia đình đa văn hóa', summary: 'Tư vấn pháp luật miễn phí cho người di cư kết hôn và gia đình đa văn hóa.' },
            th: { title: 'บริการปรึกษากฎหมายฟรีสำหรับครอบครัวพหุวัฒนธรรม', summary: 'บริการปรึกษากฎหมายฟรีสำหรับผู้อพยพแต่งงานและครอบครัวพหุวัฒนธรรม' }
        }
    },
    {
        id: '6',
        title: '외국인 근로자 한국어교육 지원사업',
        organization: '고용노동부',
        category: 'education',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-06-30',
        targetVisa: ['E-9', 'H-2'],
        targetRegion: ['all'],
        summary: '외국인 근로자를 위한 무료 한국어 교육 프로그램입니다. 주말반, 야간반 운영으로 근무 중에도 수강 가능합니다.',
        content: '고용허가제 외국인근로자의 한국 생활 적응을 돕기 위한 맞춤형 한국어 교육을 제공합니다...',
        originalUrl: 'https://www.hrd.go.kr',
        views: 2543,
        translations: {
            en: { title: 'Korean Language Education Support for Foreign Workers', summary: 'Free Korean language program for foreign workers with weekend and evening classes.' },
            vi: { title: 'Hỗ trợ học tiếng Hàn cho lao động nước ngoài', summary: 'Chương trình học tiếng Hàn miễn phí cho lao động nước ngoài.' },
            th: { title: 'สนับสนุนการเรียนภาษาเกาหลีสำหรับแรงงานต่างชาติ', summary: 'โปรแกรมเรียนภาษาเกาหลีฟรีสำหรับแรงงานต่างชาติ' }
        }
    },
    {
        id: '7',
        title: 'F-2 점수제 거주비자 신규 신청 안내',
        organization: '법무부 출입국외국인정책본부',
        category: 'visa',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['E-7', 'E-9'],
        targetRegion: ['all'],
        summary: 'F-2 점수제 거주비자로 전환하여 자유로운 취업활동이 가능합니다. 학력, 한국어능력, 연봉 등으로 점수 산정됩니다.',
        content: '점수제 거주(F-2-7) 비자는 특정 점수 이상을 획득한 외국인에게 거주 자격을 부여하는 제도입니다...',
        originalUrl: 'https://www.immigration.go.kr',
        views: 4215,
        translations: {
            en: { title: 'F-2 Point-based Residence Visa Application Guide', summary: 'Convert to F-2 visa for free employment. Points based on education, Korean ability, and salary.' },
            vi: { title: 'Hướng dẫn đăng ký visa F-2 theo điểm', summary: 'Chuyển đổi sang visa F-2 để làm việc tự do. Điểm dựa trên học vấn, tiếng Hàn và lương.' },
            th: { title: 'คู่มือสมัครวีซ่า F-2 ตามคะแนน', summary: 'เปลี่ยนเป็นวีซ่า F-2 เพื่อทำงานอิสระ คะแนนจากการศึกษา ความสามารถภาษาเกาหลี และเงินเดือน' }
        }
    },
    {
        id: '8',
        title: '외국인 창업지원 프로그램 (스타트업 비자)',
        organization: '중소벤처기업부',
        category: 'business',
        status: 'closing',
        startDate: '2026-01-15',
        endDate: '2026-02-08',
        targetVisa: ['D-2', 'E-7'],
        targetRegion: ['seoul', 'gyeonggi', 'busan'],
        summary: '혁신적 아이디어를 가진 외국인의 국내 창업을 지원합니다. D-8 비자 발급 및 사무공간, 멘토링 지원됩니다.',
        content: '혁신 창업을 꿈꾸는 외국인을 위한 종합 지원 프로그램입니다. 비자 발급, 초기 자금, 사무공간 등을 지원합니다...',
        originalUrl: 'https://www.k-startup.go.kr',
        views: 1532,
        translations: {
            en: { title: 'Foreign Entrepreneur Support Program (Startup Visa)', summary: 'Support for foreigners with innovative ideas to start businesses in Korea. D-8 visa and mentoring provided.' },
            vi: { title: 'Chương trình hỗ trợ khởi nghiệp cho người nước ngoài', summary: 'Hỗ trợ người nước ngoài có ý tưởng sáng tạo khởi nghiệp tại Hàn Quốc.' },
            th: { title: 'โปรแกรมสนับสนุนผู้ประกอบการต่างชาติ', summary: 'สนับสนุนชาวต่างชาติที่มีไอเดียสร้างสรรค์เริ่มต้นธุรกิจในเกาหลี' }
        }
    },
    {
        id: '9',
        title: '2026년 재외동포(F-4) 비자 발급 요건 완화',
        organization: '법무부',
        category: 'visa',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        targetVisa: ['F-4'],
        targetRegion: ['all'],
        summary: '재외동포 비자 발급 시 학력 및 경력 요건이 완화됩니다. 만 25세 이상 동포 대상.',
        content: 'F-4 비자는 재외동포에게 국내 자유로운 취업과 거주를 허용하는 비자입니다.',
        originalUrl: 'https://www.immigration.go.kr',
        views: 3421,
        translations: {
            en: { title: '2026 F-4 Overseas Korean Visa Requirements Relaxed', summary: 'Education and career requirements relaxed for overseas Koreans aged 25+.' },
            vi: { title: 'Yêu cầu visa F-4 Hàn kiều 2026 được nới lỏng', summary: 'Yêu cầu học vấn và nghề nghiệp được nới lỏng cho Hàn kiều từ 25 tuổi.' },
            th: { title: 'ข้อกำหนดวีซ่า F-4 ชาวเกาหลีโพ้นทะเล 2026 ผ่อนคลาย', summary: 'ข้อกำหนดการศึกษาและอาชีพผ่อนคลายสำหรับชาวเกาหลีโพ้นทะเลอายุ 25+' }
        }
    },
    {
        id: '10',
        title: '부산시 외국인 주민 취업박람회',
        organization: '부산광역시',
        category: 'employment',
        status: 'upcoming',
        startDate: '2026-04-10',
        endDate: '2026-04-12',
        targetVisa: ['E-9', 'E-7', 'F-2', 'F-4', 'H-2'],
        targetRegion: ['busan'],
        summary: '부산 지역 외국인 주민을 위한 취업박람회가 개최됩니다. 100개 이상 기업 참여, 현장 면접 가능.',
        content: '부산시에서 외국인 주민의 취업 기회 확대를 위해 대규모 채용박람회를 개최합니다.',
        originalUrl: 'https://www.busan.go.kr',
        views: 1234,
        translations: {
            en: { title: 'Busan Foreign Residents Job Fair', summary: 'Job fair for foreign residents in Busan. 100+ companies, on-site interviews.' },
            vi: { title: 'Hội chợ việc làm cho cư dân nước ngoài Busan', summary: 'Hội chợ việc làm cho cư dân nước ngoài tại Busan. 100+ công ty, phỏng vấn tại chỗ.' },
            th: { title: 'งานแสดงสินค้าผู้อยู่อาศัยต่างชาติปูซาน', summary: 'งานแสดงสินค้าสำหรับผู้อยู่อาศัยต่างชาติในปูซาน บริษัท 100+ สัมภาษณ์ในสถานที่' }
        }
    },
    // === 2026년 추가 정책 (부족 분야 보완) ===
    {
        id: '11',
        title: 'LH 외국인근로자 전용 행복주택 입주자 모집',
        organization: 'LH한국토지주택공사',
        category: 'housing',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-03-15',
        targetVisa: ['E-9', 'H-2', 'E-7'],
        targetRegion: ['gyeonggi', 'incheon'],
        requiresCreditReport: true,
        summary: '경기·인천 지역 외국인근로자 전용 행복주택 300세대 입주자를 모집합니다. 시세의 60~80% 수준 임대료.',
        content: 'LH공사에서 외국인근로자의 주거안정을 위해 전용 행복주택을 공급합니다.',
        originalUrl: 'https://www.lh.or.kr',
        views: 2890,
    },
    {
        id: '12',
        title: '2026년 외국인 직업훈련 바우처 지원사업',
        organization: '고용노동부',
        category: 'education',
        status: 'open',
        startDate: '2026-01-15',
        endDate: '2026-06-30',
        targetVisa: ['E-9', 'H-2', 'F-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '외국인근로자 대상 직업훈련 바우처 100만원을 지원합니다. 기술자격 취득, 한국어 능력 향상 과정 포함.',
        content: 'HRD-Net을 통해 직업훈련 기관을 선택하여 수강할 수 있습니다.',
        originalUrl: 'https://www.hrd.go.kr',
        views: 1567,
    },
    {
        id: '13',
        title: '외국인 사업자 세액공제 확대 안내',
        organization: '국세청',
        category: 'legal',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['D-8', 'F-2', 'F-5'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '외국인 사업자의 연구개발비, 설비투자 세액공제율이 최대 30%까지 확대됩니다.',
        content: '중소기업 및 스타트업을 운영하는 외국인 사업자를 위한 세제 혜택 안내입니다.',
        originalUrl: 'https://www.nts.go.kr',
        views: 1123,
    },
    {
        id: '14',
        title: '다문화가족 한국생활 적응 교육 프로그램',
        organization: '다문화가족지원포털',
        category: 'education',
        status: 'open',
        startDate: '2026-02-10',
        endDate: '2026-08-31',
        targetVisa: ['F-6', 'F-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '결혼이민자 대상 한국생활 적응교육 무료 프로그램. 한국어, 문화, 육아, 취업 과정 포함.',
        content: '전국 다문화가족지원센터에서 운영하는 무료 교육 프로그램입니다.',
        originalUrl: 'https://www.liveinkorea.kr',
        views: 2341,
    },
    {
        id: '15',
        title: '2026년 마이홈 공공임대주택 외국인 특별공급',
        organization: '마이홈포털',
        category: 'housing',
        status: 'upcoming',
        startDate: '2026-04-01',
        endDate: '2026-04-30',
        targetVisa: ['E-9', 'E-7', 'F-2', 'F-6'],
        targetRegion: ['seoul', 'gyeonggi', 'busan', 'daegu'],
        requiresCreditReport: true,
        summary: '외국인 특별공급 물량 500세대. 보증금 없이 월세만으로 입주 가능한 공공임대주택.',
        content: '마이홈포털에서 공공임대주택 정보와 신청 절차를 확인할 수 있습니다.',
        originalUrl: 'https://www.myhome.go.kr',
        views: 987,
    },
    {
        id: '16',
        title: '외국인 체류자격 변경 수수료 감면 안내',
        organization: '법무부 출입국외국인정책본부',
        category: 'visa',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9', 'E-7', 'D-2', 'H-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: 'E-9에서 E-7, D-2에서 E-7 등 체류자격 변경 시 수수료가 50% 감면됩니다.',
        content: '외국인의 체류자격 변경을 장려하기 위한 수수료 감면 안내입니다.',
        originalUrl: 'https://www.immigration.go.kr',
        views: 3287,
    },
    {
        id: '17',
        title: '청년 외국인 인턴십 매칭 프로그램',
        organization: '대한무역투자진흥공사(KOTRA)',
        category: 'employment',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-05-31',
        targetVisa: ['D-2', 'E-7'],
        targetRegion: ['seoul', 'busan'],
        requiresCreditReport: false,
        summary: '한국 내 글로벌 기업에서 인턴 경험을 쌓을 수 있는 프로그램. 월 생활비 150만원 지원.',
        content: 'KOTRA와 협력 기업이 함께 운영하는 외국인 청년 인턴십 프로그램입니다.',
        originalUrl: 'https://www.kotra.or.kr',
        views: 4521,
    },
    {
        id: '18',
        title: '이주민 긴급 의료비 지원 사업',
        organization: '보건복지부',
        category: 'medical',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9', 'H-2', 'F-6'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '건강보험 미가입 외국인의 긴급 의료비를 최대 500만원까지 지원합니다.',
        content: '산업재해, 응급상황 등 긴급 의료 서비스가 필요한 이주민을 위한 지원 사업입니다.',
        originalUrl: 'https://www.mohw.go.kr',
        views: 1876,
    },
    {
        id: '19',
        title: '2026년 소상공인 외국인 고용 지원금',
        organization: '소상공인시장진흥공단',
        category: 'business',
        status: 'closing',
        startDate: '2026-01-10',
        endDate: '2026-02-20',
        targetVisa: ['employer'],
        targetRegion: ['all'],
        requiresCreditReport: true,
        summary: '외국인 근로자를 고용하는 소상공인에게 월 30만원의 고용지원금을 지급합니다. 최대 12개월.',
        content: '인력난을 겪는 소상공인의 외국인 고용 부담을 줄이기 위한 지원 사업입니다.',
        originalUrl: 'https://www.semas.or.kr',
        views: 2134,
    },
    {
        id: '20',
        title: '외국인 근로자 산업안전 교육 의무화',
        organization: '고용노동부',
        category: 'employment',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9', 'H-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '외국인 근로자 대상 모국어 산업안전 교육이 의무화됩니다. 16개 언어로 교육 자료 제공.',
        content: '산업현장 안전사고 예방을 위한 외국인근로자 안전교육 의무화 안내입니다.',
        originalUrl: 'https://www.moel.go.kr',
        views: 3456,
    },
    {
        id: '21',
        title: '외국인 기술창업 TIPS 프로그램',
        organization: '중소벤처기업부',
        category: 'business',
        status: 'open',
        startDate: '2026-01-20',
        endDate: '2026-04-30',
        targetVisa: ['D-8', 'E-7', 'F-2'],
        targetRegion: ['seoul', 'gyeonggi'],
        requiresCreditReport: false,
        summary: '혁신 기술 보유 외국인 창업가에게 최대 5억원의 R&D 자금과 멘토링을 지원합니다.',
        content: 'TIPS(Tech Incubator Program for Startup)를 통한 외국인 기술창업 지원 프로그램입니다.',
        originalUrl: 'https://www.k-startup.go.kr',
        views: 3789,
    },
    {
        id: '22',
        title: '2026년 사회통합프로그램(KIIP) 상반기 모집',
        organization: '법무부',
        category: 'education',
        status: 'open',
        startDate: '2026-02-01',
        endDate: '2026-03-31',
        targetVisa: ['E-9', 'F-2', 'F-6', 'H-2'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '영주·귀화 신청을 위한 사회통합프로그램 수강생 모집. 한국어 및 한국사회 이해 과정.',
        content: '사회통합프로그램은 이민자의 한국 사회 적응을 돕는 필수 교육 과정입니다.',
        originalUrl: 'https://www.socinet.go.kr',
        views: 5123,
    },
    {
        id: '23',
        title: '외국인 전세사기 피해 긴급 주거지원',
        organization: '국토교통부',
        category: 'housing',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9', 'E-7', 'F-2', 'F-4', 'F-6'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '전세사기 피해 외국인에게 긴급 주거공간과 법률상담을 무료 제공합니다.',
        content: '전세사기 피해 외국인을 위한 긴급 주거지원 및 법률구조 사업입니다.',
        originalUrl: 'https://www.molit.go.kr',
        views: 2678,
    },
    {
        id: '24',
        title: '외국인 가사도우미 비자(E-9-5) 시범사업',
        organization: '법무부',
        category: 'visa',
        status: 'upcoming',
        startDate: '2026-05-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9'],
        targetRegion: ['seoul'],
        requiresCreditReport: false,
        summary: '서울 지역 외국인 가사도우미 시범사업이 시행됩니다. 필리핀 등 6개국 대상.',
        content: '외국인 가사도우미 비자(E-9-5) 시범사업을 통해 맞벌이 가정의 돌봄 부담을 줄이는 정책입니다.',
        originalUrl: 'https://www.immigration.go.kr',
        views: 6789,
    },
    {
        id: '25',
        title: '2026년 외국인 근로자 퇴직금 정산 제도 개선',
        organization: '고용노동부',
        category: 'employment',
        status: 'open',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        targetVisa: ['E-9', 'H-2', 'E-7'],
        targetRegion: ['all'],
        requiresCreditReport: false,
        summary: '외국인 근로자의 퇴직금 정산이 출국 전 신속 처리됩니다. 은행 계좌 대리 개설 지원.',
        content: '그동안 퇴직금 수령이 어려웠던 외국인 근로자를 위한 제도 개선 안내입니다.',
        originalUrl: 'https://www.moel.go.kr',
        views: 4321,
    }
];

// 상태별 배지 정보
export const statusBadges = {
    open: { label: '접수중', color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' },
    closing: { label: '마감임박', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
    upcoming: { label: '접수예정', color: 'bg-gray-100 text-gray-600', dotColor: 'bg-gray-400' },
    closed: { label: '마감', color: 'bg-slate-100 text-slate-500', dotColor: 'bg-slate-400' }
};

// D-Day 계산
export function calculateDDay(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { text: '마감', urgent: false };
    if (diff === 0) return { text: 'D-Day', urgent: true };
    if (diff <= 7) return { text: `D-${diff}`, urgent: true };
    return { text: `D-${diff}`, urgent: false };
}

// 조회수 포맷
export function formatViews(views) {
    if (views >= 10000) return `${(views / 10000).toFixed(1)}만`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}천`;
    return views.toString();
}
