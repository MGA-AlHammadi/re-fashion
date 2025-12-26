"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProfile, deleteProduct } from "../../services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export default function MyProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const profile = await fetchProfile();
      
      // Fetch all products and filter by owner
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(await res.text());
      const allProducts = await res.json();
      
      const myProducts = allProducts.filter((p: any) => 
        p.owner && p.owner.id === profile.id
      );
      
      setProducts(myProducts);
      setError(null);
    } catch (e: any) {
      if (e?.message === 'NO_TOKEN') {
        router.push('/login');
        return;
      }
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Produkt wirklich löschen?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (e: any) {
      alert(e.message || String(e));
    }
  }

  if (loading) return <div className="p-6">Lade deine Produkte…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold">Meine Produkte</h1>
            <p className="text-gray-600 mt-2">Verwalte deine hochgeladenen Produkte</p>
          </div>
          <Link 
            href="/products/upload" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            + Neues Produkt
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Du hast noch keine Produkte hochgeladen.</p>
            <Link 
              href="/products/upload" 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Erstes Produkt hochladen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p: any) => (
              <div key={p.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                <Link href={`/products/${p.id}`} className="block">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      Kein Bild
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <Link href={`/products/${p.id}`} className="font-semibold text-lg text-gray-900 hover:text-green-600">
                        {p.title}
                      </Link>
                      <div className="text-sm text-gray-600">{Number(p.price).toFixed(2)} €</div>
                    </div>
                    <div className="text-sm text-gray-500">{p.size ?? ''}</div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2 mb-4">{p.description}</p>

                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/products/${p.id}`} 
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-center rounded text-sm hover:bg-green-700 transition"
                    >
                      Ansehen
                    </Link>
                    <Link 
                      href={`/products/${p.id}/edit`} 
                      className="flex-1 px-3 py-2 border border-gray-300 text-center rounded text-sm hover:bg-gray-100 transition"
                    >
                      Bearbeiten
                    </Link>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
