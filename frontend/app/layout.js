import './globals.css'
import { Providers } from '../src/components/Providers'

export const metadata = {
    title: '정책 아카이브 | 정부 지원사업 통합 검색',
    description: '정부 지원사업, 창업지원, 청년정책, 외국인 정책 등 정부 지원 정보를 한눈에 검색하세요.',
    keywords: '정부지원사업, 창업지원, 중소기업, 소상공인, 청년정책, 외국인정책, 보조금',
}

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            </head>
            <body className="font-body">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
