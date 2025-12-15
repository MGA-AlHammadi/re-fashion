import SellButton from '../../components/SellButton';

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
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-thin mb-4">WOMEN</h1>
        <p className="text-gray-600 mb-4">Dresses, Blouses & More — nachhaltige Auswahl</p>
        <SellButton />

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 && (
            <div className="text-center text-gray-500 col-span-full">Keine Produkte gefunden.</div>
          )}

          {products.map((p: any) => (
            <div key={p.id} className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg mb-4 flex items-center justify-center">
                <img src={p.imageUrl || '/placeholder.png'} alt={p.title} className="w-24 h-24 object-cover rounded-full" />
              </div>
              <h3 className="font-medium text-lg mb-2">{p.title}</h3>
              <div className="text-green-600 font-bold">{p.price ? p.price + '€' : '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
