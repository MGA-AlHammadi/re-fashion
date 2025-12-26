"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFavorites, removeFavorite } from "../services/api";
import Link from "next/link";

export default function FavoritesPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ show: true, message, type });
  }

  async function load() {
    setLoading(true);
    try {
      const data = await fetchFavorites();
      setItems(data);
      setError(null);
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  async function remove(id: number) {
    try {
      await removeFavorite(id);
      // Erst die Liste aktualisieren, dann Toast zeigen
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      showToast('✅ Aus Favoriten entfernt', 'success');
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { 
        router.push('/login'); 
        return; 
      }
      console.error('Remove favorite error:', e);
      showToast('❌ Fehler beim Entfernen: ' + (e.message || 'Unbekannter Fehler'), 'error');
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-600 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Lade Favoriten…</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fehler</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );
  if (items.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Favoriten</h1>
            <p className="text-gray-600 text-lg">Deine geliebten Produkte</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Du hast noch keine Favoriten</h2>
            <p className="text-gray-600 mb-2">Entdecke tolle Produkte und markiere sie als Favoriten!</p>
            <p className="text-sm text-gray-500 mb-8">Stöbere in unseren Kollektionen und merke dir deine Lieblingsteile</p>
            <Link 
              href="/collections" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Zu den Kollektionen
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 py-12 px-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in-right">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm transform transition-all duration-500 ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-semibold text-lg">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: '', type: 'success' })}
              className="ml-4 hover:scale-110 transition-transform"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">Favoriten</h1>
          <p className="text-gray-600 text-lg">{items.length} {items.length === 1 ? 'Produkt' : 'Produkte'} auf deiner Wunschliste</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              {/* Product Image */}
              <Link href={`/products/${p.id}`} className="block relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-full shadow-lg">
                  {Number(p.price).toFixed(2)} €
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-6">
                <Link href={`/products/${p.id}`}>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose-600 transition-colors mb-2 line-clamp-2 min-h-[3.5rem]">
                    {p.title}
                  </h3>
                </Link>
                
                {p.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
                )}

                {p.category && (
                  <span className="inline-block mb-4 px-3 py-1 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 text-xs font-semibold rounded-full">
                    {typeof p.category === 'object' ? p.category.name : p.category}
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Link 
                    href={`/products/${p.id}`} 
                    className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Ansehen
                  </Link>
                  <button 
                    onClick={() => remove(p.id)} 
                    className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Aus Favoriten entfernen"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
