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
            🌱 Re-Fashion
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
        <div className="flex items-center space-x-6 text-2xl">
          {/* Favorite */}
          <button
            type="button"
            aria-label="Favoriten"
            onClick={() => handleNavigation('/favorites')}
            className="bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded text-green-600 hover:text-green-800 transition-colors"
          >
            💚
          </button>

          {/* Messages */}
          <button
            type="button"
            aria-label="Nachrichten"
            onClick={() => handleNavigation('/messages')}
            className="bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded text-green-600 hover:text-green-800 transition-colors"
          >
            💬
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Warenkorb"
            onClick={() => handleNavigation('/cart')}
            className="bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded text-green-600 hover:text-green-800 transition-colors"
          >
            🛒
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
              className="bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded text-green-600 hover:text-green-800 transition-colors"
            >
              🧑
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