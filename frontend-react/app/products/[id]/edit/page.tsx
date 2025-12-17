"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProduct, updateProduct } from "../../../services/api";

export default function EditProductPage({ params }: any) {
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ title: '', description: '', price: '', size: '', condition: '', imageUrl: '', categoryId: '' });

  useEffect(() => { load(); }, [id]);

  async function load() {
    setLoading(true);
    try {
      const p = await fetchProduct(id);
      setForm({
        title: p.title ?? '',
        description: p.description ?? '',
        price: p.price ?? '',
        size: p.size ?? '',
        condition: p.condition ?? '',
        imageUrl: p.imageUrl ?? '',
        categoryId: p.category?.id ?? ''
      });
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally { setLoading(false); }
  }

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e: any) {
    e.preventDefault();
    setError(null);
    try {
      const body: any = {
        title: form.title,
        description: form.description,
        price: form.price ? Number(form.price) : null,
        size: form.size,
        condition: form.condition,
        imageUrl: form.imageUrl,
        categoryId: form.categoryId ? Number(form.categoryId) : null
      };
      await updateProduct(id, body);
      router.push(`/products/${id}`);
    } catch (err: any) {
      setError(err.message || String(err));
    }
  }

  if (loading) return <div className="p-6">Lade…</div>;
  if (error) return <div className="p-6 text-red-600">Fehler: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl mb-4">Produkt bearbeiten</h1>
      <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow-sm">
        <div>
          <label htmlFor="title" className="block text-sm">Titel</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm">Beschreibung</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded h-36" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm">Preis (€)</label>
            <input id="price" type="number" step="0.01" name="price" value={form.price} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm">Größe</label>
            <input id="size" name="size" value={form.size} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="condition" className="block text-sm">Zustand</label>
            <input id="condition" name="condition" value={form.condition} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm">Bild-URL</label>
            <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm">Kategorie ID</label>
          <input id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Speichern</button>
        </div>
      </form>
    </div>
  );
}
