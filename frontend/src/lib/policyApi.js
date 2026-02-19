/**
 * Firestore 정책 데이터 조회/저장 API 함수
 * ==========================================
 * 프론트엔드에서 Firestore와 상호작용하는 함수들
 */

import { db } from './firebaseConfig';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    Timestamp,
    increment
} from 'firebase/firestore';

// 컬렉션 참조
const policiesRef = collection(db, 'policies');

/**
 * =====================================
 * 정책 조회 함수
 * =====================================
 */

/**
 * 필터 조건에 따라 정책 목록 조회
 * @param {Object} filters - 필터 조건
 * @param {boolean} filters.isCreditRequired - 신용평가 필요 여부
 * @param {string[]} filters.visaTypes - 비자 유형 배열
 * @param {string[]} filters.regions - 지역 배열
 * @param {string[]} filters.statuses - 상태 배열
 * @param {string} filters.category - 카테고리
 * @param {string} sortBy - 정렬 기준 ('latest', 'deadline', 'views')
 * @param {number} pageSize - 페이지 크기
 * @param {Object} lastDoc - 페이지네이션용 마지막 문서
 */
export async function getPolicies(filters = {}, sortBy = 'latest', pageSize = 20, lastDoc = null) {
    try {
        let q = policiesRef;
        const constraints = [];

        // 🔴 신용평가 필요 사업만 필터
        if (filters.isCreditRequired === true) {
            constraints.push(where('is_credit_required', '==', true));
        }

        // 상태 필터 (open, closing, upcoming)
        if (filters.statuses && filters.statuses.length > 0) {
            constraints.push(where('status', 'in', filters.statuses));
        }

        // 카테고리 필터
        if (filters.category) {
            constraints.push(where('category', '==', filters.category));
        }

        // 정렬 기준
        if (sortBy === 'latest') {
            constraints.push(orderBy('created_at', 'desc'));
        } else if (sortBy === 'deadline') {
            constraints.push(orderBy('end_date', 'asc'));
        } else if (sortBy === 'views') {
            constraints.push(orderBy('views', 'desc'));
        }

        // 페이지 크기
        constraints.push(limit(pageSize));

        // 페이지네이션 (이전 페이지의 마지막 문서 이후부터)
        if (lastDoc) {
            constraints.push(startAfter(lastDoc));
        }

        q = query(policiesRef, ...constraints);
        const snapshot = await getDocs(q);

        const policies = [];
        snapshot.forEach((doc) => {
            const data = doc.data();

            // 비자 유형 필터 (클라이언트 측 필터링 - Firestore는 array-contains-any 제한)
            if (filters.visaTypes && filters.visaTypes.length > 0) {
                const hasMatchingVisa = data.target_visa?.some(v => filters.visaTypes.includes(v));
                if (!hasMatchingVisa) return;
            }

            // 지역 필터 (클라이언트 측)
            if (filters.regions && filters.regions.length > 0) {
                const hasMatchingRegion = data.target_region?.includes('all') ||
                    data.target_region?.some(r => filters.regions.includes(r));
                if (!hasMatchingRegion) return;
            }

            policies.push({
                id: doc.id,
                ...data,
                // Timestamp를 ISO 문자열로 변환
                start_date: data.start_date?.toDate?.()?.toISOString() || data.start_date,
                end_date: data.end_date?.toDate?.()?.toISOString() || data.end_date,
                created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at
            });
        });

        return {
            success: true,
            policies,
            lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
            hasMore: snapshot.docs.length === pageSize
        };
    } catch (error) {
        console.error('정책 조회 오류:', error);
        return { success: false, error: error.message, policies: [] };
    }
}

/**
 * 단일 정책 상세 조회
 * @param {string} policyId - 정책 문서 ID
 */
export async function getPolicyById(policyId) {
    try {
        const docRef = doc(db, 'policies', policyId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, error: '정책을 찾을 수 없습니다.' };
        }

        // 조회수 증가
        await updateDoc(docRef, {
            views: increment(1)
        });

        const data = docSnap.data();
        return {
            success: true,
            policy: {
                id: docSnap.id,
                ...data,
                start_date: data.start_date?.toDate?.()?.toISOString() || data.start_date,
                end_date: data.end_date?.toDate?.()?.toISOString() || data.end_date
            }
        };
    } catch (error) {
        console.error('정책 상세 조회 오류:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 검색어로 정책 검색
 * @param {string} searchTerm - 검색어
 */
export async function searchPolicies(searchTerm) {
    try {
        // Firestore는 전체 텍스트 검색을 지원하지 않음
        // 제목 prefix 검색 또는 Algolia/Typesense 연동 필요
        // 여기서는 클라이언트 측 필터링 사용
        const snapshot = await getDocs(
            query(policiesRef, orderBy('created_at', 'desc'), limit(100))
        );

        const searchLower = searchTerm.toLowerCase();
        const policies = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            const titleMatch = data.title?.toLowerCase().includes(searchLower);
            const agencyMatch = data.agency?.toLowerCase().includes(searchLower);
            const contentMatch = data.content_ko?.toLowerCase().includes(searchLower);

            if (titleMatch || agencyMatch || contentMatch) {
                policies.push({
                    id: doc.id,
                    ...data,
                    start_date: data.start_date?.toDate?.()?.toISOString() || data.start_date,
                    end_date: data.end_date?.toDate?.()?.toISOString() || data.end_date
                });
            }
        });

        return { success: true, policies };
    } catch (error) {
        console.error('정책 검색 오류:', error);
        return { success: false, error: error.message, policies: [] };
    }
}

/**
 * =====================================
 * 북마크(스크랩) 함수
 * =====================================
 */

/**
 * 정책 북마크 추가
 * @param {string} userId - 사용자 ID
 * @param {Object} policy - 정책 객체 { id, title }
 */
export async function addBookmark(userId, policy) {
    try {
        const bookmarksRef = collection(db, 'users', userId, 'bookmarks');

        // 이미 북마크되었는지 확인
        const existingQuery = query(bookmarksRef, where('policy_id', '==', policy.id));
        const existing = await getDocs(existingQuery);

        if (!existing.empty) {
            return { success: false, error: '이미 스크랩된 정책입니다.' };
        }

        await addDoc(bookmarksRef, {
            policy_id: policy.id,
            policy_title: policy.title,
            bookmarked_at: Timestamp.now()
        });

        return { success: true, message: '스크랩되었습니다.' };
    } catch (error) {
        console.error('북마크 추가 오류:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 정책 북마크 삭제
 * @param {string} userId - 사용자 ID
 * @param {string} policyId - 정책 ID
 */
export async function removeBookmark(userId, policyId) {
    try {
        const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
        const q = query(bookmarksRef, where('policy_id', '==', policyId));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return { success: false, error: '북마크를 찾을 수 없습니다.' };
        }

        // 해당 북마크 삭제
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        return { success: true, message: '스크랩이 해제되었습니다.' };
    } catch (error) {
        console.error('북마크 삭제 오류:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 사용자 북마크 목록 조회
 * @param {string} userId - 사용자 ID
 */
export async function getUserBookmarks(userId) {
    try {
        const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
        const q = query(bookmarksRef, orderBy('bookmarked_at', 'desc'));
        const snapshot = await getDocs(q);

        const bookmarks = [];
        snapshot.forEach((doc) => {
            bookmarks.push({
                id: doc.id,
                ...doc.data(),
                bookmarked_at: doc.data().bookmarked_at?.toDate?.()?.toISOString()
            });
        });

        return { success: true, bookmarks };
    } catch (error) {
        console.error('북마크 조회 오류:', error);
        return { success: false, error: error.message, bookmarks: [] };
    }
}

/**
 * 북마크 여부 확인
 * @param {string} userId - 사용자 ID
 * @param {string} policyId - 정책 ID
 */
export async function isBookmarked(userId, policyId) {
    try {
        const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
        const q = query(bookmarksRef, where('policy_id', '==', policyId));
        const snapshot = await getDocs(q);

        return { success: true, isBookmarked: !snapshot.empty };
    } catch (error) {
        console.error('북마크 확인 오류:', error);
        return { success: false, isBookmarked: false };
    }
}
