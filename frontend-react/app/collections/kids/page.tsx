export default function KidsPage() {
  const products = [
    { id: 'k1', title: 'Playful T-Shirt', price: '19€' },
    { id: 'k2', title: 'Comfy Pants', price: '25€' },
    { id: 'k3', title: 'Kids Jacket', price: '49€' }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-thin mb-4">KIDS</h1>
        <p className="text-gray-600 mb-8">Playful & Comfortable — nachhaltig für Kinder</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <div className="h-40 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/60 rounded-full"></div>
              </div>
              <h3 className="font-medium text-lg mb-2">{p.title}</h3>
              <div className="text-green-600 font-bold">{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
