'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, ShoppingCart, Package, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center gap-6 py-3">
        <Link href="/admin" className="text-lg font-bold text-brand flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          <span>ShopWave Admin</span>
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-gray-100 text-brand'
                  : 'text-gray-600 hover:bg-gray-100/50 hover:text-brand'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand transition-colors flex items-center gap-1.5">
            <Home className="h-4 w-4" />
            <span>Storefront</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
