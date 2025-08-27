'use client'
import { ShoppingCart, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import SearchBar from './SearchBar'
import { useCart } from '@/lib/cartStore'
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { cn } from '@/lib/utils';
import React from 'react';

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Smartphones",
    href: "/search?category=Tech&subcategory=Mobiles",
    description:
      "Latest and greatest smartphones from top brands.",
  },
  {
    title: "Headphones",
    href: "/search?category=Tech&subcategory=Audio",
    description:
      "Immerse yourself in music with our wide range of headphones.",
  },
  {
    title: "Laptops",
    href: "/search?category=Tech&subcategory=Laptops",
    description:
      "Powerful laptops for work, play, and everything in between.",
  },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenu.Link asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
})
ListItem.displayName = "ListItem"


function SubNavBar() {
  return (
    <div className="bg-white border-b hidden md:block">
      <div className="container mx-auto">
        <NavigationMenu.Root className="relative z-10 flex max-w-max flex-1 items-center justify-center">
          <NavigationMenu.List className="group flex flex-1 list-none items-center justify-center space-x-1">
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                Tech <ChevronDown
                  className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute top-0 left-0 w-full sm:w-auto">
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border rounded-lg shadow-lg">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
               <Link href="/search?category=Fashion" legacyBehavior passHref>
                  <NavigationMenu.Link className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Fashion
                  </NavigationMenu.Link>
                </Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
               <Link href="/search?category=Ayurvedic" legacyBehavior passHref>
                  <NavigationMenu.Link className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Ayurvedic
                  </NavigationMenu.Link>
                </Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </div>
  )
}

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
      <SubNavBar />
    </header>
  )
}
