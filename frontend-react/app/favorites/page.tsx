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
