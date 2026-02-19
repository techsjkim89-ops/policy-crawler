'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
    const { loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ESC 키 + 바디 스크롤 잠금
    useEffect(() => {
        if (!isOpen) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
            onClose();
        } catch (err) {
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
        >
            <div
                className="bg-md-surface-container-low w-full max-w-sm rounded-[28px] shadow-elevation-3 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 상단 아이콘 영역 */}
                <div className="pt-8 pb-2 flex justify-center">
                    <div className="w-14 h-14 bg-md-primary-container rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" className="text-md-on-primary-container" fill="currentColor">
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
                        </svg>
                    </div>
                </div>

                {/* 콘텐츠 */}
                <div className="px-6 pb-2">
                    <h2 id="login-title" className="font-display text-headline-sm text-md-on-surface text-center mb-2">
                        로그인
                    </h2>
                    <p className="text-body-md text-md-on-surface-variant text-center leading-relaxed">
                        관심 분야를 설정하고<br />맞춤 정책 추천을 받아보세요.
                    </p>
                </div>

                {/* 에러 */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-md-error-container rounded-lg flex items-center gap-2 animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" className="text-md-error flex-shrink-0" fill="currentColor">
                            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                        </svg>
                        <p className="text-body-sm text-md-on-error-container">{error}</p>
                    </div>
                )}

                {/* 로그인 버튼 영역 */}
                <div className="px-6 pt-6 pb-2">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 h-12 px-6
                                   bg-md-surface border border-md-outline rounded-full
                                   text-body-lg text-md-on-surface font-medium
                                   hover:bg-md-surface-container-high hover:shadow-elevation-1
                                   focus-visible:ring-2 focus-visible:ring-md-primary
                                   transition-all duration-medium2
                                   disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-md-on-surface border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {/* Google 로고 */}
                                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Google 계정으로 계속하기</span>
                            </>
                        )}
                    </button>
                </div>

                {/* 하단 버튼 */}
                <div className="px-6 pt-2 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full h-10 text-label-lg text-md-primary font-medium
                                   rounded-full hover:bg-md-primary/[0.08] transition-colors duration-short4"
                    >
                        나중에 하기
                    </button>
                </div>
            </div>
        </div>
    );
}
