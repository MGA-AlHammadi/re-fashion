import "./globals.css";
import { Metadata } from 'next';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Re-Fashion - Nachhaltige Mode',
  description: 'Eine Plattform für nachhaltige Mode und Second-Hand Kleidung',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="bg-gray-100">
        <Header />
        
        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto pt-6">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
