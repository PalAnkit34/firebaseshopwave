
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { safeGet, safeSet } from './storage'
import type { Order, Address, PaymentMethod } from './types'
import type { CartItem } from './cartStore'

const OrdersCtx = createContext<{ orders: Order[]; placeOrder: (items: CartItem[], address: Address, total: number, payment: PaymentMethod) => Order }>({ orders: [], placeOrder: () => ({ id:'', createdAt:Date.now(), items:[], total:0, address:{} as Address, payment:'COD', status:'Pending' }) })

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(safeGet<Order[]>('orders', []))
  useEffect(() => { safeSet('orders', orders) }, [orders])

  const placeOrder = (items: CartItem[], address: Address, total: number, payment: PaymentMethod): Order => {
    const order: Order = {
      id: 'O' + Date.now().toString().slice(-6),
      createdAt: Date.now(),
      items: items.map(it => ({ productId: it.id, qty: it.qty, price: it.price, name: it.name, image: it.image })),
      total,
      address,
      payment,
      status: 'Pending',
    }
    setOrders(prev => [order, ...prev])
    return order
  }
  return <OrdersCtx.Provider value={{ orders, placeOrder }}>{children}</OrdersCtx.Provider>
}
export const useOrders = () => useContext(OrdersCtx)
