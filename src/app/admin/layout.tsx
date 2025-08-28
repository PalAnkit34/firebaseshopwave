import AdminNav from '@/components/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminNav />
      <main className="container py-6 flex-grow">{children}</main>
    </div>
  );
}
