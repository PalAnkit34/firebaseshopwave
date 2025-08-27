'use client'
import Link from 'next/link'
import { Home, Search, ShoppingBag, Package, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cartStore'

export default function BottomNav(){
  const path = usePathname();
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.qty, 0);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/cart", icon: ShoppingBag, label: "Cart", count: cartItemCount },
    { href: "/orders", icon: Package, label: "Orders" },
    { href: "/account", icon: User, label: "Account" },
  ];
  
  const Item = ({ href, icon:Icon, label, count }:{ href:string; icon:any; label:string, count?: number }) => {
    const isActive = (href === "/" && path === href) || (href !== "/" && path.startsWith(href));
    return (
      <Link href={href} className={`flex flex-1 flex-col items-center justify-center py-2 text-xs transition-colors ${isActive ?'text-brand':'text-gray-500 hover:text-brand'}`}>
        <div className="relative">
          <Icon className="h-5 w-5"/>
          {count && count > 0 && (
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-xs text-white">
              {count}
            </span>
          )}
        </div>
        {label}
      </Link>
    )
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-white/95 shadow-sm backdrop-blur-sm md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 text-center">
        {navItems.map(item => <Item key={item.href} {...item} />)}
      </div>
    </div>
  )
}
