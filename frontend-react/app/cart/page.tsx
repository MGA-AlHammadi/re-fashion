"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCart, updateCartQuantity, removeFromCart } from "../services/api";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchCart();
      setItems(data);
      setError(null);
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") {
        router.push('/login');
        return;
      }
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function changeQuantity(productId: number, q: number) {
    if (q < 1) {
      // Wenn Menge 0 wird, entfernen
      removeItem(productId);
      return;
    }
    try {
      await updateCartQuantity(productId, q);
      // Direkt im State aktualisieren für sofortiges Feedback
      setItems(items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: q }
          : item
      ));
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      console.error('Update quantity error:', e);
      alert('Fehler beim Aktualisieren');
    }
  }

  async function removeItem(productId: number) {
    try {
      await removeFromCart(productId);
      const updatedItems = items.filter(item => item.product.id !== productId);
      setItems(updatedItems);
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { 
        router.push('/login');
        return; 
      }
      console.error('Remove error:', e);
      alert('Fehler beim Entfernen: ' + (e.message || 'Unbekannter Fehler'));
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Lade Warenkorb…</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Warenkorb</h1>
            <p className="text-gray-600 text-lg">Deine ausgewählten Produkte</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-100 rounded-full -ml-24 -mb-24 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <svg className="w-20 h-20 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Dein Warenkorb ist leer</h2>
              <p className="text-gray-600 text-lg mb-2">Zeit, tolle Produkte zu entdecken!</p>
              <p className="text-sm text-gray-500 mb-10 max-w-md mx-auto">Durchsuche unsere nachhaltigen Kollektionen und finde deine Lieblingsstücke für einen bewussten Stil</p>
              
              {/* Multiple CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/collections" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Weiter einkaufen
                </Link>
                
                <Link 
                  href="/favorites" 
                  className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Meine Favoriten
                </Link>
              </div>
              
              {/* Quick links */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Beliebte Kategorien:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/collections/women" className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium">Damen</Link>
                  <Link href="/collections/men" className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-sm font-medium">Herren</Link>
                  <Link href="/collections/shoes" className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium">Schuhe</Link>
                  <Link href="/collections/kids" className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium">Kinder</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Warenkorb</h1>
          <p className="text-gray-600 text-lg">{items.length} {items.length === 1 ? 'Produkt' : 'Produkte'} in deinem Warenkorb</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((it: any) => {
              // Get first image from imageUrls or fallback
              const imageUrls = it.product.imageUrls || it.product.imageUrl || '';
              const firstImage = imageUrls ? imageUrls.split('|||')[0] : null;
              
              return (
              <div key={it.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group">
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <Link href={`/products/${it.product.id}`} className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={it.product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${it.product.id}`} className="block">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">{it.product.title}</h3>
                    </Link>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">{Number(it.product.price).toFixed(2)} €</p>
                    {it.product.category && (
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-semibold rounded-full">
                        {typeof it.product.category === 'object' ? it.product.category.name : it.product.category}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-4">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
                      <button 
                        onClick={() => changeQuantity(it.product.id, it.quantity - 1)} 
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-xl font-bold text-gray-900 w-12 text-center">{it.quantity}</span>
                      <button 
                        onClick={() => changeQuantity(it.product.id, it.quantity + 1)} 
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(it.product.id)} 
                      className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all font-semibold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Entfernen</span>
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Zusammenfassung</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Artikel ({items.reduce((sum, it) => sum + it.quantity, 0)})</span>
                  <span className="font-semibold">{items.reduce((sum, it) => sum + (it.quantity * it.product.price), 0).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Versand</span>
                  <span className="font-semibold text-emerald-600">Kostenlos</span>
                </div>
                <div className="border-t-2 border-gray-100 pt-4 flex justify-between text-xl font-bold">
                  <span>Gesamt</span>
                  <span className="text-emerald-600">{items.reduce((sum, it) => sum + (it.quantity * it.product.price), 0).toFixed(2)} €</span>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl mb-4">
                Zur Kasse
              </button>
              
              <Link 
                href="/collections" 
                className="block text-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                ← Weiter einkaufen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
