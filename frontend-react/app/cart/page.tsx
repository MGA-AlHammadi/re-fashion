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
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    load();
  }, []);

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
      showToast('❌ Fehler beim Aktualisieren', 'error');
    }
  }

  async function removeItem(productId: number) {
    try {
      await removeFromCart(productId);
      // Erst die Liste aktualisieren, dann Toast zeigen
      const updatedItems = items.filter(item => item.product.id !== productId);
      setItems(updatedItems);
      showToast('✅ Produkt aus Warenkorb entfernt', 'success');
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { 
        router.push('/login'); 
        return; 
      }
      console.error('Remove error:', e);
      showToast('❌ Fehler beim Entfernen: ' + (e.message || 'Unbekannter Fehler'), 'error');
    }
  }

  if (loading) return <div className="p-6">Lade Warenkorb…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl mb-4">Warenkorb</h1>
        <div className="border rounded p-8 bg-gray-50">
          <div className="text-4xl">🛒</div>
          <p className="mt-4">Dein Warenkorb ist leer.</p>
          <p className="mt-2 text-sm text-gray-600">Füge Produkte hinzu oder durchsuche unsere Kollektionen.</p>
          <div className="mt-4">
            <Link href="/collections" className="inline-block px-4 py-2 bg-green-600 text-white rounded">Weiter einkaufen</Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      <h1 className="text-2xl mb-4">Warenkorb</h1>
      <ul className="space-y-4">
        {items.map((it: any) => (
          <li key={it.id} className="flex items-center justify-between border p-4 rounded">
            <div>
              <Link href={`/products/${it.product.id}`} className="font-semibold text-green-700">{it.product.title}</Link>
              <div className="text-sm text-gray-600">{it.product.price} €</div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => changeQuantity(it.product.id, it.quantity - 1)} className="px-2 bg-gray-200 rounded">-</button>
              <span>{it.quantity}</span>
              <button onClick={() => changeQuantity(it.product.id, it.quantity + 1)} className="px-2 bg-gray-200 rounded">+</button>
              <button onClick={() => removeItem(it.product.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Entfernen</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 p-4 border rounded bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Zwischensumme</div>
          <div className="text-lg">{items.reduce((s, it: any) => s + (Number(it.product.price) || 0) * (it.quantity || 0), 0).toFixed(2)} €</div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Zur Kasse</button>
        </div>
      </div>
    </div>
  );
}
