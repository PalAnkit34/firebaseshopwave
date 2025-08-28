
'use client'
import { useParams } from 'next/navigation'
import { useOrders } from '@/lib/ordersStore'
import { useEffect, useState, useMemo } from 'react'
import { User, Phone, Mail, MapPin, IndianRupee, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CustomerDetailPage() {
    const { phone } = useParams()
    const { orders } = useOrders()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const customerData = useMemo(() => {
        if (!isClient) return null

        const customerOrders = orders.filter(order => order.address.phone === phone)
        if (customerOrders.length === 0) return null
        
        const latestAddress = customerOrders[0].address
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0)

        return {
            fullName: latestAddress.fullName,
            phone: latestAddress.phone,
            email: 'N/A', // Assuming email isn't stored
            address: latestAddress,
            orders: customerOrders,
            totalSpent,
            orderCount: customerOrders.length,
        }
    }, [isClient, orders, phone])

    if (!isClient) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Customer Details...</p>
            </div>
        )
    }

    if (!customerData) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Customer Not Found</h1>
                <p className="mt-2 text-gray-600">No customer found with phone number: {phone}</p>
                 <Link href="/admin/customers" className="mt-4 inline-block text-brand hover:underline">
                    &larr; Back to all customers
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                 <Link href="/admin/customers" className="text-sm text-brand font-semibold mb-2 inline-block">
                    &larr; All Customers
                </Link>
                <h1 className="text-3xl font-bold">{customerData.fullName}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="card p-4">
                        <h2 className="text-lg font-bold mb-3">Contact Information</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3"><User size={16} className="text-gray-500" /> <span>{customerData.fullName}</span></div>
                            <div className="flex items-center gap-3"><Phone size={16} className="text-gray-500" /> <span>{customerData.phone}</span></div>
                            <div className="flex items-center gap-3"><Mail size={16} className="text-gray-500" /> <span>{customerData.email}</span></div>
                        </div>
                    </div>
                    <div className="card p-4">
                        <h2 className="text-lg font-bold mb-3">Shipping Address</h2>
                        <div className="space-y-1 text-sm text-gray-700">
                             <p>{customerData.address.line1}</p>
                             {customerData.address.line2 && <p>{customerData.address.line2}</p>}
                             <p>{customerData.address.city}, {customerData.address.state} - {customerData.address.pincode}</p>
                             {customerData.address.landmark && <p className="text-xs text-gray-500">Landmark: {customerData.address.landmark}</p>}
                        </div>
                    </div>
                    <div className="card p-4">
                        <h2 className="text-lg font-bold mb-3">Lifetime Value</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3"><ShoppingCart size={16} className="text-gray-500" /> <span>{customerData.orderCount} Orders</span></div>
                            <div className="flex items-center gap-3"><IndianRupee size={16} className="text-gray-500" /> <span>₹{customerData.totalSpent.toLocaleString('en-IN')} Total Spent</span></div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="card p-4">
                        <h2 className="text-lg font-bold mb-3">Order History</h2>
                        <div className="space-y-4">
                            {customerData.orders.map(order => (
                                <div key={order.id} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <Link href="/admin/orders" className="font-semibold text-brand hover:underline">#{order.id}</Link>
                                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                                    </div>
                                    <div className="text-sm">
                                        {order.items.map(item => (
                                            <div key={item.productId} className="flex items-center gap-3 py-1">
                                                 <Image src={item.image} alt={item.name} width={32} height={32} className="rounded-md object-cover" />
                                                 <span className="flex-grow">{item.name} <span className="text-gray-500">x {item.qty}</span></span>
                                                 <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t mt-2 pt-2 flex justify-between items-center">
                                         <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">{order.status}</span>
                                         <div className="font-semibold">Total: ₹{order.total.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
