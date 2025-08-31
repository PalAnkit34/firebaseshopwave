
import './globals.css';
import type { Metadata } from 'next';
import RootContent from './RootContent';
import { AuthProvider } from '@/context/AuthContext';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'ShopWave — Mobile‑first E‑Commerce',
  description:
    'Flipkart/Amazon‑like frontend with search, filters, wishlist, checkout.',
};

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/919638883833?text=${encodeURIComponent("Hello! I have a question about your products.")}`;
  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="fixed bottom-5 left-5 z-50">
       <div className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-transform hover:scale-110">
         <FaWhatsapp size={24} />
       </div>
    </Link>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <AuthProvider>
          <RootContent>{children}</RootContent>
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
