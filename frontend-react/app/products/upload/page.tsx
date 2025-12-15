"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
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
      const token = globalThis.window?.localStorage?.getItem('token') ?? null;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setStatus('success');
        setForm({ title: '', description: '', price: '', size: '', condition: '', imageUrl: '', categoryId: '' });
      } else {
        const text = await res.text();
        setStatus('Fehler: ' + text);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 text-black">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-thin mb-6">Sell an item</h1>

        <form onSubmit={submit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="E.g. Vintage denim jacket" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} placeholder="Tell buyers about condition, brand, measurements..." className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500 min-h-[120px]" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Price (€)</label>
                <input id="price" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 29.99" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" type="number" step="0.01" />
              </div>
              <div>
                <label htmlFor="size" className="block text-sm font-medium mb-1">Size</label>
                <input id="size" name="size" value={form.size} onChange={handleChange} placeholder="e.g. M / 38" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
              </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-1">Condition</label>
              <input id="condition" name="condition" value={form.condition} onChange={handleChange} placeholder="e.g. Good, like new" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">Image URL</label>
              <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... or leave blank" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500" />
            </div>
          </div>

          {form.imageUrl && (
            <div className="flex items-center gap-4">
              <img src={form.imageUrl} alt="preview" className="w-28 h-28 object-cover rounded-md border" onError={(e:any)=>{e.currentTarget.style.display='none'}} />
              <div className="text-sm text-gray-600">Vorschau des Bilds</div>
            </div>
          )}

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
              <button disabled={status === 'loading'} className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded">
                {status === 'loading' ? 'Uploading...' : 'Upload'}
              </button>
              {status && (
                <div className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status}</div>
              )}
            </div>
            <div className="text-sm text-gray-500">Tip: gute Fotos erhöhen die Verkaufschance.</div>
          </div>
        </form>
      </div>
    </div>
  );
}
