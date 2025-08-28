'use client';

import Link from 'next/link';
import { LayoutDashboard, Home } from 'lucide-react';

export default function AdminNav() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center gap-6 py-3">
        <Link href="/admin" className="text-xl font-bold text-brand flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <span>Admin Panel</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand transition-colors flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            <span>Storefront</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
