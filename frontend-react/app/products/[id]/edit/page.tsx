"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProduct, updateProduct } from "../../../services/api";
import Link from "next/link";

export default function EditProductPage({ params }: any) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ title: '', description: '', price: '', size: '', condition: '', imageUrl: '', categoryId: '' });
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { 
    load();
    // Load categories
    fetch('http://localhost:8080/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, [id]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
    setIsSaving(true);
    
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
      setToast({message: 'Produkt erfolgreich aktualisiert!', type: 'success'});
      setTimeout(() => router.push(`/products/${id}`), 1500);
    } catch (err: any) {
      setToast({message: err.message || 'Fehler beim Speichern', type: 'error'});
      setError(err.message || String(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Lade Produktdaten…</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fehler</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link 
          href={`/products/${id}`}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
        >
          Zurück zum Produkt
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/products/${id}`}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zum Produkt
          </Link>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Produkt bearbeiten</h1>
          <p className="text-gray-600 text-lg">Aktualisiere die Details deines Produkts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Produkttitel <span className="text-red-500">*</span>
                </label>
                <input 
                  id="title" 
                  name="title" 
                  value={form.title} 
                  onChange={handleChange}
                  required
                  placeholder="z. B. Vintage Denim Jacket"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-900"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Beschreibung
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  rows={5}
                  placeholder="Beschreibe Zustand, Maße, Marke, Besonderheiten..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none resize-none text-gray-900"
                />
              </div>

              {/* Price & Size Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preis (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">€</span>
                    <input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      name="price" 
                      value={form.price} 
                      onChange={handleChange}
                      required
                      placeholder="29.99"
                      className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-2">
                    Größe
                  </label>
                  <input 
                    id="size" 
                    name="size" 
                    value={form.size} 
                    onChange={handleChange}
                    placeholder="z. B. M / 38"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Condition & Category Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="condition" className="block text-sm font-semibold text-gray-700 mb-2">
                    Zustand
                  </label>
                  <input 
                    id="condition" 
                    name="condition" 
                    value={form.condition} 
                    onChange={handleChange}
                    placeholder="z. B. Gut, wie neu"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategorie
                  </label>
                  <select 
                    id="categoryId" 
                    name="categoryId" 
                    value={form.categoryId} 
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-900 bg-white"
                  >
                    <option value="">Kategorie wählen</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bild-URL
                </label>
                <input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={form.imageUrl} 
                  onChange={handleChange}
                  placeholder="https://beispiel.com/bild.jpg"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">Gib die URL eines Bildes ein oder lass das Feld leer</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Speichert...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Änderungen speichern
                    </span>
                  )}
                </button>
                <Link 
                  href={`/products/${id}`}
                  className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Abbrechen
                </Link>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600">
                  <p className="text-white text-sm font-semibold">Live-Vorschau</p>
                </div>
                
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={form.imageUrl.split('|||')[0]} 
                    alt="preview" 
                    className="w-full h-64 object-cover" 
                    onError={(e:any)=>{e.currentTarget.style.display='none'}} 
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 text-sm">Kein Bild</p>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                    {form.title || 'Produkttitel'}
                  </h2>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      {form.price ? `${Number(form.price).toFixed(2)} €` : '—'}
                    </span>
                    {form.size && (
                      <span className="text-sm text-gray-500">Größe: {form.size}</span>
                    )}
                  </div>
                  
                  {form.condition && (
                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                      {form.condition}
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm line-clamp-4 mb-4">
                    {form.description || 'Produktbeschreibung erscheint hier...'}
                  </p>
                  
                  {categories.find((c: any) => String(c.id) === String(form.categoryId)) && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {categories.find((c: any) => String(c.id) === String(form.categoryId))?.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-xl shadow-2xl z-50 transition-all duration-300 max-w-md ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              {toast.type === 'success' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
