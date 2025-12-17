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

  useEffect(() => { load(); }, []);

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
      load();
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") { router.push('/login'); return; }
      setError(e.message || String(e));
    }
  }

  if (loading) return <div className="p-6">Lade Favoriten…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (items.length === 0) return <div className="p-6">Du hast noch keine Favoriten.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl mb-4">Favoriten</h1>
      <ul className="space-y-4">
        {items.map((p: any) => (
          <li key={p.id} className="flex items-center justify-between border p-4 rounded">
            <div>
              <Link href={`/products/${p.id}`} className="font-semibold text-green-700">{p.title}</Link>
              <div className="text-sm text-gray-600">{p.price} €</div>
            </div>
            <div>
              <button onClick={() => remove(p.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">Entfernen</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
