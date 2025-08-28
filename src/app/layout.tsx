
import './globals.css';
import type { Metadata } from 'next';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { AddressProvider } from '@/lib/addressStore';
import { OrdersProvider } from '@/lib/ordersStore';
import OfferPopup from '@/components/OfferPopup';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toast';
import { usePathname } from 'next/navigation';
import AdminLayout from './admin/layout';
import RootContent from './RootContent';


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
      <body className="font-body antialiased bg-background" suppressHydrationWarning>
        <OrdersProvider>
          <AddressProvider>
            <RootContent>{children}</RootContent>
          </AddressProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
