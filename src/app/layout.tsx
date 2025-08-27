import './globals.css';
import type { Metadata } from 'next';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { CartProvider } from '@/lib/cartStore';
import { WishlistProvider } from '@/lib/wishlistStore';
import { AddressProvider } from '@/lib/addressStore';
import { OrdersProvider } from '@/lib/ordersStore';
import OfferPopup from '@/components/OfferPopup';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background">
        <OrdersProvider>
          <AddressProvider>
            <WishlistProvider>
              <CartProvider>
                <TopBar />
                <main className="container py-4 pb-24 md:pb-8">{children}</main>
                <BottomNav />
                <OfferPopup />
              </CartProvider>
            </WishlistProvider>
          </AddressProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
