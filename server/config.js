/**
 * 크롤링 설정 (확장 버전)
 * - 15개 카테고리 체계
 * - 15개 크롤링 사이트 (서울글로벌센터 비활성화)
 */

module.exports = {
    // 크롤링 주기 설정
    schedule: {
        morning: '0 9 * * *',
        evening: '0 18 * * *',
    },

    // ==================== 카테고리 체계 (15개) ====================
    categories: [
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
    ],

    // ==================== 크롤링 대상 사이트 ====================
    sites: [
        // ---- 기존 사이트 ----
        {
            id: 'bizinfo',
            name: '비즈인포 지원사업',
            url: 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do',
            enabled: true,
            category: 'sme',
            selectors: {
                content: '.view_cont',         // 비즈인포 본문
                attachments: '.btn_file_down'  // 비즈인포 첨부
            }
        },
        {
            id: 'hikorea',
            name: '하이코리아 공지사항',
            url: 'https://www.hikorea.go.kr/board/BoardNtcListR.pt',
            enabled: true,
            category: 'visa',
            selectors: {
                content: '.board_view_cont, .view_cont, #customer_view, .bbs_view', // 하이코리아 본문 후보
                attachments: '.file_list a'
            }
        },
        {
            id: 'eps',
            name: '고용허가제 EPS',
            url: 'https://www.eps.go.kr/eo/NtcDtIntroR.eo?natSe=KR&typCd=1',
            enabled: true,
            category: 'employment',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '한국산업인력공단',
                link: 'td.left a@href',
                baseUrl: 'https://www.eps.go.kr',
                content: '.board_view',
                attachments: '.file_down'
            }
        },
        {
            id: 'moel',
            name: '고용노동부 정책뉴스',
            url: 'https://www.moel.go.kr/news/enews/report/enewsList.do',
            enabled: true,
            category: 'employment',
            selectors: {
                content: '.view_cont',
                attachments: '.file_down'
            }
        },
        {
            id: 'nhis',
            name: '국민건강보험공단',
            url: 'https://www.nhis.or.kr/nhis/together/wbhaea01000m01.do',
            enabled: true,
            category: 'medical',
            selectors: {
                list: '.board-list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '국민건강보험공단',
                link: 'td.left a@href',
                baseUrl: 'https://www.nhis.or.kr'
            }
        },
        {
            id: 'seoul_global',
            name: '서울글로벌센터',
            url: 'https://global.seoul.go.kr',
            enabled: false, // 🔴 URL 404로 비활성화
            category: 'foreigner',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.subject a',
                date: 'td:nth-child(4)',
                organization: '서울글로벌센터',
                link: 'td.subject a@href',
                baseUrl: 'https://global.seoul.go.kr'
            }
        },

        // ---- 신규 사이트 ----
        {
            id: 'k_startup',
            name: 'K-스타트업',
            url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do',
            enabled: true,
            category: 'startup',
            selectors: {
                content: '.view_editor, .board_view, .view_cont, .article_view, #divView, .req_doc', // K-Startup 본문 후보
                attachments: '.file_down'
            }
        },
        {
            id: 'semas',
            name: '소상공인24',
            url: 'https://www.semas.or.kr/web/board/webBoardList.kmdc?bCd=1001',
            enabled: true,
            category: 'smallbiz',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '소상공인시장진흥공단',
                link: 'td.left a@href',
                baseUrl: 'https://www.semas.or.kr'
            }
        },
        {
            id: 'mss',
            name: '중소벤처기업부',
            url: 'https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=86',
            enabled: true,
            category: 'sme',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a:not(.btn_file)', // 파일 첨부 아이콘 제외
                date: 'td:nth-child(4)',
                organization: '중소벤처기업부',
                link: 'td.left a@href',
                baseUrl: 'https://www.mss.go.kr'
            }
        },
        {
            id: 'work24',
            name: '고용24',
            url: 'https://www.work24.go.kr/cm/noticeList.do',
            enabled: true,
            category: 'employment',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '한국고용정보원',
                link: 'td.left a@href',
                baseUrl: 'https://www.work24.go.kr'
            }
        },
        {
            id: 'youthcenter',
            name: '청년정책',
            url: 'https://www.youthcenter.go.kr/youngPlcy/youngPlcyList.do',
            enabled: true,
            category: 'youth',
            selectors: {
                list: '.result-list li',
                title: '.tit-wrap a',
                date: '.date',
                organization: '.org',
                link: '.tit-wrap a@href',
                baseUrl: 'https://www.youthcenter.go.kr'
            }
        },
        {
            id: 'g4b',
            name: '보조금24 (기업)',
            url: 'https://www.g4b.go.kr/svc/anlsSvc/selectAnlsSvcList.do',
            enabled: true,
            category: 'finance',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(5)',
                organization: 'td:nth-child(3)',
                link: 'td.left a@href',
                baseUrl: 'https://www.g4b.go.kr'
            }
        },
        {
            id: 'ntis',
            name: 'NTIS 국가R&D',
            url: 'https://www.ntis.go.kr/thn/pbl/selectPblList.do',
            enabled: true,
            category: 'rnd',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(5)',
                organization: 'td:nth-child(3)',
                link: 'td.left a@href',
                baseUrl: 'https://www.ntis.go.kr'
            }
        },
        {
            id: 'gov_kr',
            name: '정부24 보조금',
            url: 'https://www.gov.kr/portal/rcvfvrSvc/svcFind/svcSearchAll',
            enabled: true,
            category: 'welfare',
            selectors: {
                list: '.result-list li',
                title: '.title a',
                date: '.date',
                organization: '.org',
                link: '.title a@href',
                baseUrl: 'https://www.gov.kr'
            }
        },
        {
            id: 'kotra',
            name: 'KOTRA 수출지원',
            url: 'https://www.kotra.or.kr/kp/common/extra/kbiz/boardList/SPTLIST01.do',
            enabled: true,
            category: 'export',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '대한무역투자진흥공사',
                link: 'td.left a@href',
                baseUrl: 'https://www.kotra.or.kr'
            }
        },

        // ---- 확장 사이트 (부족 분야 보완) ----
        {
            id: 'myhome',
            name: '마이홈 주거복지',
            url: 'https://www.myhome.go.kr/hws/portal/cont/selectContRentalView.do',
            enabled: true,
            category: 'housing',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '마이홈포털',
                link: 'td.left a@href',
                baseUrl: 'https://www.myhome.go.kr'
            }
        },
        {
            id: 'lh',
            name: 'LH 한국토지주택공사',
            url: 'https://www.lh.or.kr/board.es?mid=a10010000000&bid=0001',
            enabled: true,
            category: 'housing',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: 'LH한국토지주택공사',
                link: 'td.left a@href',
                baseUrl: 'https://www.lh.or.kr'
            }
        },
        {
            id: 'hrdnet',
            name: 'HRD-Net 직업훈련',
            url: 'https://www.hrd.go.kr/hrdp/co/pcobo/PCOBO0100P.do',
            enabled: true,
            category: 'education',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '한국고용정보원',
                link: 'td.left a@href',
                baseUrl: 'https://www.hrd.go.kr'
            }
        },
        {
            id: 'nile',
            name: '국가평생교육진흥원',
            url: 'https://www.nile.or.kr/contents/contents.jsp?bkind=report&bcode=HABAAAAe&bmode=list',
            enabled: true,
            category: 'education',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '국가평생교육진흥원',
                link: 'td.left a@href',
                baseUrl: 'https://www.nile.or.kr'
            }
        },
        {
            id: 'nts',
            name: '국세청 세무안내',
            url: 'https://www.nts.go.kr/nts/na/ntt/selectNttList.do?mi=2201&bbsId=1028',
            enabled: true,
            category: 'tax',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '국세청',
                link: 'td.left a@href',
                baseUrl: 'https://www.nts.go.kr'
            }
        },
        {
            id: 'liveinkorea',
            name: '다누리 다문화포털',
            url: 'https://www.liveinkorea.kr/portal/KOR/board/boardList.do?menuSeq=765',
            enabled: true,
            category: 'foreigner',
            selectors: {
                list: '.board_list tbody tr',
                title: 'td.left a',
                date: 'td:nth-child(4)',
                organization: '다문화가족지원포털',
                link: 'td.left a@href',
                baseUrl: 'https://www.liveinkorea.kr'
            }
        }
    ],

    categoryKeywords: {
        startup: ['창업', '스타트업', '예비창업', '초기창업', '창업도약', '사업화', '액셀러레이터', '인큐베이팅'],
        sme: ['중소기업', '중견기업', '벤처', '기업지원', '혁신기업', '성장지원'],
        smallbiz: ['소상공인', '자영업', '소공인', '전통시장', '상권', '골목상권'],
        employment: ['취업', '고용', '일자리', '채용', '근로', '노동', '직업', '구직', '고용허가'],
        youth: ['청년', '대학생', '졸업생', '청소년', '사회초년생', '39세', '34세'],
        rnd: ['R&D', '연구개발', '기술개발', '기술혁신', '특허', 'TIPS', '기술사업화'],
        housing: ['주거', '주택', '임대', '전세', '월세', '정착', '아파트', '매입임대'],
        medical: ['의료', '건강', '병원', '보험', '치료', '진료', '건강보험', '예방접종'],
        education: ['교육', '학교', '학습', '한국어', '연수', '훈련', '자격증', '직업훈련'],
        welfare: ['복지', '돌봄', '장애인', '저소득', '기초생활', '아동', '노인', '사회보장'],
        visa: ['비자', 'VISA', '체류', '입국', '출국', '여권', '사증', '외국인등록', 'E-9', 'H-2'],
        foreigner: ['외국인', '다문화', '이주민', '결혼이민', '재외동포', '글로벌'],
        finance: ['정책자금', '융자', '대출', '보증', '보조금', '지원금', '자금지원', '투자'],
        tax: ['세제', '세금', '감면', '공제', '세액공제', '조세'],
        export: ['수출', '해외', '무역', '통상', '글로벌시장', 'KOTRA', '해외진출'],
    },

    visaKeywords: {
        'E-9': ['E-9', 'E9', '비전문취업', '고용허가제', '제조업', '농축산업'],
        'E-7': ['E-7', 'E7', '특정활동', '전문인력'],
        'E-2': ['E-2', 'E2', '회화지도', '영어교사'],
        'F-2': ['F-2', 'F2', '거주', '점수제'],
        'F-4': ['F-4', 'F4', '재외동포'],
        'F-5': ['F-5', 'F5', '영주', '영주권'],
        'F-6': ['F-6', 'F6', '결혼이민', '다문화'],
        'D-2': ['D-2', 'D2', '유학', '유학생'],
        'H-2': ['H-2', 'H2', '방문취업'],
    }
};
