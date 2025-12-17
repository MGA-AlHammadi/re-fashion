"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function UploadProductPage() {
  const [categories, setCategories] = useState<Array<any>>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    size: "",
    condition: "",
    imageUrl: "",
    categoryId: ""
  });
  const [status, setStatus] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
    // check for token
    const t = globalThis.window !== undefined ? globalThis.window.localStorage.getItem('token') : null;
    setToken(t);
    if (!t) setStatus('Bitte zuerst einloggen, um ein Produkt hochzuladen.');
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');

    // basic client-side validation
    if (!form.title || !form.price || !form.categoryId) {
      setStatus('Bitte fülle Titel, Preis und Kategorie aus.');
      return;
    }

    if (!token) {
      setStatus('Nicht angemeldet — bitte zuerst einloggen.');
      return;
    }

    const body: any = {
      title: form.title,
      description: form.description,
      price: form.price ? Number(form.price) : 0,
      size: form.size,
      condition: form.condition,
      imageUrl: form.imageUrl,
      categoryId: form.categoryId ? Number(form.categoryId) : null
    };

    try {
      // include token if available
      const tokenLocal = globalThis.window?.localStorage?.getItem('token') ?? null;
      const headers: any = { 'Content-Type': 'application/json' };
      if (tokenLocal) headers['Authorization'] = `Bearer ${tokenLocal}`;

      console.log('DEBUG: POST /api/products', { headers, body });

      const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        console.log('Upload successful', data);
        setStatus('success');
        setForm({ title: '', description: '', price: '', size: '', condition: '', imageUrl: '', categoryId: '' });
      } else {
        const text = await res.text().catch(() => 'Unable to read response');
        console.error('Upload failed', res.status, text);
        setStatus(`Fehler ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 text-black">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-6 text-green-700">Produkt zum Verkauf anbieten</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={submit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Titel</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="z. B. Vintage Denim Jacket" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Beschreibung</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Beschreibe Zustand, Maße, Marke..." className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500 min-h-[140px]" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Preis (€)</label>
                <input id="price" name="price" value={form.price} onChange={handleChange} placeholder="z. B. 29.99" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" type="number" step="0.01" />
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-1">Größe</label>
                <input id="size" name="size" value={form.size} onChange={handleChange} placeholder="z. B. M / 38" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="condition" className="block text-sm font-medium mb-1">Zustand</label>
                <input id="condition" name="condition" value={form.condition} onChange={handleChange} placeholder="z. B. Gut, wie neu" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">Bild-URL</label>
                <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... oder leer lassen" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Kategorie</label>
              <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full p-3 border rounded bg-gray-50 text-black">
                <option value="">Kategorie wählen</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button disabled={status === 'loading' || !token} className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded">
                  {status === 'loading' ? 'Hochladen...' : 'Produkt veröffentlichen'}
                </button>
                {status && (
                  <div className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status}</div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {token ? 'Gute Fotos und Beschreibung erhöhen die Chance.' : (
                  <Link href="/login" className="text-blue-600 underline">Jetzt einloggen</Link>
                )}
              </div>
            </div>
          </form>

          {/* Live preview */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="preview" className="w-full h-72 object-cover" onError={(e:any)=>{e.currentTarget.style.display='none'}} />
                ) : (
                  <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">Vorschaubild</div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold truncate">{form.title || 'Produkttitel'}</h2>
                    <div className="text-xl font-bold text-green-700">{form.price ? Number(form.price).toFixed(2) + ' €' : '—'}</div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{form.categoryId ? categories.find((c:any)=>String(c.id)===String(form.categoryId))?.name : 'Kategorie'}</div>
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{form.description || 'Kurze Beschreibung deines Produkts'}</p>
                  <div className="mt-4 flex items-center space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded">In den Warenkorb</button>
                    <button className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded">Als Favorit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
