
'use client'
import { useOrders } from '@/lib/ordersStore'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

export default function AdminCustomersPage() {
    const { orders } = useOrders()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const customers = useMemo(() => {
        if (!isClient) return []
        
        const customerMap = new Map()
        orders.forEach(order => {
            const phone = order.address.phone
            if (!customerMap.has(phone)) {
                customerMap.set(phone, {
                    fullName: order.address.fullName,
                    phone: phone,
                    email: 'N/A', // Assuming email is not in order details
                    orderCount: 0,
                    totalSpent: 0,
                    lastOrder: new Date(0),
                })
            }
            const customer = customerMap.get(phone)
            customer.orderCount++
            customer.totalSpent += order.total
            if (new Date(order.createdAt) > customer.lastOrder) {
                customer.lastOrder = new Date(order.createdAt)
            }
        })

        return Array.from(customerMap.values())
    }, [orders, isClient])

    if (!isClient) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Customers...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Customers</h1>

            <div className="card p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3">Customer Name</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Total Orders</th>
                                <th className="p-3">Total Spent</th>
                                <th className="p-3">Last Order Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.phone} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">
                                        <Link href={`/admin/customers/${customer.phone}`} className="text-brand hover:underline">
                                            {customer.fullName}
                                        </Link>
                                    </td>
                                    <td className="p-3">{customer.phone}</td>
                                    <td className="p-3">{customer.orderCount}</td>
                                    <td className="p-3">₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                                    <td className="p-3">{customer.lastOrder.toLocaleDateString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {customers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No customers found yet.
                    </div>
                )}
            </div>
        </div>
    )
}
