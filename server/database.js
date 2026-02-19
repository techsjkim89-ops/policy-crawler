/**
 * Firestore 전용 데이터베이스 모듈
 * SQLite 대신 Firebase Firestore를 사용합니다
 * (컴파일 필요 없는 순수 자바스크립트)
 */

const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
let db = null;
let isInitialized = false;

/**
 * Firebase 초기화
 */
function initDatabase() {
  if (isInitialized) return;

  try {
    // 서비스 계정 키 로드
    let serviceAccount = null;

    // 환경변수에서 JSON 문자열로 전달 (배포 환경)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    }
    // 파일 경로로 전달 (개발 환경)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    }
    // 기본 파일 경로
    else {
      try {
        serviceAccount = require('./serviceAccountKey.json');
      } catch (e) {
        console.warn('⚠️ serviceAccountKey.json 파일을 찾을 수 없습니다.');
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
      });
      db = admin.firestore();
      isInitialized = true;
      console.log('✅ Firebase Firestore 초기화 완료');
    } else {
      console.warn('⚠️ Firebase 서비스 계정이 없습니다. 데모 모드로 실행됩니다.');
      isInitialized = true;
    }
  } catch (error) {
    console.error('❌ Firebase 초기화 오류:', error.message);
    isInitialized = true;
  }
}

/**
 * Firestore 사용 가능 여부
 */
function isFirestoreAvailable() {
  return db !== null;
}

/**
 * 정책 중복 체크
 */
async function checkDuplicate(siteId, title, startDate) {
  if (!db) return null;

  try {
    const snapshot = await db.collection('policies')
      .where('site_id', '==', siteId)
      .where('title', '==', title)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id };
    }
    return null;
  } catch (error) {
    console.error('중복 체크 오류:', error.message);
    return null;
  }
}

/**
 * 정책 저장
 */
async function savePolicy(policy) {
  if (!db) {
    console.log('📋 [데모] 정책 저장:', policy.title);
    return { success: true, id: 'demo-' + Date.now() };
  }

  try {
    const docData = {
      external_id: policy.externalId || null,
      site_id: policy.siteId,
      title: policy.title,
      organization: policy.organization || '',
      category: policy.category || 'living',
      status: policy.status || 'open',
      start_date: policy.startDate || null,
      end_date: policy.endDate || null,
      target_visa: policy.targetVisa || ['all'],
      target_region: policy.targetRegion || ['all'],
      is_credit_required: policy.isCreditRequired || false,
      credit_keywords: policy.creditKeywords || [],
      summary: policy.summary || '',
      content: policy.content || '',
      content_en: policy.content_en || '',
      content_vi: policy.content_vi || '',
      content_th: policy.content_th || '',
      original_url: policy.originalUrl || '',
      translations: policy.translations || {},
      views: 0,
      is_new: true,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('policies').add(docData);
    console.log(`✅ 정책 저장: ${policy.title} (ID: ${docRef.id})`);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('정책 저장 오류:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 정책 목록 조회 (cursor 기반 페이지네이션)
 */
async function getPolicies({ search, category, status, visa, region, isCreditRequired, page = 1, limit = 20 }) {
  if (!db) {
    return [];
  }

  try {
    let query = db.collection('policies');

    if (category) {
      query = query.where('category', '==', category);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    if (isCreditRequired === true) {
      query = query.where('is_credit_required', '==', true);
    }

    // offset 기반 페이지네이션 (page > 1일 때 skip 처리)
    const offset = (page - 1) * limit;
    // 검색/비자/지역 필터는 클라이언트 측이므로 넉넉히 조회
    const fetchLimit = (search || visa || region) ? Math.max(limit * 5, 200) : limit + offset;

    query = query.orderBy('created_at', 'desc').limit(fetchLimit);

    const snapshot = await query.get();
    const allResults = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      // 클라이언트 측 필터링 (Firestore 제약)
      if (search) {
        const searchLower = search.toLowerCase();
        if (!data.title?.toLowerCase().includes(searchLower) &&
          !data.summary?.toLowerCase().includes(searchLower) &&
          !data.organization?.toLowerCase().includes(searchLower)) {
          return;
        }
      }

      if (visa && data.target_visa) {
        if (!data.target_visa.includes(visa) && !data.target_visa.includes('all')) {
          return;
        }
      }

      if (region && data.target_region) {
        if (!data.target_region.includes(region) && !data.target_region.includes('all')) {
          return;
        }
      }

      allResults.push({
        id: doc.id,
        ...data,
        targetVisa: data.target_visa || [],
        targetRegion: data.target_region || [],
        requiresCreditReport: data.is_credit_required || false,
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at?.toDate?.()?.toISOString() || null
      });
    });

    // offset 기반으로 slice
    return allResults.slice(offset, offset + limit);
  } catch (error) {
    console.error('정책 조회 오류:', error.message);
    return [];
  }
}

/**
 * 신규 정책 수 조회
 */
async function getNewPoliciesCount() {
  if (!db) return 3; // 데모용

  try {
    const snapshot = await db.collection('policies')
      .where('is_new', '==', true)
      .count()
      .get();

    return snapshot.data().count || 0;
  } catch (error) {
    console.error('신규 정책 수 조회 오류:', error.message);
    return 0;
  }
}

/**
 * 신규 정책 읽음 처리
 */
async function markPoliciesAsRead() {
  if (!db) return { success: true };

  try {
    const snapshot = await db.collection('policies')
      .where('is_new', '==', true)
      .get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { is_new: false });
    });

    await batch.commit();
    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error('읽음 처리 오류:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 크롤링 로그 저장
 */
async function saveCrawlLog(log) {
  if (!db) {
    console.log('📋 [데모] 크롤링 로그:', log.siteName, log.status);
    return { success: true };
  }

  try {
    await db.collection('crawl_logs').add({
      site_id: log.siteId,
      site_name: log.siteName,
      status: log.status,
      total_found: log.totalFound || 0,
      new_added: log.newAdded || 0,
      duplicates_skipped: log.duplicatesSkipped || 0,
      error_message: log.errorMessage || null,
      started_at: log.startedAt,
      completed_at: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('로그 저장 오류:', error.message);
    return { success: false };
  }
}

/**
 * 크롤링 로그 조회
 */
async function getCrawlLogs(limitCount = 50) {
  if (!db) return [];

  try {
    const snapshot = await db.collection('crawl_logs')
      .orderBy('completed_at', 'desc')
      .limit(limitCount)
      .get();

    const logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        siteId: data.site_id,
        siteName: data.site_name,
        status: data.status,
        totalFound: data.total_found,
        newAdded: data.new_added,
        duplicatesSkipped: data.duplicates_skipped,
        errorMessage: data.error_message,
        startedAt: data.started_at,
        completedAt: data.completed_at?.toDate?.()?.toISOString()
      });
    });

    return logs;
  } catch (error) {
    console.error('로그 조회 오류:', error.message);
    return [];
  }
}

/**
 * 알림 생성
 */
async function createNotification(type, message, count) {
  if (!db) {
    console.log('📋 [데모] 알림 생성:', message);
    return { success: true };
  }

  try {
    await db.collection('notifications').add({
      type,
      message,
      count,
      is_read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('알림 생성 오류:', error.message);
    return { success: false };
  }
}

/**
 * 읽지 않은 알림 조회
 */
async function getUnreadNotifications() {
  if (!db) return [];

  try {
    const snapshot = await db.collection('notifications')
      .where('is_read', '==', false)
      .orderBy('created_at', 'desc')
      .limit(10)
      .get();

    const notifications = [];
    snapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return notifications;
  } catch (error) {
    console.error('알림 조회 오류:', error.message);
    return [];
  }
}

/**
 * 알림 읽음 처리
 */
async function markNotificationsAsRead() {
  if (!db) return { success: true };

  try {
    const snapshot = await db.collection('notifications')
      .where('is_read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { is_read: true });
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('알림 읽음 처리 오류:', error.message);
    return { success: false };
  }
}

/**
 * 통계 조회 (카테고리/상태별 실제 집계)
 */
async function getStats() {
  if (!db) {
    return {
      total: 20,
      newCount: 3,
      byStatus: { open: 10, closing: 3, upcoming: 5, closed: 2 },
      byCategory: { employment: 5, visa: 4, housing: 3 },
      recentLogs: []
    };
  }

  try {
    // 전체 정책 조회하여 집계
    const snapshot = await db.collection('policies').get();
    const byStatus = {};
    const byCategory = {};
    let newCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      // 상태별 집계
      const status = data.status || 'open';
      byStatus[status] = (byStatus[status] || 0) + 1;
      // 카테고리별 집계
      const category = data.category || 'living';
      byCategory[category] = (byCategory[category] || 0) + 1;
      // 신규
      if (data.is_new) newCount++;
    });

    const total = snapshot.size;
    const recentLogs = await getCrawlLogs(5);

    return {
      total,
      newCount,
      byStatus,
      byCategory,
      recentLogs
    };
  } catch (error) {
    console.error('통계 조회 오류:', error.message);
    return { total: 0, newCount: 0, byStatus: {}, byCategory: {}, recentLogs: [] };
  }
}

/**
 * 북마크 추가
 */
async function addBookmark(userId, policyId, policyTitle) {
  if (!db) return { success: true };

  try {
    await db.collection('users').doc(userId).collection('bookmarks').add({
      policy_id: policyId,
      policy_title: policyTitle,
      bookmarked_at: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('북마크 추가 오류:', error.message);
    return { success: false };
  }
}

/**
 * 북마크 삭제
 */
async function removeBookmark(userId, policyId) {
  if (!db) return { success: true };

  try {
    const snapshot = await db.collection('users').doc(userId)
      .collection('bookmarks')
      .where('policy_id', '==', policyId)
      .get();

    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('북마크 삭제 오류:', error.message);
    return { success: false };
  }
}

/**
 * 사용자 북마크 조회
 */
async function getUserBookmarks(userId) {
  if (!db) return [];

  try {
    const snapshot = await db.collection('users').doc(userId)
      .collection('bookmarks')
      .orderBy('bookmarked_at', 'desc')
      .get();

    const bookmarks = [];
    snapshot.forEach(doc => {
      bookmarks.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return bookmarks;
  } catch (error) {
    console.error('북마크 조회 오류:', error.message);
    return [];
  }
}

module.exports = {
  initDatabase,
  isFirestoreAvailable,
  checkDuplicate,
  savePolicy,
  getPolicies,
  getNewPoliciesCount,
  markPoliciesAsRead,
  saveCrawlLog,
  getCrawlLogs,
  createNotification,
  getUnreadNotifications,
  markNotificationsAsRead,
  getStats,
  addBookmark,
  removeBookmark,
  getUserBookmarks
};
