"use client";

import { use, useEffect, useState } from "react";
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

export default function CategoryPage({ params }: { readonly params: Promise<{ readonly category: string }> }) {
  const { category } = use(params);
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

  const handleFilterChange = (filters: any) => {
    let filtered = [...items];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Lade Produkte...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Fehler aufgetreten</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Seite neu laden
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            {displayName}
          </h1>
          <p className="text-gray-600">Entdecke nachhaltige Mode aus der Kategorie {displayName}</p>
        </header>

        <ProductFilters 
          onFilterChange={handleFilterChange}
          productCount={filteredItems.length}
        />

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Keine Produkte gefunden</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              {items.length === 0 
                ? "In dieser Kategorie sind aktuell keine Produkte verfügbar. Schau bald wieder vorbei!"
                : "Keine Produkte entsprechen deinen Filterkriterien. Versuche andere Filter oder setze die Suche zurück."}
            </p>
            {items.length > 0 && filteredItems.length === 0 && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((p: any) => {
              const firstImage = getFirstProductImage(p);
              return (
                <div key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <Link href={`/products/${p.id}`} className="block relative">
                    {firstImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={firstImage} alt={p.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-green-600 font-bold text-sm">{Number(p.price).toFixed(2)} €</span>
                    </div>
                    {p.condition && (
                      <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-xs font-semibold">{p.condition}</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <div className="mb-3">
                      <Link href={`/products/${p.id}`} className="font-bold text-lg text-gray-900 hover:text-green-600 transition line-clamp-2 h-14">
                        {p.title}
                      </Link>
                      {p.size && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                          Größe: {p.size}
                        </span>
                      )}
                    </div>
                    <Link 
                      href={`/products/${p.id}`} 
                      className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                    >
                      Details ansehen
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
