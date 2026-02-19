'use client';

/**
 * M3 HeroSection — Primary gradient + 핵심 메트릭 + CTA
 */
export default function HeroSection({ stats = {} }) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-md-primary via-[#1A73E8] to-[#185ABC]">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-14">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    {/* 텍스트 */}
                    <div className="text-white">
                        <h2 className="font-display text-display-sm sm:text-display-md leading-tight mb-3">
                            외국인을 위한<br />
                            <span className="text-[#A8C7FA]">정부 지원사업</span> 통합 검색
                        </h2>
                        <p className="text-body-lg text-white/80 max-w-md leading-relaxed">
                            창업·취업·비자·복지 등 15개 분야의 정부 지원정책을<br className="hidden sm:block" />
                            한곳에서 검색하고 비교하세요.
                        </p>
                    </div>

                    {/* 메트릭 카드 */}
                    <div className="flex gap-3 sm:gap-4">
                        <MetricChip value={stats.total || 0} label="전체 정책" icon="📋" />
                        <MetricChip value={stats.byStatus?.open || 0} label="접수중" icon="✅" highlight />
                        <MetricChip value={stats.newCount || 0} label="신규" icon="🆕" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function MetricChip({ value, label, icon, highlight = false }) {
    return (
        <div className={`flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl transition-transform hover:scale-105 ${highlight
            ? 'bg-white/25 backdrop-blur-sm ring-1 ring-white/30'
            : 'bg-white/15 backdrop-blur-sm'
            }`}>
            <span className="text-lg mb-0.5">{icon}</span>
            <span className="text-headline-sm sm:text-headline-md text-white font-display font-medium">
                {typeof value === 'number' && value > 999 ? `${(value / 1000).toFixed(1)}k` : value}
            </span>
            <span className="text-label-sm text-white/70">{label}</span>
        </div>
    );
}
