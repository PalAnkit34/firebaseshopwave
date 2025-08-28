
'use client'
import { useOrders } from '@/lib/ordersStore'
import { PRODUCTS } from '@/lib/sampleData'
import Image from 'next/image'
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
        return <a href={href}>{cardContent}</a>
    }

    return <div>{cardContent}</div>
}

export default function AdminPage() {
    const { orders } = useOrders()
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
                <StatCard href="#orders" icon={IndianRupee} title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} color="bg-green-500" />
                <StatCard href="#orders" icon={ShoppingCart} title="Total Sales" value={stats.totalSales} color="bg-blue-500" />
                <StatCard icon={Package} title="Total Products" value={PRODUCTS.length} color="bg-orange-500" />
                <StatCard icon={Users} title="Total Customers" value={stats.totalCustomers} color="bg-purple-500" />
            </div>

            <div id="orders" className="card p-4 scroll-mt-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Orders</h2>
                     <button className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
                        Add Product
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-brand">#{order.id}</td>
                                    <td className="p-3">
                                        <div>{order.address.fullName}</div>
                                        <div className="text-xs text-gray-500">{order.address.phone}</div>
                                    </td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td className="p-3 font-medium">₹{order.total.toLocaleString('en-IN')}</td>
                                    <td className="p-3">
                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">{order.status}</span>
                                    </td>
                                    <td className="p-3">{order.items.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No orders have been placed yet.
                    </div>
                )}
            </div>
        </div>
    )
}
