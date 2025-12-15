"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SellButton() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  if (!loggedIn) return null;

  return (
    <div className="mb-6 text-right">
      <Link href="/products/upload" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
        Verkaufen
      </Link>
    </div>
  );
}
