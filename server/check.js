#!/usr/bin/env node
/**
 * 🩺 백엔드 자가 진단 스크립트
 * 사용법: node check.js
 * 
 * 서버 실행 여부, DB 연결, 크롤링 파서, API 응답 등을 한 번에 점검합니다.
 */

const http = require('http');
const config = require('./config');
const db = require('./database');

const BASE = 'http://localhost:5001';
const PASS = '✅';
const FAIL = '❌';
const WARN = '⚠️';
const results = [];

function log(icon, label, detail = '') {
    const msg = `${icon} ${label}${detail ? ' — ' + detail : ''}`;
    console.log(msg);
    results.push({ pass: icon === PASS, label });
}

function httpGet(path) {
    return new Promise((resolve, reject) => {
        const req = http.get(`${BASE}${path}`, { timeout: 5000 }, (res) => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
                catch { resolve({ status: res.statusCode, data: body }); }
            });
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    });
}

async function run() {
    console.log('\n🩺 ═══════════════════════════════════════');
    console.log('   백엔드 자가 진단 시작');
    console.log('═══════════════════════════════════════════\n');

    // ── 1. 서버 실행 확인 ──
    console.log('── 1. 서버 연결 ──');
    try {
        const health = await httpGet('/api/health');
        log(PASS, '서버 실행중', `포트 5001`);
        log(
            health.data.firestore === 'connected' ? PASS : WARN,
            'Firestore 연결',
            health.data.firestore === 'connected' ? '정상 연결' : 'demo-mode (메모리 전용, 재시작 시 데이터 소실)'
        );
        log(
            health.data.scheduler === 'running' ? PASS : WARN,
            '스케줄러',
            health.data.scheduler === 'running' ? '활성 (오전9시/오후6시)' : '비활성'
        );
    } catch (e) {
        log(FAIL, '서버 연결 실패', '서버가 실행중이 아닙니다. `node index.js`로 시작하세요.');
        console.log('\n💡 서버가 꺼져있으므로 나머지 검사는 생략합니다.');
        printSummary();
        return;
    }

    // ── 2. API 점검 ──
    console.log('\n── 2. API 엔드포인트 ──');
    const apis = [
        ['/api/policies?limit=1', '정책 목록 API'],
        ['/api/stats', '통계 API'],
        ['/api/admin/sites', '크롤링 사이트 API'],
        ['/api/admin/logs', '크롤링 로그 API'],
        ['/api/admin/scheduler', '스케줄러 상태 API'],
    ];
    for (const [path, name] of apis) {
        try {
            const res = await httpGet(path);
            log(res.data.success ? PASS : FAIL, name, res.data.success ? 'OK' : JSON.stringify(res.data.error || '응답 이상'));
        } catch (e) {
            log(FAIL, name, e.message);
        }
    }

    // ── 3. 크롤링 파서 점검 ──
    console.log('\n── 3. 크롤링 사이트 설정 ──');
    const sites = config.sites || [];
    const enabled = sites.filter(s => s.enabled);
    const disabled = sites.filter(s => !s.enabled);
    log(PASS, `등록 사이트 ${sites.length}개`, `활성 ${enabled.length}개, 비활성 ${disabled.length}개`);
    for (const site of enabled) {
        const hasSelector = site.selectors && (site.selectors.content || site.selectors.list);
        log(
            hasSelector ? PASS : WARN,
            `  ${site.name || site.id}`,
            `카테고리: ${site.category}${hasSelector ? '' : ' (셀렉터 미설정)'}`
        );
    }

    // ── 4. 데이터 상태 ──
    console.log('\n── 4. 데이터 현황 ──');
    try {
        const statsRes = await httpGet('/api/stats');
        const s = statsRes.data?.data || statsRes.data;
        if (s) {
            const total = s.total || 0;
            log(total > 0 ? PASS : WARN, `저장된 정책`, `${total}건`);
            if (s.byStatus) {
                const statuses = Object.entries(s.byStatus).map(([k, v]) => `${k}: ${v}건`).join(', ');
                log(PASS, `상태별 분포`, statuses);
            }
        }
    } catch (e) {
        log(WARN, '데이터 현황 조회 실패', e.message);
    }

    // ── 5. 단건 크롤링 테스트 (읽기 전용) ──
    console.log('\n── 5. 크롤링 파서 테스트 (비저장) ──');
    try {
        const scanner = require('./scanner');
        // parseBizinfo만 간단히 테스트 (실제 저장 안함)
        const axios = require('axios');
        const res = await axios.get('https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do', {
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        log(res.status === 200 ? PASS : FAIL, 'Bizinfo 접속', `HTTP ${res.status}, ${res.data.length} bytes`);
    } catch (e) {
        log(FAIL, 'Bizinfo 접속 실패', e.message);
    }

    printSummary();
}

function printSummary() {
    const passed = results.filter(r => r.pass).length;
    const total = results.length;
    console.log('\n═══════════════════════════════════════════');
    console.log(`   결과: ${passed}/${total} 통과`);
    if (passed === total) {
        console.log('   🎉 모든 검사를 통과했습니다!');
    } else {
        console.log('   👆 위의 경고/실패 항목을 확인하세요.');
    }
    console.log('═══════════════════════════════════════════\n');
}

run().catch(e => {
    console.error('진단 스크립트 오류:', e);
    process.exit(1);
});
