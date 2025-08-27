'use client'
import { ShoppingCart, User, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import SearchBar from './SearchBar'
import { useCart } from '@/lib/cartStore'
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { cn } from '@/lib/utils';
import React from 'react';

const ayurvedicComponents: { title: string; href: string; description: string }[] = [
    {
        title: "Supplements",
        href: "/search?category=Ayurvedic&subcategory=Supplements",
        description: "Natural support for stress and vitality."
    },
    {
        title: "Herbal Powders",
        href: "/search?category=Ayurvedic&subcategory=Herbal-Powders",
        description: "Traditional remedies for digestion."
    },
    {
        title: "Personal Care",
        href: "/search?category=Ayurvedic&subcategory=Personal-Care",
        description: "Soaps, oils, and creams with natural ingredients."
    },
];

const dailyNeedsComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Staples",
    href: "/search?category=Groceries&subcategory=Staples",
    description: "Rice, flour, salt and other kitchen essentials.",
  },
  {
    title: "Snacks",
    href: "/search?category=Groceries&subcategory=Snacks",
    description: "Cookies, noodles, and other quick bites.",
  },
  {
    title: "Beverages",
    href: "/search?category=Groceries&subcategory=Beverages",
    description: "Coffee, tea, and other drinks.",
  },
];


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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
            {children}
          </p>
        </a>
      </NavigationMenu.Link>
    </li>
  )
})
ListItem.displayName = "ListItem"


function SubNavBar() {
  const NavItem = ({ href, children, hasDropdown }: { href?: string; children: React.ReactNode; hasDropdown?: boolean }) => {
    const content = (
      <div className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-700/50 data-[state=open]:bg-gray-700/50">
        {children}
        {hasDropdown && <ChevronDown
          className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />}
      </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 hidden md:block">
      <div className="container mx-auto">
        <NavigationMenu.Root className="relative z-10 flex max-w-max flex-1 items-center justify-center">
          <NavigationMenu.List className="group flex flex-1 list-none items-center justify-center space-x-1">
            
            <NavigationMenu.Item>
              <NavigationMenu.Trigger>
                <NavItem hasDropdown>Ayurvedic Medicines</NavItem>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute top-0 left-0 w-full sm:w-auto">
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white border rounded-lg shadow-lg">
                  <li className="row-span-3">
                    <NavigationMenu.Link asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-emerald-500 to-green-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/search?category=Ayurvedic"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          Pure Ayurveda
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Natural healing and wellness from ancient traditions.
                        </p>
                      </a>
                    </NavigationMenu.Link>
                  </li>
                  {ayurvedicComponents.map((component) => (
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
              <Link href="/search?category=Homeopathy" legacyBehavior passHref>
                <NavigationMenu.Link asChild>
                  <NavItem>Homeopathy</NavItem>
                </NavigationMenu.Link>
              </Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
               <Link href="/search?category=Groceries&subcategory=Beverages" legacyBehavior passHref>
                  <NavigationMenu.Link asChild>
                     <NavItem>Food & Drinks</NavItem>
                  </NavigationMenu.Link>
                </Link>
            </NavigationMenu.Item>
             
            <NavigationMenu.Item>
               <Link href="/search?category=Pooja" legacyBehavior passHref>
                  <NavigationMenu.Link asChild>
                    <NavItem>Pooja Items</NavItem>
                  </NavigationMenu.Link>
                </Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger>
                <NavItem hasDropdown>Daily Needs</NavItem>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute top-0 left-0 w-full sm:w-auto">
                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white border rounded-lg shadow-lg">
                  {dailyNeedsComponents.map((component) => (
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
                  <NavigationMenu.Link asChild>
                    <NavItem>Apparel</NavItem>
                  </NavigationMenu.Link>
                </Link>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
               <Link href="/search?category=Groceries&subcategory=Dairy" legacyBehavior passHref>
                  <NavigationMenu.Link asChild>
                    <NavItem>Dairy Products</NavItem>
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
