'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
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
    router.push('/');
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 border-b-2 border-green-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* LEFT SIDE — Logo */}
        <div>
          <Link href="/" className="text-xl font-bold text-green-700 hover:text-green-800 transition-colors">
            Re-Fashion
          </Link>
        </div>

        {/* CENTER — Search */}
        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="Suche nach nachhaltiger Kleidung..."
            className="w-full p-2 border-2 border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black placeholder-gray-500"
          />
        </div>

        {/* RIGHT SIDE — Icons */}
        <div className="flex items-center space-x-4">
          {/* Favorite */}
          <button
            type="button"
            aria-label="Favoriten"
            onClick={() => handleNavigation('/favorites')}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Messages */}
          <button
            type="button"
            aria-label="Nachrichten"
            onClick={() => handleNavigation('/messages')}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Warenkorb"
            onClick={() => handleNavigation('/cart')}
            className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 relative"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {/* Cart item count badge - optional, can be shown when there are items */}
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              3
            </span> */}
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
                  handleNavigation('/profile');
                }
              }}
              className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Profile Dropdown Menu */}
            {isLoggedIn && showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-green-200 py-2 z-50">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Einstellungen
                </Link>
                <hr className="my-1 border-green-100" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                >
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