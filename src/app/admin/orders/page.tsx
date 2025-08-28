
'use client'
import { useOrders } from '@/lib/ordersStore'
import { useEffect, useState } from 'react'
import { Copy, Eye, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Address, Order } from '@/lib/types'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

export default function AdminOrdersPage() {
    const { orders } = useOrders()
    const [isClient, setIsClient] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCopyDetails = (address: Address) => {
        const details = [
            address.fullName,
            address.phone,
            address.line1,
            address.line2,
            `${address.city}, ${address.state} - ${address.pincode}`,
            address.landmark ? `Landmark: ${address.landmark}` : null
        ].filter(Boolean).join('\n');
        
        navigator.clipboard.writeText(details);
        toast({ title: "Copied!", description: "Customer address copied to clipboard." });
    }

    if (!isClient) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Orders...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">All Orders</h1>
            </div>

            <div className="card p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3">Order ID</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Items</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-brand">#{order.id}</td>
                                    <td className="p-3">
                                        <Link href={`/admin/customers/${order.address.phone}`} className="hover:underline">
                                            <div>{order.address.fullName}</div>
                                            <div className="text-xs text-gray-500">{order.address.phone}</div>
                                        </Link>
                                    </td>
                                    <td className="p-3">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td className="p-3 font-medium">₹{order.total.toLocaleString('en-IN')}</td>
                                    <td className="p-3">{order.payment}</td>
                                    <td className="p-3">
                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">{order.status}</span>
                                    </td>
                                    <td className="p-3">{order.items.length}</td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                        >
                                            <Eye size={12} />
                                            Open
                                        </button>
                                    </td>
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

            <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-lg">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-lg text-brand">#{selectedOrder.id}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(selectedOrder.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-sm font-semibold text-yellow-800">{selectedOrder.status}</span>
                                </div>
                                <div className="space-y-2 rounded-lg border p-3">
                                    <h3 className="font-semibold mb-1">Items Ordered ({selectedOrder.items.length})</h3>
                                    {selectedOrder.items.map(item => (
                                        <div key={item.productId} className="flex items-center gap-3">
                                            <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md object-cover"/>
                                            <div className="flex-grow">
                                                <div>{item.name}</div>
                                                <div className="text-xs text-gray-500">Qty: {item.qty} &times; ₹{item.price.toLocaleString('en-IN')}</div>
                                            </div>
                                            <div className="font-medium">₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2 rounded-lg border p-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">Shipping Address</h3>
                                        <button 
                                            onClick={() => handleCopyDetails(selectedOrder.address)}
                                            className="flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
                                        >
                                            <Copy size={14} /> Copy Full Address
                                        </button>
                                    </div>
                                    <div className="text-gray-700">
                                        <p className="font-medium">{selectedOrder.address.fullName}</p>
                                        <p>{selectedOrder.address.phone}</p>
                                        <p>{selectedOrder.address.line1}{selectedOrder.address.line2 ? `, ${selectedOrder.address.line2}` : ''}</p>
                                        <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                                        {selectedOrder.address.landmark && <p className="text-xs text-gray-500">Landmark: {selectedOrder.address.landmark}</p>}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center rounded-lg border p-3">
                                    <h3 className="font-semibold">Payment: <span className="font-normal">{selectedOrder.payment}</span></h3>
                                    <div className="font-bold text-lg">Total: ₹{selectedOrder.total.toLocaleString('en-IN')}</div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
