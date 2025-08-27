'use client'
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

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

export default function SubNavBar() {
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
                <Link href="/ayurvedic" legacyBehavior passHref>
                    <NavigationMenu.Link asChild>
                        <NavItem>Ayurvedic Medicines</NavItem>
                    </NavigationMenu.Link>
                </Link>
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
