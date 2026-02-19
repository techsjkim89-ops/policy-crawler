/**
 * 외국인 정책 크롤링 백엔드 서버 (Firestore 전용)
 * - Express API 서버
 * - node-cron 스케줄링 (매일 오전 9시/오후 6시)
 * - Firebase Firestore 아카이빙
 */
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const net = require('net');
const config = require('./config');
const db = require('./database');
const scanner = require('./scanner');

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT) || 5001;
const MAX_PORT_ATTEMPTS = 10;

// 미들웨어
app.use(cors());
app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (duration > 1000) {
            console.log(`⚠️ 느린 요청: ${req.method} ${req.url} - ${duration}ms`);
        }
    });
    next();
});

// 데이터베이스 초기화 (Firestore)
db.initDatabase();

// ==================== 스케줄러 설정 ====================

let schedulerStatus = {
    enabled: true,
    morningSchedule: config.schedule.morning,
    eveningSchedule: config.schedule.evening,
    lastRun: null,
    nextRun: null
};

// 오전 9시 크롤링
const morningJob = cron.schedule(config.schedule.morning, async () => {
    console.log('\n⏰ [스케줄] 오전 9시 크롤링 시작');
    schedulerStatus.lastRun = new Date().toISOString();
    try {
        await scanner.crawlAllSites();
    } catch (error) {
        console.error('스케줄 크롤링 오류:', error);
    }
}, { timezone: 'Asia/Seoul' });

// 오후 6시 크롤링
const eveningJob = cron.schedule(config.schedule.evening, async () => {
    console.log('\n⏰ [스케줄] 오후 6시 크롤링 시작');
    schedulerStatus.lastRun = new Date().toISOString();
    try {
        await scanner.crawlAllSites();
    } catch (error) {
        console.error('스케줄 크롤링 오류:', error);
    }
}, { timezone: 'Asia/Seoul' });

// ==================== 정책 API ====================

// 정책 목록 조회 (async)
app.get('/api/policies', async (req, res) => {
    try {
        const { search, category, status, visa, region, isCreditRequired, page = 1, limit = 20 } = req.query;
        const policies = await db.getPolicies({
            search,
            category,
            status,
            visa,
            region,
            isCreditRequired: isCreditRequired === 'true',
            page: parseInt(page),
            limit: parseInt(limit)
        });
        res.json({
            success: true,
            data: policies,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('정책 조회 오류:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 통계 조회 (async)
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await db.getStats();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== 알림 API ====================

// 신규 정책 수 조회 (async)
app.get('/api/notifications/new-count', async (req, res) => {
    try {
        const count = await db.getNewPoliciesCount();
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 알림 목록 조회 (async)
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await db.getUnreadNotifications();
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 알림 읽음 처리 (async)
app.post('/api/notifications/mark-read', async (req, res) => {
    try {
        await db.markNotificationsAsRead();
        await db.markPoliciesAsRead();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== 관리자 API ====================

// 크롤링 사이트 목록
app.get('/api/admin/sites', (req, res) => {
    res.json({
        success: true,
        data: config.sites.map(s => ({
            id: s.id,
            name: s.name,
            url: s.url,
            enabled: s.enabled,
            category: s.category
        }))
    });
});

// 수동 크롤링 실행 (전체)
app.post('/api/admin/crawl', async (req, res) => {
    try {
        console.log('🔄 수동 크롤링 요청');
        const result = await scanner.crawlAllSites();
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('크롤링 오류:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 수동 크롤링 실행 (특정 사이트)
app.post('/api/admin/crawl/:siteId', async (req, res) => {
    try {
        const result = await scanner.crawlSingleSite(req.params.siteId);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 크롤링 로그 조회 (async)
app.get('/api/admin/logs', async (req, res) => {
    try {
        const logs = await db.getCrawlLogs(parseInt(req.query.limit) || 50);
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 스케줄러 상태
app.get('/api/admin/scheduler', (req, res) => {
    res.json({
        success: true,
        data: {
            ...schedulerStatus,
            firestoreConnected: db.isFirestoreAvailable()
        }
    });
});

// 스케줄러 토글
app.post('/api/admin/scheduler/toggle', (req, res) => {
    try {
        if (schedulerStatus.enabled) {
            morningJob.stop();
            eveningJob.stop();
            schedulerStatus.enabled = false;
        } else {
            morningJob.start();
            eveningJob.start();
            schedulerStatus.enabled = true;
        }
        res.json({ success: true, data: schedulerStatus });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== 북마크 API ====================

// 북마크 추가
app.post('/api/bookmarks', async (req, res) => {
    try {
        const { userId, policyId, policyTitle } = req.body;
        const result = await db.addBookmark(userId, policyId, policyTitle);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 북마크 삭제
app.delete('/api/bookmarks', async (req, res) => {
    try {
        const { userId, policyId } = req.body;
        const result = await db.removeBookmark(userId, policyId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 사용자 북마크 조회
app.get('/api/bookmarks/:userId', async (req, res) => {
    try {
        const bookmarks = await db.getUserBookmarks(req.params.userId);
        res.json({ success: true, data: bookmarks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 서버 상태
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        scheduler: schedulerStatus.enabled ? 'running' : 'stopped',
        firestore: db.isFirestoreAvailable() ? 'connected' : 'demo-mode'
    });
});

// ==================== 서버 시작 ====================

/**
 * 포트 사용 가능 여부 확인
 */
function checkPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => {
            resolve(false);
        });
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        server.listen(port);
    });
}

/**
 * 사용 가능한 포트 찾기
 */
async function findAvailablePort(startPort) {
    for (let port = startPort; port < startPort + MAX_PORT_ATTEMPTS; port++) {
        const available = await checkPortAvailable(port);
        if (available) {
            return port;
        }
        console.log(`⚠️ 포트 ${port}번이 사용 중입니다. 다음 포트 시도...`);
    }
    throw new Error(`${startPort}~${startPort + MAX_PORT_ATTEMPTS - 1} 포트가 모두 사용 중입니다.`);
}

/**
 * 서버 시작
 */
async function startServer() {
    try {
        const PORT = await findAvailablePort(DEFAULT_PORT);

        app.listen(PORT, () => {
            const firestoreStatus = db.isFirestoreAvailable() ? '✅ Firestore 연결됨' : '⚠️ 데모 모드';
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🌏 외국인 정책 크롤링 서버 (Firestore 전용)                 ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║  📍 서버 주소: http://localhost:${PORT}                        ║
║  📋 API 문서: http://localhost:${PORT}/api/policies            ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║  ⏰ 스케줄링: 매일 오전 9시 / 오후 6시 자동 크롤링           ║
║  💾 데이터베이스: ${firestoreStatus}                    ║
╚══════════════════════════════════════════════════════════════╝
  `);
        });
    } catch (error) {
        console.error('❌ 서버 시작 실패:', error.message);
        process.exit(1);
    }
}

// ==================== 에러 핸들링 ====================

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `API 경로를 찾을 수 없습니다: ${req.method} ${req.url}`
    });
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
    console.error('❌ 서버 오류:', err.stack || err.message);
    res.status(500).json({
        success: false,
        error: '서버 내부 오류가 발생했습니다.',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// 프로세스 에러 핸들링
process.on('uncaughtException', (error) => {
    console.error('❌ 처리되지 않은 예외:', error);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ 처리되지 않은 Promise 거부:', reason);
});

// 서버 시작
startServer();

