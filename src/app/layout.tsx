
import './globals.css';
import type { Metadata } from 'next';
import RootContent from './RootContent';
import { AuthProvider } from '@/context/AuthContext';


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
        <AuthProvider>
            <RootContent>{children}</RootContent>
        </AuthProvider>
      </body>
    </html>
  );
}
