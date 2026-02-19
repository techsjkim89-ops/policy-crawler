const { crawlSingleSite } = require('./scanner');

async function testAll() {
    console.log('--- 다중 사이트 상세 크롤링 테스트 ---');

    try {
        console.log('\n[1] Bizinfo 테스트');
        await crawlSingleSite('bizinfo');
    } catch (e) {
        console.error('Bizinfo Error:', e.message);
    }

    try {
        console.log('\n[2] HiKorea 테스트');
        await crawlSingleSite('hikorea');
    } catch (e) {
        console.error('HiKorea Error:', e.message);
    }

    try {
        console.log('\n[3] K-Startup 테스트');
        await crawlSingleSite('k_startup');
    } catch (e) {
        console.error('K-Startup Error:', e.message);
    }
}

testAll();
