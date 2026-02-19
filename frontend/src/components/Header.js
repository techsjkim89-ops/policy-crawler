'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Header({ onSearch, closingSoon, onClosingSoon }) {
    const { user, logout, loading } = useAuth();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const pathname = usePathname();

    const searchRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const handleLogout = async () => {
        try { await logout(); setProfileMenuOpen(false); }
        catch (error) { console.error('Logout failed', error); }
    };

    return (
        <>
            <header className={`sticky top-0 z-40 transition-all duration-medium2 ease-standard ${scrolled
                ? 'bg-md-surface-container-low shadow-elevation-2'
                : 'bg-md-surface'
                }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => window.location.href = '/'}>
                            <div className="w-9 h-9 bg-md-primary rounded-lg flex items-center justify-center text-md-on-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
                                    <path d="M200-120v-560h160v120h400v320h-80v120h-80v-120H360v120H200Zm80-80h80v-80h240v80h80v-240H280v240Zm80-320h160v-160H360v160Zm-80 320v-240 240Z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-display text-title-md text-md-on-surface">
                                    정책 아카이브
                                </h1>
                                <p className="text-label-sm text-md-on-surface-variant -mt-0.5 hidden sm:block">
                                    Government Policy Archive
                                </p>
                            </div>
                        </div>

                        {/* Navigation Links (Desktop) */}
                        <nav className="hidden md:flex items-center gap-1 mx-6">
                            <Link href="/" className={`relative px-4 py-2 text-label-lg rounded-full transition-colors ${pathname === '/' ? 'text-md-primary' : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-primary/[0.08]'
                                }`}>
                                홈
                                {pathname === '/' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-md-primary rounded-full" />
                                )}
                            </Link>
                            <Link href="/policies" className={`relative px-4 py-2 text-label-lg rounded-full transition-colors ${pathname === '/policies' ? 'text-md-primary' : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-primary/[0.08]'
                                }`}>
                                전체 정책
                                {pathname === '/policies' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-md-primary rounded-full" />
                                )}
                            </Link>
                            <button
                                onClick={() => { onClosingSoon?.(); }}
                                className={`relative px-4 py-2 text-label-lg rounded-full transition-colors flex items-center gap-1.5 ${closingSoon
                                        ? 'bg-md-error-container text-md-on-error-container'
                                        : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-primary/[0.08]'
                                    }`}
                            >
                                ⏰ 마감임박
                                <span className="w-2 h-2 bg-md-error rounded-full animate-pulse"></span>
                            </button>
                            <Link href="/guide" className={`relative px-4 py-2 text-label-lg rounded-full transition-colors ${pathname === '/guide' ? 'text-md-primary' : 'text-md-on-surface-variant hover:text-md-on-surface hover:bg-md-primary/[0.08]'
                                }`}>
                                이용안내
                                {pathname === '/guide' && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-md-primary rounded-full" />
                                )}
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                            {/* Search (Desktop) */}
                            <form onSubmit={handleSubmit} className="hidden lg:block">
                                <div className={`flex items-center gap-3 px-4 h-10 rounded-full transition-all duration-medium2 ease-standard w-60 ${searchOpen
                                    ? 'bg-md-surface-container-highest shadow-elevation-2 ring-1 ring-md-primary'
                                    : 'bg-md-surface-container-high hover:shadow-elevation-1'
                                    }`}>
                                    <svg className="w-5 h-5 text-md-on-surface-variant flex-shrink-0" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                                        <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                    </svg>
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setSearchOpen(true)}
                                        onBlur={() => setSearchOpen(false)}
                                        placeholder="정책 검색"
                                        className="flex-1 bg-transparent text-body-md text-md-on-surface placeholder:text-md-on-surface-variant outline-none"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => { setSearchQuery(''); onSearch?.(''); }}
                                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-md-on-surface/[0.08] transition"
                                            aria-label="검색어 지우기"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor" className="text-md-on-surface-variant">
                                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </form>

                            {/* Mobile search toggle */}
                            <button
                                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-md-on-surface/[0.08] transition"
                                onClick={() => setSearchOpen(!searchOpen)}
                                aria-label="검색"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className="text-md-on-surface-variant">
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                </svg>
                            </button>

                            {/* Mobile hamburger menu */}
                            <button
                                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-md-on-surface/[0.08] transition"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="메뉴"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className="text-md-on-surface-variant">
                                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                                </svg>
                            </button>

                            {/* Login / Profile */}
                            {!loading && (
                                user ? (
                                    <div className="relative" ref={profileRef}>
                                        <button
                                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                            className="w-10 h-10 rounded-full overflow-hidden border border-md-outline-variant hover:ring-2 hover:ring-md-primary transition-all p-0.5"
                                            aria-label="프로필 메뉴"
                                        >
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-md-primary-container text-md-on-primary-container flex items-center justify-center font-bold text-lg rounded-full">
                                                    {user.email?.[0].toUpperCase()}
                                                </div>
                                            )}
                                        </button>

                                        {profileMenuOpen && (
                                            <div className="absolute right-0 top-12 w-60 bg-md-surface-container rounded-xl shadow-elevation-2 py-2 animate-fadeIn origin-top-right border border-md-outline-variant">
                                                <div className="px-4 py-3 border-b border-md-outline-variant/50">
                                                    <p className="text-body-md text-md-on-surface font-medium truncate">{user.displayName || '사용자'}</p>
                                                    <p className="text-body-sm text-md-on-surface-variant truncate">{user.email}</p>
                                                </div>
                                                <Link href="/mypage" className="flex items-center gap-3 px-4 py-3 hover:bg-md-on-surface/[0.08] transition-colors">
                                                    <span className="text-md-on-surface-variant">👤</span>
                                                    <span className="text-body-md text-md-on-surface">마이페이지</span>
                                                </Link>
                                                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-md-on-surface/[0.08] transition-colors">
                                                    <span className="text-md-on-surface-variant">⚙️</span>
                                                    <span className="text-body-md text-md-on-surface">관리자</span>
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-md-on-surface/[0.08] transition-colors text-left"
                                                >
                                                    <span className="text-md-on-surface-variant">👋</span>
                                                    <span className="text-body-md text-md-on-surface">로그아웃</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setLoginModalOpen(true)}
                                        className="h-10 px-5 rounded-full bg-md-primary text-md-on-primary text-label-lg hover:shadow-elevation-1 transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                                            <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                                        </svg>
                                        <span className="hidden sm:inline">로그인</span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-md-outline-variant bg-md-surface-container-low animate-fadeIn">
                        <nav className="max-w-7xl mx-auto px-4 py-2">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/' ? 'bg-md-primary/[0.12] border-l-[3px] border-md-primary' : 'hover:bg-md-primary/[0.08]'
                                    }`}>
                                <span>🏠</span>
                                <span className={`text-body-lg ${pathname === '/' ? 'text-md-primary font-medium' : 'text-md-on-surface'}`}>홈</span>
                            </Link>
                            <Link href="/policies" onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/policies' ? 'bg-md-primary/[0.12] border-l-[3px] border-md-primary' : 'hover:bg-md-primary/[0.08]'
                                    }`}>
                                <span>📋</span>
                                <span className={`text-body-lg ${pathname === '/policies' ? 'text-md-primary font-medium' : 'text-md-on-surface'}`}>전체 정책</span>
                            </Link>
                            <button onClick={() => { onClosingSoon?.(); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${closingSoon
                                    ? 'bg-md-error-container text-md-on-error-container'
                                    : 'hover:bg-md-primary/[0.08]'
                                    }`}>
                                <span>⏰</span>
                                <span className="text-body-lg">마감임박</span>
                                <span className="w-2 h-2 bg-md-error rounded-full animate-pulse"></span>
                            </button>
                            <Link href="/guide" onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/guide' ? 'bg-md-primary/[0.12] border-l-[3px] border-md-primary' : 'hover:bg-md-primary/[0.08]'
                                    }`}>
                                <span>📖</span>
                                <span className={`text-body-lg ${pathname === '/guide' ? 'text-md-primary font-medium' : 'text-md-on-surface'}`}>이용안내</span>
                            </Link>
                        </nav>
                    </div>
                )}

                {/* Mobile Search Drawer */}
                {searchOpen && (
                    <div className="lg:hidden border-t border-md-outline-variant px-4 py-3 bg-md-surface-container-low animate-fadeIn">
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-3 px-4 h-12 bg-md-surface-container-highest rounded-full shadow-elevation-1">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor" className="text-md-on-surface-variant flex-shrink-0">
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="정책을 검색하세요"
                                    className="flex-1 bg-transparent text-body-lg outline-none"
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => { setSearchQuery(''); onSearch?.(''); }}
                                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-md-on-surface/[0.08]"
                                        aria-label="검색어 지우기"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor" className="text-md-on-surface-variant">
                                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </header>

            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
}
