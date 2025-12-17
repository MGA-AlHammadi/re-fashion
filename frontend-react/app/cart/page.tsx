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
    try {
      await updateCartQuantity(productId, q);
      load();
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    }
  }

  async function removeItem(productId: number) {
    try {
      await removeFromCart(productId);
      load();
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    }
  }

  if (loading) return <div className="p-6">Lade Warenkorb…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (items.length === 0) return <div className="p-6">Dein Warenkorb ist leer.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
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
    </div>
  );
}
