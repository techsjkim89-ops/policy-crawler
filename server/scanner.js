/**
 * 크롤링 스캐너 모듈 (v2 - 사이트별 맞춤 파서)
 * 공공기관 사이트에서 정부 지원 정책 정보를 수집합니다.
 */
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');
const db = require('./database');
const { translatePolicy } = require('./translate');
const { analyzeCreditRequirement } = require('./creditDetector');

// HTTP 클라이언트 설정
const httpClient = axios.create({
    timeout: 30000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br'
    }
});

const MAX_RETRIES = 3;

/**
 * 재시도 로직이 포함된 HTTP GET 요청
 */
async function fetchWithRetry(url, options = {}, retries = MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await httpClient.get(url, options);
            return response;
        } catch (error) {
            const isRetryable = error.code === 'ECONNABORTED' ||
                error.code === 'ECONNRESET' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'EPROTO' ||
                (error.response && error.response.status >= 500);

            if (attempt < retries && isRetryable) {
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`  ⏳ 재시도 ${attempt}/${retries} (${delay / 1000}초 후)... [${error.code || error.response?.status}]`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}

/**
 * 카테고리 자동 분류
 */
function categorize(text) {
    const keywords = config.categoryKeywords;
    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => text.includes(word))) {
            return category;
        }
    }
    return 'sme'; // 기본값
}

/**
 * 대상 비자 자동 추출
 */
function extractVisaTypes(text) {
    const visaKeywords = config.visaKeywords;
    const foundVisas = [];
    for (const [visa, keywords] of Object.entries(visaKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            foundVisas.push(visa);
        }
    }
    return foundVisas.length > 0 ? foundVisas : ['all'];
}

/**
 * 상태 자동 분류
 */
function determineStatus(text, dateText) {
    const now = new Date();
    const dateMatch = dateText?.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
    if (dateMatch) {
        const endDate = new Date(dateMatch[1], dateMatch[2] - 1, dateMatch[3]);
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 0) return 'closed';
        if (daysRemaining <= 7) return 'closing';
    }
    if (text.includes('마감') || text.includes('종료')) return 'closed';
    if (text.includes('예정') || text.includes('곧')) return 'upcoming';
    if (text.includes('접수중') || text.includes('모집중')) return 'open';
    return 'open';
}

/**
 * 날짜 파싱
 */
function parseDate(dateText) {
    if (!dateText) return null;
    const match = dateText.match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
    if (match) {
        return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
    }
    // YYYY.MM.DD가 아닌 경우 MM.DD 형식도 처리
    const shortMatch = dateText.match(/(\d{1,2})[-./](\d{1,2})/);
    if (shortMatch) {
        const year = new Date().getFullYear();
        return `${year}-${shortMatch[1].padStart(2, '0')}-${shortMatch[2].padStart(2, '0')}`;
    }
    return null;
}

/**
 * 상세 페이지 크롤링 (본문/첨부)
 */
async function fetchDetail(item, site) {
    if (!item.originalUrl || !item.originalUrl.startsWith('http')) return item;

    try {
        // 상세 페이지 로딩 (딜레이 적용)
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        console.log(`    🔍 상세 URL 방문: ${item.originalUrl}`);
        const response = await fetchWithRetry(item.originalUrl);
        console.log(`    📦 응답 크기: ${response.data.length} bytes`);
        const $ = cheerio.load(response.data);

        // 셀렉터 기반 추출
        const contentSelector = site.selectors?.content || '.view_cont, .board_view, .content, #content, .post-content';
        const attachSelector = site.selectors?.attachments || '.file_down, .file_list a, .attach_file a, a[href*="download"], a[href*="fileDown"], a[href*="FileDown"]';

        console.log(`    🎯 셀렉터 시도: content="${contentSelector}", attach="${attachSelector}"`);

        // 1. 본문 추출 (HTML 태그 제거 및 정제)
        let content = '';
        const $content = $(contentSelector);
        if ($content.length > 0) {
            // 불필요한 스크립트/스타일 제거
            $content.find('script, style, iframe, form').remove();
            content = $content.text().trim()
                .replace(/\s+/g, ' ') // 연속 공백 제거
                .substring(0, 5000); // 길이 제한
        }

        // 2. 첨부파일 추출
        const attachments = [];
        $(attachSelector).each((i, el) => {
            const $el = $(el);
            let href = $el.attr('href');
            const name = $el.text().trim();

            if (href && !href.startsWith('javascript')) {
                if (!href.startsWith('http')) {
                    // 절대 경로 변환
                    const baseUrl = new URL(item.originalUrl).origin;
                    href = baseUrl + (href.startsWith('/') ? '' : '/') + href;
                }
                attachments.push({ name, url: href });
            }
        });

        item.content = content || item.summary;
        item.attachments = attachments;
        console.log(`    📄 본문(${content.length}자) 및 첨부파일(${attachments.length}개) 추출 완료`);

    } catch (e) {
        console.error(`    ⚠️ 상세 크롤링 실패: ${e.message}`);
    }

    return item;
}

// ==================== 사이트별 맞춤 파서 ====================

/**
 * 비즈인포 전용 파서 (API 기반 목록)
 * 비즈인포는 별도 지원사업 조회 API 제공
 */
async function parseBizinfo(site) {
    const apiUrl = 'https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do';
    const response = await fetchWithRetry(apiUrl);
    const $ = cheerio.load(response.data);
    const items = [];

    // 비즈인포는 지원사업 목록을 .tbl_wrap 또는 링크 목록으로 표시
    // 실제 구조: <a href="...detail...">제목</a> 링크 목록
    $('a[href*="pblancId"]').each((idx, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        if (!title || title.length < 5) return;

        let href = $el.attr('href') || '';
        if (href && !href.startsWith('http')) {
            href = 'https://www.bizinfo.go.kr' + (href.startsWith('/') ? '' : '/') + href;
        }

        // 날짜는 인접 요소에서 추출 시도
        const parentRow = $el.closest('tr, li, .list-item, div');
        const dateText = parentRow.find('td:last-child, .date, span.date').text().trim();

        items.push({
            externalId: `bizinfo-${idx}-${Date.now()}`,
            siteId: site.id,
            title,
            organization: '중소벤처기업부(기업마당)',
            category: categorize(title) || site.category,
            status: determineStatus(title, dateText),
            startDate: parseDate(dateText) || new Date().toISOString().split('T')[0],
            endDate: null,
            targetVisa: extractVisaTypes(title),
            targetRegion: ['all'],
            summary: title,
            content: '',
            originalUrl: href,
        });
    });

    return items;
}

/**
 * 하이코리아 전용 파서
 * 공지사항은 javascript:void(0) 링크 사용 → 제목만 추출, 별도 URL 구성
 */
async function parseHikorea(site) {
    const response = await fetchWithRetry(site.url);
    const $ = cheerio.load(response.data);
    const items = [];

    // 하이코리아 공지사항 목록
    // 실제 구조: 텍스트 기반 공지사항 + javascript:void(0) 링크
    $('td.subject a, .board_list a, a').each((idx, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        if (!title || title.length < 5) return;
        // 네비게이션/메뉴 링크 필터
        if (['공지사항', '보도자료', '자료실', '민원서식', '뉴스레터', 'Hi Korea',
            '홈', '뉴스 · 공지', '개인정보처리방침', '웹접근성정책', 'TOP',
            '원격접속', '관련사이트', '지역/지방정부', '찾아오시는 길', '이용약관',
            '저작권보호정책', '이메일무단수집거부', '뷰어다운로드', '공공데이터이용정책',
            '민원행정서비스헌장', '스마트폰 어플', '사이트맵', '뉴스·공지'].includes(title)) return;
        if (title.match(/^[0-9|<>]+$/)) return;  // 페이지 번호
        if (title.startsWith('페이스북') || title.includes('다운로드')) return;

        const href = $el.attr('href') || '';
        const onclick = $el.attr('onclick') || '';
        let detailUrl = 'https://www.hikorea.go.kr/board/BoardNtcListR.pt'; // 기본값 (목록)

        // 상세 URL 추출 (goView('1234', 'BS10', ...) 패턴)
        // 실제 함수 매칭: fn_goDetail('2863', 'BS10', 'NT_00000000000000001');
        const viewMatch = onclick.match(/['"](\d+)['"]\s*,\s*['"]([^'"]+)['"]/);
        if (viewMatch) {
            const seq = viewMatch[1];
            const code = viewMatch[2];
            detailUrl = `https://www.hikorea.go.kr/board/BoardNtcDetailR.pt?BBS_SEQ=${seq}&BBS_GB_CD=${code}`;
        }

        const parentRow = $el.closest('tr, li');
        const dateText = parentRow.find('td:nth-child(4), .date').text().trim();

        items.push({
            externalId: `hikorea-${idx}-${Date.now()}`,
            siteId: site.id,
            title,
            organization: '출입국외국인정책본부',
            category: categorize(title) || 'visa',
            status: 'open',
            startDate: parseDate(dateText) || new Date().toISOString().split('T')[0],
            endDate: null,
            targetVisa: extractVisaTypes(title),
            targetRegion: ['all'],
            summary: title,
            content: '',
            originalUrl: detailUrl,
        });
    });

    return items;
}

/**
 * 고용노동부 전용 파서
 * 보도자료 목록: 제목 링크가 직접 제공됨
 */
async function parseMoel(site) {
    const response = await fetchWithRetry(site.url);
    const $ = cheerio.load(response.data);
    const items = [];

    $('a[href*="enewsView"], a[href*="noticeView"]').each((idx, el) => {
        const $el = $(el);
        const title = $el.text().trim();
        if (!title || title.length < 5) return;

        let href = $el.attr('href') || '';
        if (href && !href.startsWith('http')) {
            href = 'https://www.moel.go.kr' + href;
        }

        items.push({
            externalId: `moel-${idx}-${Date.now()}`,
            siteId: site.id,
            title,
            organization: '고용노동부',
            category: categorize(title) || 'employment',
            status: 'open',
            startDate: new Date().toISOString().split('T')[0],
            endDate: null,
            targetVisa: extractVisaTypes(title),
            targetRegion: ['all'],
            summary: title,
            content: '',
            originalUrl: href,
        });
    });

    return items;
}

/**
 * K-스타트업 전용 파서
 * go_view(12345) 형태의 자바스크립트 링크 처리
 */
async function parseKStartup(site) {
    const response = await fetchWithRetry(site.url);
    const $ = cheerio.load(response.data);
    const items = [];

    // K-Startup은 목록이 <ul> > <li> 구조로 되어 있음
    $('li, tr').each((idx, el) => {
        const $el = $(el);
        // 제목과 링크가 포함된 a 태그 찾기
        const $link = $el.find('a[href*="go_view"]');
        if ($link.length === 0) return;

        const title = $link.text().trim();
        if (!title || title.length < 5) return;

        // go_view(176286) 에서 ID 추출
        const href = $link.attr('href');
        const idMatch = href.match(/go_view\('?(\d+)'?\)/);
        if (!idMatch) return;

        const pbancSn = idMatch[1];
        // 상세 페이지 URL 구성
        const detailUrl = `https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do?schM=view&pbancSn=${pbancSn}&page=1&schStr=regist&pbancEndYn=N`;

        // 날짜 추출 (마감일자 2026-03-04 등의 텍스트 검색)
        const textContent = $el.text();
        const dateMatch = textContent.match(/마감일자\s*(\d{4}-\d{2}-\d{2})/);
        const endDate = dateMatch ? dateMatch[1] : null;

        // D-Day 추출 (옵션)
        const dDayMatch = textContent.match(/D-(\d+)/);
        // 기관명 추출
        const orgMatch = textContent.match(/창업진흥원|중소벤처기업부|[가-힣]+센터/);
        const organization = orgMatch ? orgMatch[0] : 'K-스타트업';

        items.push({
            externalId: `kstartup-${pbancSn}`,
            siteId: site.id,
            title,
            organization,
            category: categorize(title) || 'startup',
            status: determineStatus(title, endDate),
            startDate: new Date().toISOString().split('T')[0], // 시작일 알 수 없음
            endDate: endDate,
            targetVisa: extractVisaTypes(title),
            targetRegion: ['all'],
            summary: title,
            content: '',
            originalUrl: detailUrl,
        });
    });

    return items;
}

/**
 * 범용 파서 (셀렉터 기반) - 기존 로직
 */
async function parseGeneric(site) {
    const response = await fetchWithRetry(site.url);
    const $ = cheerio.load(response.data);
    const items = [];
    const selectors = site.selectors;

    // 1차: 설정된 셀렉터로 시도
    $(selectors.list).each((index, element) => {
        try {
            const $row = $(element);
            const titleEl = $row.find(selectors.title);
            const title = titleEl.text().trim();
            if (!title || title.length < 3) return;

            let href = '';
            if (selectors.link.includes('@href')) {
                const selector = selectors.link.replace('@href', '');
                href = $row.find(selector).attr('href') || '';
            } else {
                href = $row.find(selectors.link).attr('href') || '';
            }
            if (href && !href.startsWith('http')) {
                href = selectors.baseUrl + (href.startsWith('/') ? '' : '/') + href;
            }

            const dateText = $row.find(selectors.date).text().trim();
            const publishedDate = parseDate(dateText);

            const organization = typeof selectors.organization === 'string' && !selectors.organization.includes(' ')
                ? $row.find(selectors.organization).text().trim() || selectors.organization
                : selectors.organization || site.name;

            let status = 'open';
            if (selectors.status) {
                const statusText = $row.find(selectors.status).text().trim();
                status = determineStatus(statusText, dateText);
            } else {
                status = determineStatus(title, dateText);
            }

            items.push({
                externalId: `${site.id}-${index}-${Date.now()}`,
                siteId: site.id,
                title,
                organization,
                category: site.category || categorize(title),
                status,
                startDate: publishedDate,
                endDate: null,
                targetVisa: extractVisaTypes(title),
                targetRegion: ['all'],
                summary: title,
                content: '',
                originalUrl: href,
            });
        } catch (err) {
            console.error(`  항목 파싱 오류:`, err.message);
        }
    });

    // 2차: 셀렉터로 못 찾으면 전체 링크에서 게시글 패턴 추출 (fallback)
    if (items.length === 0) {
        console.log(`  ℹ️ 셀렉터 매칭 실패, 링크 패턴 fallback 사용`);
        const detailPatterns = [
            /View\.do/, /Detail/, /detail/, /view\.do/, /read\.do/,
            /BoardRead/, /boardRead/, /selectOne/, /View\?/,
        ];

        $('a').each((idx, el) => {
            const $el = $(el);
            const href = $el.attr('href') || '';
            const title = $el.text().trim();

            if (!title || title.length < 5 || title.length > 200) return;
            if (!detailPatterns.some(p => p.test(href))) return;
            // 메뉴/네비 필터
            if (title.match(/^[0-9<>|처음이전다음마지막]+$/)) return;

            let fullUrl = href;
            if (!href.startsWith('http')) {
                fullUrl = selectors.baseUrl + (href.startsWith('/') ? '' : '/') + href;
            }

            items.push({
                externalId: `${site.id}-fb-${idx}-${Date.now()}`,
                siteId: site.id,
                title,
                organization: site.name,
                category: site.category || categorize(title),
                status: 'open',
                startDate: new Date().toISOString().split('T')[0],
                endDate: null,
                targetVisa: extractVisaTypes(title),
                targetRegion: ['all'],
                summary: title,
                content: '',
                originalUrl: fullUrl,
            });
        });
    }

    return items;
}

// ==================== 파서 매핑 ====================
const CUSTOM_PARSERS = {
    bizinfo: parseBizinfo,
    hikorea: parseHikorea,
    moel: parseMoel,
    k_startup: parseKStartup,
};

// ==================== 메인 크롤링 함수 ====================

/**
 * 단일 사이트 크롤링
 */
async function crawlSite(site) {
    console.log(`\n🔍 크롤링 시작: ${site.name}`);
    const startedAt = new Date().toISOString();

    const result = {
        siteId: site.id,
        siteName: site.name,
        status: 'success',
        totalFound: 0,
        newAdded: 0,
        duplicatesSkipped: 0,
        errorMessage: null,
        startedAt
    };

    try {
        // 사이트별 맞춤 파서 또는 범용 파서 사용
        const parser = CUSTOM_PARSERS[site.id] || parseGeneric;
        const items = await parser(site);

        result.totalFound = items.length;
        console.log(`  📋 발견된 항목: ${items.length}개`);

        // 중복 체크 및 저장
        for (const item of items) {
            const isDuplicate = await db.checkDuplicate(item.siteId, item.title, item.startDate);

            if (isDuplicate) {
                result.duplicatesSkipped++;
                continue;
            }

            // 신용평가 필수 여부 자동 감지
            const creditAnalysis = analyzeCreditRequirement(
                item.summary || item.title,
                item.title,
                item.category
            );
            item.isCreditRequired = creditAnalysis.isRequired;
            item.creditKeywords = creditAnalysis.matchedKeywords;

            console.log(`   📋 ${item.title.substring(0, 40)}... → 신용평가: ${creditAnalysis.isRequired ? '🔴필수' : '⚪무관'}`);

            // ==========================================
            // [New] 상세 페이지 크롤링 (본문/첨부)
            // ==========================================
            await fetchDetail(item, site);

            // 번역 수행
            try {
                const translatedItem = await translatePolicy(item);
                await db.savePolicy(translatedItem);
                result.newAdded++;
            } catch (err) {
                // 번역 실패 시 원본만 저장
                try {
                    await db.savePolicy(item);
                    result.newAdded++;
                } catch (saveErr) {
                    console.error(`   💾 저장 오류: ${saveErr.message}`);
                }
            }
        }

        console.log(`  ✅ 새로 추가: ${result.newAdded}개, 중복 건너뜀: ${result.duplicatesSkipped}개`);

    } catch (error) {
        console.error(`  ❌ 크롤링 실패:`, error.message);
        result.status = 'error';
        result.errorMessage = error.message;
    }

    // 로그 저장 (Firestore 오류 시 무시)
    try {
        await db.saveCrawlLog(result);
    } catch (logErr) {
        console.error(`로그 저장 오류: ${logErr.message}`);
    }

    return result;
}

/**
 * 모든 활성 사이트 크롤링
 */
async function crawlAllSites() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 전체 크롤링 시작:', new Date().toLocaleString('ko-KR'));
    console.log('='.repeat(60));

    const enabledSites = config.sites.filter(s => s.enabled);
    const results = [];
    let totalNewAdded = 0;

    for (const site of enabledSites) {
        try {
            const result = await crawlSite(site);
            results.push(result);
            totalNewAdded += result.newAdded;

            // 사이트 간 딜레이 (서버 부하 방지)
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error(`사이트 크롤링 오류 (${site.name}):`, error.message);
            results.push({
                siteId: site.id,
                siteName: site.name,
                status: 'error',
                totalFound: 0,
                newAdded: 0,
                duplicatesSkipped: 0,
                errorMessage: error.message
            });
        }
    }

    // 신규 정책 알림 생성
    if (totalNewAdded > 0) {
        try {
            await db.createNotification(
                'new_policies',
                `${totalNewAdded}건의 새로운 정책이 추가되었습니다.`,
                totalNewAdded
            );
        } catch (e) {
            console.error('알림 생성 오류:', e.message);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🏁 전체 크롤링 완료');
    console.log(`   총 신규 추가: ${totalNewAdded}건`);
    console.log('='.repeat(60) + '\n');

    return {
        timestamp: new Date().toISOString(),
        totalSites: enabledSites.length,
        totalNewAdded,
        results
    };
}

/**
 * 특정 사이트 크롤링
 */
async function crawlSingleSite(siteId) {
    const site = config.sites.find(s => s.id === siteId);
    if (!site) {
        throw new Error(`사이트를 찾을 수 없습니다: ${siteId}`);
    }
    return await crawlSite(site);
}

module.exports = {
    crawlSite,
    crawlAllSites,
    crawlSingleSite
};
