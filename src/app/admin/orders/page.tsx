
'use client'
import { useOrders } from '@/lib/ordersStore'
import { useEffect, useState } from 'react'
import { Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Address } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminOrdersPage() {
    const { orders } = useOrders()
    const [isClient, setIsClient] = useState(false)
    const { toast } = useToast()
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

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
        toast({ title: "Address Copied!", description: "The customer's address has been copied." });
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
        <Dialog>
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
                                            <DialogTrigger asChild>
                                                <button onClick={() => setSelectedAddress(order.address)} className="text-left hover:underline">
                                                    <div>{order.address.fullName}</div>
                                                    <div className="text-xs text-gray-500">{order.address.phone}</div>
                                                </button>
                                            </DialogTrigger>
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
                                                onClick={() => handleCopyDetails(order.address)}
                                                className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                <Copy size={12} />
                                                Copy
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
            </div>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customer Shipping Details</DialogTitle>
                </DialogHeader>
                {selectedAddress && (
                    <div className="text-sm space-y-2">
                        <div>
                            <span className="font-semibold text-gray-600">Name:</span>
                            <p>{selectedAddress.fullName}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-600">Phone:</span>
                            <p>{selectedAddress.phone}</p>
                        </div>
                         <div>
                            <span className="font-semibold text-gray-600">Address:</span>
                            <p>{selectedAddress.line1}</p>
                            {selectedAddress.line2 && <p>{selectedAddress.line2}</p>}
                            <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                        </div>
                       {selectedAddress.landmark && (
                           <div>
                                <span className="font-semibold text-gray-600">Landmark:</span>
                                <p>{selectedAddress.landmark}</p>
                           </div>
                       )}
                       <div className="pt-4">
                            <button 
                                onClick={() => handleCopyDetails(selectedAddress)}
                                className="flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/20"
                            >
                                <Copy size={14} />
                                Copy Full Address
                            </button>
                       </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
