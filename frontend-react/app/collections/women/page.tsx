import SellButton from '../../components/SellButton';
import Link from 'next/link';

export default async function WomenPage() {
  let products: Array<any> = [];
  try {
    const res = await fetch('http://localhost:8080/api/products/category/women', { cache: 'no-store' });
    if (res.ok) products = await res.json();
  } catch (e) {
    console.error('Failed to fetch women products:', e);
    products = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">WOMEN</h1>
          <p className="text-gray-600 text-lg">Dresses, Blouses & More — nachhaltige Auswahl</p>
        </div>
        <SellButton />

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-200 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-500">Bald gibt es hier tolle Angebote!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {products.map((p: any) => (
              <div key={p.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                <div className="relative h-64 bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 overflow-hidden">
                  <img 
                    src={p.imageUrl || '/placeholder.png'} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-pink-600">
                    {p.price ? p.price + '€' : '-'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 h-14">{p.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-1">{p.condition || 'Wie neu'}</p>
                  <Link 
                    href={`/products/${p.id}`} 
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Details ansehen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
