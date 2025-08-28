'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toast';
import OfferPopup from '@/components/OfferPopup';
import AdminNav from '@/components/AdminNav';

export default function RootContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <>
        <AdminNav />
        <main className="container py-6 flex-grow">{children}</main>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <main className="container py-4 pb-24 md:pb-8 flex-grow">
          {children}
        </main>
        <Footer />
      </div>
      <BottomNav />
      <OfferPopup />
      <Toaster />
    </>
  );
}
