'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { safeGet, safeSet } from './storage'
import type { Order, Address } from './types'
import type { CartItem } from './cartStore'

const OrdersCtx = createContext<{ orders: Order[]; placeCOD: (items: CartItem[], address: Address, total: number) => Order }>({ orders: [], placeCOD: () => ({ id:'', createdAt:Date.now(), items:[], total:0, address:{} as Address, payment:'COD', status:'Pending' }) })

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(safeGet<Order[]>('orders', []))
  useEffect(() => { safeSet('orders', orders) }, [orders])

  const placeCOD = (items: CartItem[], address: Address, total: number): Order => {
    const order: Order = {
      id: 'O' + Date.now().toString().slice(-6),
      createdAt: Date.now(),
      items: items.map(it => ({ productId: it.id, qty: it.qty, price: it.price, name: it.name, image: it.image })),
      total,
      address,
      payment: 'COD',
      status: 'Pending',
    }
    setOrders(prev => [order, ...prev])
    return order
  }
  return <OrdersCtx.Provider value={{ orders, placeCOD }}>{children}</OrdersCtx.Provider>
}
export const useOrders = () => useContext(OrdersCtx)
