
'use client'
import { useOrders } from '@/lib/ordersStore'
import { useProductStore } from '@/lib/productStore'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { IndianRupee, ShoppingCart, Users, Package } from 'lucide-react'

const StatCard = ({ icon: Icon, title, value, color, href }: { icon: React.ElementType, title: string, value: string | number, color: string, href?: string }) => {
    const cardContent = (
        <div className="card p-4 flex items-center gap-4 transition-transform transform hover:scale-105">
            <div className={`rounded-full p-3 ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
                <div className="text-gray-500 text-sm">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    )
    
    if (href) {
        return <Link href={href}>{cardContent}</Link>
    }

    return <div>{cardContent}</div>
}

export default function AdminPage() {
    const { orders } = useOrders()
    const { products } = useProductStore()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const stats = useMemo(() => {
        if (!isClient) return { totalRevenue: 0, totalSales: 0, totalCustomers: 0 }
        
        const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)
        const totalSales = orders.length
        const customerIds = new Set(orders.map(o => o.address.phone))
        const totalCustomers = customerIds.size

        return { totalRevenue, totalSales, totalCustomers }
    }, [orders, isClient])

    if (!isClient) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard href="/admin/orders" icon={IndianRupee} title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} color="bg-green-500" />
                <StatCard href="/admin/orders" icon={ShoppingCart} title="Total Sales" value={stats.totalSales} color="bg-blue-500" />
                <StatCard href="/admin/products" icon={Package} title="Total Products" value={products.length} color="bg-orange-500" />
                <StatCard href="/admin/customers" icon={Users} title="Total Customers" value={stats.totalCustomers} color="bg-purple-500" />
            </div>

            <div className="card p-4">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                     <Link href="/admin/products#add" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
                        Add New Product
                    </Link>
                    <Link href="/admin/orders" className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50">
                        View All Orders
                    </Link>
                </div>
            </div>
        </div>
    )
}
