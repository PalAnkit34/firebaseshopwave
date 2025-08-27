'use client'
import { ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import SearchBar from './SearchBar'
import { useCart } from '@/lib/cartStore'

export default function TopBar() {
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container flex items-center gap-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand">ShopWave</Link>
        <div className="hidden flex-1 md:block md:px-8 lg:px-16">
          <SearchBar />
        </div>
        <nav className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link href="/account" className="rounded-full p-2 hover:bg-gray-100 transition-colors" aria-label="Account">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-gray-100 transition-colors" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
      <div className="container md:hidden pb-3 border-t md:border-t-0"><SearchBar /></div>
    </header>
  )
}
