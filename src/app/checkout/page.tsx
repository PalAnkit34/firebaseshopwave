'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import AddressForm from '@/components/AddressForm'
import { useOrders } from '@/lib/ordersStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Address } from '@/lib/types'

export default function Checkout(){
  const { items, total, clear } = useCart()
  const { addresses, save, setDefault } = useAddressBook()
  const { placeCOD } = useOrders()
  const router = useRouter()
  const [showForm, setShowForm] = useState(addresses.length === 0)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)

  const onPlace = () => {
    const addr = addresses.find(a => a.default) || addresses[0]
    if (!addr) {
      alert('Please add and select a delivery address.');
      setShowForm(true);
      return;
    }
    placeCOD(items, addr, total)
    clear()
    router.push('/orders')
  }

  const handleSaveAddress = (addr: Address) => {
    save({ ...addr, default: addresses.length === 0 || addr.default });
    setShowForm(false);
    setEditingAddress(undefined);
  }
  
  if (items.length === 0 && typeof window !== 'undefined') {
    router.replace('/');
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-start">
      <div>
        <h1 className="mb-4 text-xl font-semibold">Checkout</h1>
        <div className="card p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Delivery Address</h2>
            {!showForm && <button onClick={() => { setEditingAddress(undefined); setShowForm(true); }} className="text-sm font-semibold text-brand hover:underline">+ Add New</button>}
          </div>

          {!showForm ? (
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className={`rounded-xl border p-3 cursor-pointer transition-all ${a.default ? 'border-brand ring-2 ring-brand/30' : 'border-gray-200 hover:border-gray-400'}`} onClick={() => a.id && setDefault(a.id)}>
                  <div className="font-semibold text-sm">{a.fullName} — {a.phone}</div>
                  <div className="text-sm text-gray-600">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} - {a.pincode}</div>
                  {a.landmark && <div className="text-xs text-gray-500">Landmark: {a.landmark}</div>}
                  {a.default && <div className="mt-1 text-xs font-bold text-green-600">Default Address</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <AddressForm 
                onSubmit={handleSaveAddress} 
                initial={editingAddress} 
                onCancel={() => { setShowForm(false); setEditingAddress(undefined); }} 
              />
            </div>
          )}
        </div>
      </div>
      <div className="card sticky top-24 p-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <div className="mt-3 space-y-2 border-b pb-3 text-sm">
          <div className="flex justify-between">
            <span>Items ({items.reduce((s,i)=>s+i.qty,0)})</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-between font-semibold">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">Payment Method: <span className="font-medium text-gray-700">Cash on Delivery</span></div>
        <button onClick={onPlace} className="mt-4 w-full rounded-xl bg-brand py-2.5 font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50" disabled={items.length === 0}>Place Order</button>
        <Link href="/cart" className="mt-2 block text-center text-sm text-gray-500 hover:underline">Edit Cart</Link>
      </div>
    </div>
  )
}
