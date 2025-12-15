import Link from 'next/link';

type Category = {
  id?: number;
  name: string;
  description?: string;
};

const gradientMap: Record<string, string> = {
  women: 'bg-gradient-to-br from-rose-300 via-pink-200 to-pink-300',
  men: 'bg-gradient-to-br from-blue-200 via-indigo-200 to-indigo-300',
  kids: 'bg-gradient-to-br from-yellow-200 via-orange-150 to-orange-300',
  shoes: 'bg-gradient-to-br from-gray-200 via-slate-200 to-slate-300'
};

export default async function CollectionsPage() {
  let categories: Category[] = [];

  try {
    const res = await fetch('http://localhost:8080/api/categories', { cache: 'no-store' });
    if (res.ok) {
      categories = await res.json();
    }
  } catch {
    // ignore, fallback to static
  }

  if (!categories || categories.length === 0) {
    categories = [
      { name: 'women', description: 'Dresses, Blouses & More' },
      { name: 'men', description: 'Shirts, Pants & More' },
      { name: 'kids', description: 'Playful & Comfortable' },
      { name: 'shoes', description: 'Sneakers, Boots & More' }
    ];
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extralight tracking-tight">Collections</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Entdecke kuratierte, nachhaltige Styles — klar, reduziert und hochwertig dargestellt.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const key = cat.name.toLowerCase();
            const gradientClass = gradientMap[key] || gradientMap.shoes;

            return (
              <Link key={cat.name} href={`/collections/${key}`} className="group">
                <article className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 hover:-translate-y-1 bg-white">
                  <div className={`h-52 w-full ${gradientClass} flex items-end p-6`}> 
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-semibold text-gray-900 uppercase tracking-wider">{cat.name}</h3>
                      <p className="text-sm text-gray-700 mt-1">{cat.description}</p>
                    </div>
                    <div className="ml-4 hidden md:flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center border border-white/60">
                        <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12h18M12 3v18"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex items-center justify-between bg-white">
                    <div className="text-sm text-gray-600">Fein kuratiert — nachhaltige Auswahl</div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium shadow">Explore</span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
