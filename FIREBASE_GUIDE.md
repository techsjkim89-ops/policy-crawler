# Firebase Firestore 설정 및 크롤링 데이터 적재 가이드

## 📋 목차
1. [Firebase 프로젝트 설정](#1-firebase-프로젝트-설정)
2. [환경변수 설정](#2-환경변수-설정)
3. [Firestore 보안 규칙](#3-firestore-보안-규칙)
4. [데이터 적재 방법](#4-데이터-적재-방법)
5. [신용평가 키워드 감지](#5-신용평가-키워드-감지)

---

## 1. Firebase 프로젝트 설정

### 1.1 Firebase Console에서 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: `policy-crawler-prod`)
4. Google Analytics 설정 (선택사항)

### 1.2 Firestore 데이터베이스 생성
1. 좌측 메뉴 **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **프로덕션 모드**로 시작 (나중에 규칙 수정)
4. 서버 위치 선택 (예: `asia-northeast3` - 서울)

### 1.3 서비스 계정 키 다운로드 (서버용)
1. **프로젝트 설정** (톱니바퀴) > **서비스 계정** 탭
2. **새 비공개 키 생성** 클릭
3. JSON 파일 다운로드 → `server/serviceAccountKey.json`으로 저장
4. ⚠️ **이 파일은 절대 Git에 커밋하지 마세요!**

---

## 2. 환경변수 설정

### 2.1 프론트엔드 (.env.local)
```bash
# frontend/.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2.2 백엔드 서버 (.env)
```bash
# server/.env
# 방법 1: 서비스 계정 키 파일 경로
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# 방법 2: JSON 문자열 (Docker/클라우드 배포용)
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

---

## 3. Firestore 보안 규칙

```javascript
// Firestore 콘솔 > 규칙 탭에 입력
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // policies 컬렉션 - 읽기는 모두 허용, 쓰기는 서버만
    match /policies/{policyId} {
      allow read: if true;
      allow write: if false; // Admin SDK로만 쓰기
    }
    
    // users 컬렉션 - 본인만 접근
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // bookmarks 서브컬렉션
      match /bookmarks/{bookmarkId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // crawl_logs - 서버 전용
    match /crawl_logs/{logId} {
      allow read, write: if false;
    }
  }
}
```

---

## 4. 데이터 적재 방법

### 4.1 크롤링 후 자동 적재
```javascript
const { savePolicyToFirestore } = require('./firestoreLoader');

// 크롤링된 정책 데이터
const policyData = {
    title: '2026년 외국인근로자 고용허가제 신규 입국자 모집',
    organization: '고용노동부',
    category: 'employment',
    start_date: '2026-01-15',
    end_date: '2026-02-28',
    content_ko: '고용허가제를 통한 신규 입국자 모집...',
    summary_ko: '제조업, 농축산업, 어업 분야 외국인근로자 모집',
    target_visa: ['E-9'],
    target_region: ['all'],
    original_url: 'https://www.eps.go.kr/notice/12345',
    source_site: 'eps'
};

// Firestore에 저장 (신용평가 자동 감지 포함)
const result = await savePolicyToFirestore(policyData);
console.log(result);
// { success: true, docId: 'abc123', creditRequired: true }
```

### 4.2 일괄 적재
```javascript
const { savePoliciesBatch } = require('./firestoreLoader');

const policies = [policy1, policy2, policy3];
const result = await savePoliciesBatch(policies);
// { success: true, saved: 2, skipped: 1, failed: 0, total: 3 }
```

---

## 5. 신용평가 키워드 감지

### 5.1 자동 감지 로직
`creditDetector.js` 모듈이 공고문 텍스트를 분석하여 자동 판별:

```javascript
const { analyzeCreditRequirement } = require('./creditDetector');

const result = analyzeCreditRequirement(
    '신용평가등급확인서를 제출해야 합니다. 신용등급 7등급 이하...',
    '창업지원금 신청 안내',
    'business'
);

// 결과:
// {
//   isRequired: true,
//   confidence: 'high',
//   matchedKeywords: ['신용평가등급확인서', '신용등급 7등급'],
//   reason: '2개 신용평가 키워드 발견'
// }
```

### 5.2 감지 키워드 목록
- 신용평가등급확인서, 신용등급확인서
- 신용평가 필수, 신용등급 제출
- 나이스평가정보, KCB
- 신용보증기금, 기술보증기금

---

## 📁 파일 구조

```
server/
├── firebaseAdmin.js       # Firebase Admin SDK 설정
├── creditDetector.js      # 신용평가 키워드 감지
├── firestoreLoader.js     # Firestore 데이터 적재
├── serviceAccountKey.json # 서비스 계정 키 (Git 제외)
└── .env                   # 환경변수

frontend/
└── src/lib/
    ├── firebaseConfig.js  # Firebase 클라이언트 설정
    ├── firestoreSchema.js # 데이터 구조 정의
    └── policyApi.js       # 조회/북마크 API
```
