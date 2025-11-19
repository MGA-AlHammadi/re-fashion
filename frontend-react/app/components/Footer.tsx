import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-10 bg-white text-green-800 border-t-2 border-green-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-700">Persönliche Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="text-green-600 hover:text-green-800 transition-colors">Mein Profil</Link></li>
              <li><Link href="/orders" className="text-green-600 hover:text-green-800 transition-colors">Meine Bestellungen</Link></li>
              <li><Link href="/favorites" className="text-green-600 hover:text-green-800 transition-colors">Favoriten</Link></li>
              <li><Link href="/settings" className="text-green-600 hover:text-green-800 transition-colors">Einstellungen</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-700">Folge uns</h3>
            <div className="flex space-x-4">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-700">Kontaktieren Sie uns</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-green-600 hover:text-green-800 transition-colors">Nachricht senden</Link></li>
              <li><a href="mailto:info@re-fashion.de" className="text-green-600 hover:text-green-800 transition-colors">info@re-fashion.de</a></li>
              <li><Link href="/support" className="text-green-600 hover:text-green-800 transition-colors">Kundenservice</Link></li>
              <li><Link href="/faq" className="text-green-600 hover:text-green-800 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-700">Über uns</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-green-600 hover:text-green-800 transition-colors">Unsere Mission</Link></li>
              <li><Link href="/sustainability" className="text-green-600 hover:text-green-800 transition-colors">Nachhaltigkeit</Link></li>
              <li><Link href="/team" className="text-green-600 hover:text-green-800 transition-colors">Unser Team</Link></li>
              <li><Link href="/careers" className="text-green-600 hover:text-green-800 transition-colors">Karriere</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Copyright */}
        <div className="border-t border-green-200 mt-8 pt-6 text-center text-green-600 text-sm">
          © {new Date().getFullYear()} Re-Fashion | Nachhaltige Mode für eine bessere Zukunft
        </div>
      </div>
    </footer>
  );
}