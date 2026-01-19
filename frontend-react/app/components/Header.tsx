"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { fetchProfile } from '../services/api';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Check if user is logged in and try to load profile
    const token = globalThis.window !== undefined && globalThis.window ? globalThis.window.localStorage.getItem('token') : null;
    const logged = !!token;
    setIsLoggedIn(logged);
    if (logged) {
      fetchProfile()
        .then((u: any) => {
          setProfileImageUrl(u?.profileImageUrl ?? null);
        })
        .catch(() => {
          // ignore profile load errors (e.g., expired token)
          setProfileImageUrl(null);
        });
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    if (isLoggedIn) {
      router.push(path);
    } else {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    // Force page reload to clear all state
    window.location.href = '/login';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to collections page with search parameter
      router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-3 gap-4">
        {/* LEFT SIDE — Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hidden sm:inline">
            Re-Fashion
          </span>
        </Link>

        {/* CENTER — Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl" ref={searchRef}>
          <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Suche nach Produkten..."
              className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl bg-gray-50 transition-all text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none ${
                isSearchFocused 
                  ? 'border-green-400 bg-white shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            />
            <svg 
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isSearchFocused ? 'text-green-600' : 'text-gray-400'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* RIGHT SIDE — Icons */}
        <div className="flex items-center gap-1">
          {/* Favorite */}
          <button
            type="button"
            aria-label="Favoriten"
            onClick={() => handleNavigation('/favorites')}
            className="p-2 rounded-xl hover:bg-green-50 text-green-600 hover:text-green-700 transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Messages */}
          <button
            type="button"
            aria-label="Nachrichten"
            onClick={() => handleNavigation('/messages')}
            className="p-2 rounded-xl hover:bg-green-50 text-green-600 hover:text-green-700 transition-all hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Warenkorb"
            onClick={() => handleNavigation('/cart')}
            className="p-2 rounded-xl hover:bg-green-50 text-green-600 hover:text-green-700 transition-all hover:scale-105 relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>

          {/* Profile */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              aria-label="Profil"
              onClick={() => {
                if (isLoggedIn) {
                  setShowProfileMenu(!showProfileMenu);
                } else {
                  router.push('/login');
                }
              }}
              className="p-1 rounded-xl hover:bg-green-50 text-green-600 hover:text-green-700 transition-all hover:scale-105"
            >
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profilbild"
                  className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                    setProfileImageUrl(null);
                  }}
                />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </button>

            {/* Profile Dropdown Menu */}
            {isLoggedIn && showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors text-sm font-medium"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors text-sm font-medium"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Einstellungen
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-left text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}