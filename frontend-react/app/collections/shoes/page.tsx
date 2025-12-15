export default function ShoesPage() {
  const products = [
    { id: 's1', title: 'Eco Sneakers', price: '89€' },
    { id: 's2', title: 'Recycled Boots', price: '119€' },
    { id: 's3', title: 'Slip-on Loafers', price: '69€' }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-thin mb-4">SHOES</h1>
        <p className="text-gray-600 mb-8">Sneakers, Boots & More — nachhaltige Schuhe</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="p-6 bg-gray-50 rounded-2xl shadow-sm">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center">
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
