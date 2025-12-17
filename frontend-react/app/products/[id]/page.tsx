"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchProduct, addFavorite, addToCart, fetchProfile, deleteProduct } from "../../services/api";

export default function ProductDetailPage({ params }: any) {
  const router = useRouter();
  const id = Number(params.id);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => { load(); }, [id]);

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
      alert('Zu Favoriten hinzugefügt');
    } catch (e: any) {
      if (e?.message === 'NO_TOKEN') { router.push('/login'); return; }
      alert(e.message || String(e));
    }
  }

  async function handleAddCart() {
    try {
      await addToCart(id, 1);
      alert('In den Warenkorb gelegt');
    } catch (e: any) {
      if (e?.message === 'NO_TOKEN') { router.push('/login'); return; }
      alert(e.message || String(e));
    }
  }

  async function handleDelete() {
    if (!confirm('Produkt wirklich löschen?')) return;
    try {
      await deleteProduct(id);
      router.push('/products');
    } catch (e: any) {
      alert(e.message || String(e));
    }
  }

  if (loading) return <div className="p-6">Lade Produkt…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;
  if (!product) return <div className="p-6">Produkt nicht gefunden</div>;

  const isOwner = profile && product.owner && profile.id === product.owner.id;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="lg:col-span-1 bg-gray-50">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.title} className="w-full h-[560px] object-cover" />
            ) : (
              <div className="w-full h-[560px] bg-gray-200 flex items-center justify-center text-gray-500">Kein Bild</div>
            )}
          </div>
          <div className="p-8 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold">{product.title}</h1>
                <div className="mt-1 text-sm text-gray-600">{product.category?.name ?? '—'}</div>
              </div>
              <div className="text-3xl font-bold text-green-700">{Number(product.price).toFixed(2)} €</div>
            </div>

            <div className="mt-6 text-gray-700 leading-relaxed">{product.description}</div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-sm text-gray-600">
                <div className="font-medium">Größe</div>
                <div>{product.size ?? '—'}</div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">Zustand</div>
                <div>{product.condition ?? '—'}</div>
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button onClick={handleAddCart} className="px-6 py-3 bg-green-600 text-white rounded-lg shadow">In den Warenkorb</button>
              <button onClick={handleAddFavorite} className="px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg border">Als Favorit</button>
              {isOwner && (
                <>
                  <Link href={`/products/${product.id}/edit`} className="px-4 py-2 border rounded-lg">Bearbeiten</Link>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Löschen</button>
                </>
              )}
            </div>

            <div className="mt-8 border-t pt-6 text-sm text-gray-600">
              <div className="mb-2"><span className="font-medium">Verkäufer:</span> {product.owner?.name ?? product.owner?.email ?? '—'}</div>
              <div className="mb-2"><span className="font-medium">Erstellt:</span> {product.createdAt ? new Date(product.createdAt).toLocaleString() : '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
