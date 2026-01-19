"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../components/Toast";
import Link from 'next/link';

export default function UploadProductPage() {
  const { showToast } = useToast();
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
  const [images, setImages] = useState<Array<{file: File, preview: string}>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
    // check for token
    const t = globalThis.window !== undefined ? globalThis.window.localStorage.getItem('token') : null;
    setToken(t);
    if (!t) {
      showToast('⚠️ Nicht angemeldet! Bitte zuerst einloggen.', 'warning');
    }
  }, [showToast]);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Limit to 5 images
    if (images.length + files.length > 5) {
      showToast('⚠️ Maximal 5 Bilder erlaubt', 'warning');
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
    showToast(`✅ ${files.length} Bild(er) hinzugefügt`, 'success');
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);

    // basic client-side validation
    if (!form.title || !form.price || !form.categoryId) {
      showToast('⚠️ Bitte fülle Titel, Preis und Kategorie aus.', 'warning');
      setIsUploading(false);
      return;
    }

    if (!token) {
      showToast('⚠️ Nicht angemeldet — bitte zuerst einloggen.', 'warning');
      setIsUploading(false);
      return;
    }

    // Convert images to Base64
    let imageUrlsString = form.imageUrl; // Keep old imageUrl as fallback
    if (images.length > 0) {
      try {
        showToast('📷 Bilder werden verarbeitet...', 'info');
        const base64Images = await Promise.all(images.map(img => convertToBase64(img.file)));
        imageUrlsString = base64Images.join('|||'); // Use ||| as delimiter
      } catch (err) {
        console.error('Error converting images:', err);
        showToast('❌ Fehler beim Verarbeiten der Bilder', 'error');
        setIsUploading(false);
        return;
      }
    }

    const body: any = {
      title: form.title,
      description: form.description,
      price: form.price ? Number(form.price) : 0,
      size: form.size,
      condition: form.condition,
      imageUrl: imageUrlsString,
      categoryId: form.categoryId ? Number(form.categoryId) : null
    };

    try {
      // include token if available
      const tokenLocal = globalThis.window?.localStorage?.getItem('token') ?? null;
      
      if (!tokenLocal) {
        showToast('❌ Kein Token gefunden - bitte neu einloggen.', 'error');
        setIsUploading(false);
        return;
      }
      
      const headers: any = { 'Content-Type': 'application/json' };
      headers['Authorization'] = `Bearer ${tokenLocal}`;

      console.log('DEBUG: POST /api/products', { 
        headers: { ...headers, Authorization: `Bearer ${tokenLocal.substring(0, 20)}...` }, 
        bodySize: JSON.stringify(body).length 
      });

      const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        console.log('Upload successful', data);
        showToast('✅ Produkt erfolgreich veröffentlicht!', 'success');
        setForm({ title: '', description: '', price: '', size: '', condition: '', imageUrl: '', categoryId: '' });
        setImages([]); // Clear images
      } else {
        const text = await res.text().catch(() => 'Unable to read response');
        console.error('Upload failed', res.status, text);
        showToast(`❌ Fehler ${res.status}: ${text.substring(0, 100)}`, 'error');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      showToast(`❌ Fehler: ${err?.message || 'Unbekannter Fehler'}`, 'error');
    } finally {
      setIsUploading(false);
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
                <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Kategorie</label>
                <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full p-3 border rounded bg-gray-50 text-black">
                  <option value="">Kategorie wählen</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Bilder hochladen (max. 5)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                  disabled={images.length >= 5}
                />
                <label htmlFor="imageUpload" className={`cursor-pointer ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-600">Klicke zum Hochladen oder ziehe Bilder hierher</p>
                    <p className="text-xs text-gray-500 mt-1">{images.length}/5 Bilder hochgeladen</p>
                  </div>
                </label>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={img.preview} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                          Hauptbild
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional URL input */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1 text-gray-700">Oder Bild-URL eingeben (optional)</label>
              <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... (nur wenn keine Bilder hochgeladen)" className="w-full p-3 border rounded bg-gray-50 text-black placeholder-gray-500 text-sm" />
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
                <button 
                  disabled={isUploading || !token} 
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Wird hochgeladen...</span>
                    </>
                  ) : (
                    'Produkt veröffentlichen'
                  )}
                </button>
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
