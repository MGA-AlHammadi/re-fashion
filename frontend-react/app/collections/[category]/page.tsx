"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProductsByCategory } from "../../services/api";
import ProductFilters from "../../components/ProductFilters";

function accentForCategory(cat: string) {
  const key = cat?.toLowerCase();
  if (key?.includes('women')) return 'bg-pink-50 border-pink-200';
  if (key?.includes('men')) return 'bg-blue-50 border-blue-200';
  if (key?.includes('shoes')) return 'bg-yellow-50 border-yellow-200';
  if (key?.includes('kids')) return 'bg-green-50 border-green-200';
  return 'bg-gray-50 border-gray-200';
}

// Helper function to get first image from product
function getFirstProductImage(product: any): string | null {
  const imageUrls = product.imageUrls || product.imageUrl || '';
  if (!imageUrls) return null;
  // Split by ||| delimiter for multiple images, return first one
  const images = imageUrls.split('|||').filter((url: string) => url.trim());
  return images.length > 0 ? images[0] : null;
}

export default function CategoryPage({ params }: { readonly params: { readonly category: string } }) {
  const category = params.category;
  const displayName = category.replaceAll('-', ' ').toUpperCase();

  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, [category]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProductsByCategory(category);
      setItems(data);
      setFilteredItems(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold">{displayName}</h1>
          <p className="text-gray-600 mt-2">Entdecke Artikel aus der Kategorie {displayName}</p>
        </header>

        <ProductFilters onFilterChange={handleFilterChange} productCount={filteredItems.length} />

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-500">Versuche es mit anderen Filtern</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredI
    // Price filters
    if (filters.priceMin) {
      filtered = filtered.filter(p => Number(p.price) >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => Number(p.price) <= Number(filters.priceMax));
    }

    // Size filter
    if (filters.size) {
      filtered = filtered.filter(p => p.size === filters.size);
    }

    // Condition filter
    if (filters.condition) {
      filtered = filtered.filter(p => p.condition === filters.condition);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'newest':
      default:
        // Keep original order (newest first from backend)
        break;
    }

    setFilteredItems(filtered);
  };

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
            const firstImage = getFirstProductImage(p);
            return (
              <div key={p.id} className={`border rounded overflow-hidden shadow-sm ${accentForCategory(category)}`}>
                <Link href={`/products/${p.id}`} className="block">
                  {firstImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={firstImage} alt={p.title} className="w-full h-48 object-cover" />
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

             
                  <div className="mt-4">
        )}
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
