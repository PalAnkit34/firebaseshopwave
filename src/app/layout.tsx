
import './globals.css';
import type { Metadata } from 'next';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { AddressProvider } from '@/lib/addressStore';
import { OrdersProvider } from '@/lib/ordersStore';
import OfferPopup from '@/components/OfferPopup';
import Footer from '@/components/Footer';


export const metadata: Metadata = {
  title: 'ShopWave — Mobile‑first E‑Commerce',
  description:
    'Flipkart/Amazon‑like frontend with search, filters, wishlist, checkout.',
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
        <OrdersProvider>
          <AddressProvider>
            <div className="flex flex-col min-h-screen">
              <TopBar />
              <main className="container py-4 pb-24 md:pb-8 flex-grow">{children}</main>
              <Footer />
            </div>
            <BottomNav />
            <OfferPopup />
          </AddressProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
