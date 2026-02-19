'use client';

import Link from 'next/link';

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-md-surface">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-md-surface-container-low shadow-elevation-2">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center h-16 gap-3">
                        <Link href="/" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-md-on-surface/[0.08] transition">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className="text-md-on-surface">
                                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                            </svg>
                        </Link>
                        <h1 className="font-display text-title-lg text-md-on-surface">이용안내</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* 서비스 소개 */}
                <section className="bg-md-surface-container rounded-2xl p-6 shadow-elevation-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-md-primary rounded-lg flex items-center justify-center text-md-on-primary text-xl">🏛️</div>
                        <h2 className="font-display text-title-md text-md-on-surface">서비스 소개</h2>
                    </div>
                    <p className="text-body-lg text-md-on-surface-variant leading-relaxed">
                        <strong className="text-md-on-surface">정책 아카이브</strong>는 정부·지자체에서 운영하는 각종 지원사업 정보를 한눈에 모아 보여주는 통합 검색 서비스입니다.
                        창업지원, 고용·인력, 생활·복지, 외국인 지원, 금융·세제 등 다양한 분야의 정책을 빠르게 검색하고 비교할 수 있습니다.
                    </p>
                </section>

                {/* 주요 기능 */}
                <section className="bg-md-surface-container rounded-2xl p-6 shadow-elevation-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-md-secondary-container rounded-lg flex items-center justify-center text-md-on-secondary-container text-xl">⚡</div>
                        <h2 className="font-display text-title-md text-md-on-surface">주요 기능</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { icon: '🔍', title: '통합 검색', desc: '정책명, 기관명, 요약으로 원하는 정책을 빠르게 찾을 수 있습니다.' },
                            { icon: '📂', title: '분야별 탐색', desc: '15개 세부 카테고리로 분류된 정책을 탐색할 수 있습니다.' },
                            { icon: '⏰', title: '마감임박 알림', desc: '마감 2주 이내인 정책을 한눈에 확인할 수 있습니다.' },
                            { icon: '🔖', title: '필터링', desc: '접수상태, 지역, 신용평가 필수 여부 등 다양한 조건으로 필터링합니다.' },
                        ].map((item) => (
                            <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-md-surface-container-low">
                                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                                <div>
                                    <p className="text-label-lg text-md-on-surface">{item.title}</p>
                                    <p className="text-body-sm text-md-on-surface-variant">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 이용 방법 */}
                <section className="bg-md-surface-container rounded-2xl p-6 shadow-elevation-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-md-tertiary-container rounded-lg flex items-center justify-center text-md-on-tertiary-container text-xl">📖</div>
                        <h2 className="font-display text-title-md text-md-on-surface">이용 방법</h2>
                    </div>
                    <ol className="space-y-4">
                        {[
                            { step: 1, title: '홈 화면에서 분야 선택', desc: '관심 있는 정책 분야를 클릭하면 해당 분야의 정책만 필터링됩니다.' },
                            { step: 2, title: '검색으로 빠르게 찾기', desc: '상단 검색 바 또는 정책 목록 위의 검색 입력란에 키워드를 입력하세요.' },
                            { step: 3, title: '사이드바 필터 활용', desc: '접수 상태(접수중/마감임박), 지역, 신용평가 필수 여부 등으로 정밀 필터링이 가능합니다.' },
                            { step: 4, title: '정책 상세 확인', desc: '정책을 클릭하면 상세 내용과 신청 링크를 확인할 수 있습니다.' },
                        ].map((item) => (
                            <li key={item.step} className="flex gap-4 items-start">
                                <span className="w-8 h-8 bg-md-primary text-md-on-primary rounded-full flex items-center justify-center text-label-lg flex-shrink-0">
                                    {item.step}
                                </span>
                                <div>
                                    <p className="text-label-lg text-md-on-surface">{item.title}</p>
                                    <p className="text-body-md text-md-on-surface-variant">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* 문의 및 안내 */}
                <section className="bg-md-surface-container rounded-2xl p-6 shadow-elevation-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-md-error-container rounded-lg flex items-center justify-center text-md-on-error-container text-xl">📞</div>
                        <h2 className="font-display text-title-md text-md-on-surface">문의 안내</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-md-surface-container-low">
                            <span className="text-xl">☎️</span>
                            <div>
                                <p className="text-label-lg text-md-on-surface">정부 정책 상담</p>
                                <p className="text-body-md text-md-primary font-medium">국번 없이 110</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-md-surface-container-low">
                            <span className="text-xl">🌐</span>
                            <div>
                                <p className="text-label-lg text-md-on-surface">외국인 종합안내</p>
                                <p className="text-body-md text-md-primary font-medium">1345 (다국어 상담)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 홈으로 돌아가기 */}
                <div className="text-center pb-8">
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-md-primary text-md-on-primary rounded-full text-label-lg hover:shadow-elevation-2 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Z" />
                        </svg>
                        홈으로 돌아가기
                    </Link>
                </div>
            </main>
        </div>
    );
}
