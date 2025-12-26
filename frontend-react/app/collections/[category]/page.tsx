"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProductsByCategory } from "../../services/api";

function accentForCategory(cat: string) {
  const key = cat?.toLowerCase();
  if (key?.includes('women')) return 'bg-pink-50 border-pink-200';
  if (key?.includes('men')) return 'bg-blue-50 border-blue-200';
  if (key?.includes('shoes')) return 'bg-yellow-50 border-yellow-200';
  if (key?.includes('kids')) return 'bg-green-50 border-green-200';
  return 'bg-gray-50 border-gray-200';
}

export default function CategoryPage({ params }: { readonly params: { readonly category: string } }) {
  const category = params.category;
  const displayName = category.replaceAll('-', ' ').toUpperCase();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, [category]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProductsByCategory(category);
      setItems(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  if (loading) return <div className="p-6">Lade Kategorie…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (items.length === 0) return <div className="p-6">Keine Produkte in dieser Kategorie.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold">{displayName}</h1>
          <p className="text-gray-600 mt-2">Entdecke Artikel aus der Kategorie {displayName}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p: any) => {
            return (
              <div key={p.id} className={`border rounded overflow-hidden shadow-sm ${accentForCategory(category)}`}>
                <Link href={`/products/${p.id}`} className="block">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">Kein Bild</div>
                  )}
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/products/${p.id}`} className="font-semibold text-lg text-gray-900">{p.title}</Link>
                      <div className="text-sm text-gray-600">{Number(p.price).toFixed(2)} €</div>
                    </div>
                    <div className="text-sm text-gray-500">{p.size ?? ''}</div>
                  </div>

                  <p className="mt-3 text-sm text-gray-700 line-clamp-2">{p.description}</p>

                  <div className="mt-4">
                    <Link href={`/products/${p.id}`} className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
                      Details ansehen
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
