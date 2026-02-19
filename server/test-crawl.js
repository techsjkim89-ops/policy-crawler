const { crawlSingleSite } = require('./scanner');
const config = require('./config');

async function testCrawl() {
    try {
        console.log('--- Testing K-Startup ---');
        await crawlSingleSite('k_startup');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testCrawl();
