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

  if (loading) return <div className="p-6">Lade Favoriten…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl mb-4">Favoriten</h1>
        <div className="border rounded p-8 bg-gray-50">
          <div className="text-4xl">💚</div>
          <p className="mt-4">Du hast noch keine Favoriten.</p>
          <p className="mt-2 text-sm text-gray-600">Stöbere in unseren Kollektionen und merke dir Lieblingsteile.</p>
          <div className="mt-4">
            <Link href="/collections" className="inline-block px-4 py-2 bg-green-600 text-white rounded">Zu den Kollektionen</Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
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

      <h1 className="text-2xl mb-6">Favoriten</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((p: any) => (
          <div key={p.id} className="flex flex-col sm:flex-row border rounded overflow-hidden bg-white shadow-sm">
            <div className="w-full sm:w-36 h-36 bg-gray-100 flex items-center justify-center">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" />
              ) : (
                <div className="text-gray-400">Kein Bild</div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/products/${p.id}`} className="font-semibold text-green-700 text-lg">{p.title}</Link>
                <div className="text-sm text-gray-600 mt-1">{Number(p.price).toFixed(2)} €</div>
                {p.description && <div className="text-sm text-gray-500 mt-2 line-clamp-2">{p.description}</div>}
              </div>
              <div className="mt-4 flex items-center justify-end space-x-2">
                <Link href={`/products/${p.id}`} className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm">Ansehen</Link>
                <button onClick={() => remove(p.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Entfernen</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
