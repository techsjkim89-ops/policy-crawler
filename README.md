# 🌏 외국인 정책 아카이브 (Foreign Policy Archive)

비즈인포(bizinfo.go.kr) 스타일의 외국인 지원 정책 아카이빙 플랫폼입니다.

## ✨ 주요 기능

### 📋 대시보드
- **검색 바**: 정책명, 기관명, 비자 유형으로 빠른 검색
- **카테고리 그리드**: 비자, 취업, 주거, 의료, 법률, 교육, 생활, 창업
- **사이드바 필터**: 접수 상태, 대상 비자, 지역별 필터링
- **정책 카드**: 상태 배지(접수중/마감임박/접수예정), D-Day, 조회수

### 🌍 다국어 지원
- 각 정책에 영어(EN), 베트남어(VI), 태국어(TH) 번역 토글

### 📌 스크랩 기능
- 관심 정책 북마크/스크랩
- 로컬스토리지에 저장

### 📖 상세 보기
- 정책 요약, 지원 대상, 신청 방법
- 공고문 원본 보기 링크

## 🚀 빠른 시작

```bash
cd "c:\antigravity output\policy-crawler\frontend"
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 📂 프로젝트 구조

```
frontend/
├── app/
│   ├── globals.css       # Tailwind 전역 스타일
│   ├── layout.js         # 레이아웃
│   ├── page.js           # 메인 대시보드
│   └── admin/
│       └── page.js       # 관리자 페이지
├── src/
│   └── data/
│       └── policies.js   # 데이터 & Firebase 스키마
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 14 |
| Styling | Tailwind CSS |
| 상태관리 | React useState/useMemo |
| DB (예정) | Firebase Firestore |

## 📊 Firebase 데이터 구조

```javascript
// policies 컬렉션
{
  title: "정책명",
  organization: "소관기관",
  category: "visa|employment|housing|...",
  status: "open|closing|upcoming|closed",
  startDate: "2026-01-01",
  endDate: "2026-02-28",
  targetVisa: ["E-9", "E-7"],
  targetRegion: ["all"],
  summary: "정책 요약",
  originalUrl: "https://...",
  views: 1000,
  translations: {
    en: { title: "", summary: "" },
    vi: { title: "", summary: "" },
    th: { title: "", summary: "" }
  }
}
```

## 📄 라이선스

MIT License
