'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Grid, ShoppingBag, BarChart2, Settings, LifeBuoy, LogOut } from 'lucide-react'

const NavLink = ({ href, icon: Icon, children }) => {
    const pathname = usePathname()
    const isActive = pathname === href
    return (
        <Link href={href} className={`flex items-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive ? 'bg-brand text-white' : 'text-gray-400 hover:text-white hover:bg-brand/50'}`}>
            <Icon className="w-5 h-5" />
            <span className="ml-3">{children}</span>
        </Link>
    )
}

export default function AdminSidebar() {
    return (
        <div className="hidden lg:flex flex-col w-64 bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <Link href="/admin">
                    <span className="text-2xl font-bold">Admin Panel</span>
                </Link>
            </div>
            <div className="flex-1 p-4">
                <nav>
                    <NavLink href="/admin" icon={Grid}>Dashboard</NavLink>
                    <NavLink href="/admin/products" icon={ShoppingBag}>Products</NavLink>
                    <NavLink href="/admin/orders" icon={BarChart2}>Orders</NavLink>
                    <NavLink href="/admin/settings" icon={Settings}>Settings</NavLink>
                </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
                 <Link href="/admin/help" className="flex items-center px-4 py-2 mt-2 text-sm font-semibold text-gray-400 rounded-lg hover:text-white hover:bg-brand/50">
                    <LifeBuoy className="w-5 h-5" />
                    <span className="ml-3">Help</span>
                </Link>
                 <Link href="/" className="flex items-center px-4 py-2 mt-2 text-sm font-semibold text-gray-400 rounded-lg hover:text-white hover:bg-brand/50">
                    <LogOut className="w-5 h-5" />
                    <span className="ml-3">Exit Admin</span>
                </Link>
            </div>
        </div>
    )
}
