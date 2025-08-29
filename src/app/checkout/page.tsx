
'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import AddressForm from '@/components/AddressForm'
import { useOrders } from '@/lib/ordersStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Address } from '@/lib/types'
import { CreditCard, Banknote, QrCode } from 'lucide-react'
import Image from 'next/image'
import Script from 'next/script'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

const paymentOptions = [
  { id: 'UPI', icon: QrCode, title: 'UPI / QR Code', description: 'Pay with any UPI app' },
  { id: 'Card', icon: CreditCard, title: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay & more' },
  { id: 'NetBanking', icon: Banknote, title: 'Net Banking', description: 'All major banks supported' },
]

export default function Checkout(){
  const { user } = useAuth()
  const { items, subtotal, totalShipping, totalTax, total, clear: clearCart } = useCart()
  const { addresses, save, setDefault } = useAddressBook()
  const { placeOrder } = useOrders()
  const router = useRouter()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined)
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!user) {
        router.replace('/account');
        return;
    }
    if (items.length === 0) {
      router.replace('/');
    }
  }, [items, router, user]);

  useEffect(() => {
    setShowForm(addresses.length === 0);
  }, [addresses.length]);

  const handleSuccessfulPayment = async () => {
    const addr = addresses.find(a => a.default) || addresses[0]
    if (!addr || !user) {
      toast({ title: "Error", description: "Could not find address or user to place order.", variant: 'destructive' });
      return;
    }
    await placeOrder(user.id, items, addr, total, paymentMethod as any)
    clearCart() 
    router.push('/orders')
    toast({ title: "Order Placed!", description: "Thank you for your purchase." });
  }

  const handleOnlinePayment = async () => {
    setIsProcessing(true);
    const addr = addresses.find(a => a.default) || addresses[0]
    if (!addr) {
      toast({ title: "Error", description: "Please add and select a delivery address.", variant: 'destructive' });
      setShowForm(true);
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ShopWave',
        description: 'E-Commerce Transaction',
        order_id: order.id,
        handler: function (response: any) {
          handleSuccessfulPayment();
        },
        prefill: {
          name: addr.fullName,
          contact: addr.phone,
        },
        notes: {
          address: `${addr.line1}, ${addr.city}`,
        },
        theme: {
          color: '#3b82f6'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({ title: "Payment Failed", description: response.error.description, variant: 'destructive' });
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Could not initiate payment. Please try again.";
      const displayMessage = errorMessage.includes("Amount must be at least")
        ? "Order total must be at least ₹1 to proceed with online payment."
        : errorMessage;
      toast({ title: "Error", description: displayMessage, variant: 'destructive' });
      setIsProcessing(false);
    }
  }
  
  if (items.length === 0 || !user) {
    return null;
  }

  const handleAction = () => {
    handleOnlinePayment()
  }

  const handleSaveAddress = (addr: Address) => {
    if (user) {
      save(user.id, { ...addr, default: addresses.length === 0 || addr.default });
      setShowForm(false);
      setEditingAddress(undefined);
    }
  }

  const handleSetDefault = (addressId: string) => {
    if (user) {
        setDefault(user.id, addressId);
    }
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="grid gap-6 md:grid-cols-[1fr_360px] md:items-start">
        <div>
          <h1 className="mb-4 text-2xl font-bold">Checkout</h1>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Delivery Address</h2>
              {!showForm && <button onClick={() => { setEditingAddress(undefined); setShowForm(true); }} className="text-sm font-semibold text-brand hover:underline">+ Add New</button>}
            </div>

            {!showForm ? (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <div key={a.id} className={`rounded-lg border p-3 cursor-pointer transition-all ${a.default ? 'border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-gray-400'}`} onClick={() => a.id && handleSetDefault(a.id)}>
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
          <div className="mt-4 space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative h-14 w-14 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="rounded-md object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="line-clamp-1 font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                </div>
                <div className="font-medium">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
             <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totalShipping > 0 ? `₹${totalShipping.toLocaleString('en-IN')}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
          </div>
          <div className="mt-3 flex justify-between font-semibold border-t pt-3">
            <span>Total Amount</span>
            <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Payment Method</h3>
              <div className="space-y-2">
                  {paymentOptions.map(opt => (
                      <div key={opt.id}>
                          <label className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-brand ring-2 ring-brand/20' : 'border-gray-200 hover:border-gray-400'}`}>
                              <input type="radio" name="paymentMethod" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="h-4 w-4 text-brand focus:ring-brand" />
                              <opt.icon className="h-6 w-6 text-gray-600" />
                              <div>
                                  <div className="font-semibold text-sm">{opt.title}</div>
                                  <div className="text-xs text-gray-500">{opt.description}</div>
                              </div>
                          </label>
                      </div>
                  ))}
              </div>
          </div>

          <Button 
              onClick={handleAction} 
              className="mt-4 w-full" 
              disabled={isProcessing}
          >
              {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </Button>
          
          <Button variant="link" asChild className="mt-2 w-full">
            <Link href="/cart">Edit Cart</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
