'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleNavigation = (path: string) => {
    if (isLoggedIn) {
      router.push(path);
    } else {
      router.push('/login');
    }
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

          {/* Profile */}
          <button
            type="button"
            aria-label="Profil"
            onClick={() => handleNavigation('/profile')}
            className="bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded text-green-600 hover:text-green-800 transition-colors"
          >
            🧑
          </button>
        </div>
      </div>
    </header>
  );
}