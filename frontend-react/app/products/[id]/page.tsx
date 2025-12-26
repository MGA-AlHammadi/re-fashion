"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { fetchProduct, addFavorite, addToCart, fetchProfile, deleteProduct } from "../../services/api";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { load(); }, [id]);

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
      const p = await fetchProduct(id);
      setProduct(p);
      try {
        const prof = await fetchProfile();
        setProfile(prof);
      } catch (e) {
        console.error('Failed to fetch profile:', e);
        setProfile(null);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  async function handleAddFavorite() {
    try {
      await addFavorite(id);
      showToast('❤️ Zu Favoriten hinzugefügt!', 'success');
    } catch (e: any) {
      if (e?.message === 'NO_TOKEN') { router.push('/login'); return; }
      showToast('Fehler beim Hinzufügen zu Favoriten', 'error');
    }
  }

  async function handleAddCart() {
    try {
      await addToCart(id, 1);
      showToast('🛒 In den Warenkorb gelegt!', 'success');
    } catch (e: any) {
      if (e?.message === 'NO_TOKEN') { router.push('/login'); return; }
      showToast('Fehler beim Hinzufügen zum Warenkorb', 'error');
    }
  }

  async function handleDelete() {
    setShowDeleteModal(false);
    try {
      await deleteProduct(id);
      showToast('🗑️ Produkt erfolgreich gelöscht!', 'success');
      // Zur Category-Seite zurückleiten
      setTimeout(() => {
        const categoryName = product.category?.name?.toLowerCase() || 'women';
        router.push(`/collections/${categoryName}`);
      }, 1500);
    } catch (e: any) {
      showToast('Fehler beim Löschen: ' + (e.message || String(e)), 'error');
    }
  }

  if (loading) return <div className="p-6">Lade Produkt…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (!product) return <div className="p-6">Produkt nicht gefunden</div>;

  const isOwner = profile && product.owner && profile.id === product.owner.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 transform animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-200 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Produkt löschen?</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Möchtest du dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative lg:col-span-1 bg-gradient-to-br from-gray-100 to-gray-200">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.title} className="w-full h-[600px] object-cover" />
              ) : (
                <div className="w-full h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-gray-500 font-medium">Kein Bild</p>
                  </div>
                </div>
              )}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">{product.category?.name ?? 'Produkt'}</span>
              </div>
            </div>
            {/* Details Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    <span>{product.owner?.name ?? product.owner?.email ?? 'Unbekannt'}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-lg">
                    <span className="text-4xl font-bold">{Number(product.price).toFixed(2)} €</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="text-sm font-semibold text-blue-700 mb-1">Größe</div>
                    <div className="text-lg font-bold text-blue-900">{product.size ?? '—'}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="text-sm font-semibold text-purple-700 mb-1">Zustand</div>
                    <div className="text-lg font-bold text-purple-900">{product.condition ?? '—'}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddCart} 
                    className="flex-1 group relative overflow-hidden px-8 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center space-x-3">
                      <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-lg">In den Warenkorb</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                  <button 
                    onClick={handleAddFavorite} 
                    className="group relative overflow-hidden px-8 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center space-x-3">
                      <svg className="w-6 h-6 group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="text-lg">Als Favorit</span>
                    </span>
                  </button>
                </div>

                {isOwner && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-200">
                    <Link 
                      href={`/products/${product.id}/edit`} 
                      className="flex-1 group px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-center"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Bearbeiten</span>
                      </span>
                    </Link>
                    <button 
                      onClick={handleDelete} 
                      className="group px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Löschen</span>
                      </span>
                    </button>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>Erstellt: {product.createdAt ? new Date(product.createdAt).toLocaleDateString('de-DE') : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
