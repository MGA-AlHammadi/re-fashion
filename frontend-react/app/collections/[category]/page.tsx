export default function CategoryPage({ params }: { readonly params: { readonly category: string } }) {
  const displayName = params.category.replaceAll('-', ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-thin mb-4">{displayName}</h1>
        <p className="text-gray-600 mb-6">Produkte für die Kategorie "{params.category}" (Platzhalter)</p>
        <p className="text-gray-700">Diese Seite ist ein Platzhalter. Hier kommen später Produktlisten und Filter.</p>
        <div className="mt-8">
          <a href="/" className="text-green-600 underline">Zurück zur Startseite</a>
        </div>
      </div>
    </div>
  );
}
