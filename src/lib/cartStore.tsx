
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from './types'
import { PRODUCTS } from './sampleData'

export type CartItem = Pick<Product, 'id' | 'name' | 'image'> & {
  qty: number
  price: number
}

type CartState = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  subtotal: number
  totalShipping: number
  totalTax: number
  total: number
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const totalShipping = items.reduce((acc, cartItem) => {
    const product = PRODUCTS.find(p => p.id === cartItem.id)
    return acc + (product?.shippingCost || 0) * cartItem.qty;
  }, 0)
  const totalTax = items.reduce((acc, cartItem) => {
    const product = PRODUCTS.find(p => p.id === cartItem.id)
    const taxRate = product?.taxPercent || 0
    return acc + (cartItem.price * cartItem.qty * (taxRate / 100));
  }, 0)
  const total = subtotal + totalShipping + totalTax
  return { subtotal, totalShipping, totalTax, total }
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      totalShipping: 0,
      totalTax: 0,
      total: 0,
      add: (item) => {
        set((state) => {
          const existing = state.items.find((p) => p.id === item.id)
          let newItems;
          if (existing) {
            newItems = state.items.map((p) =>
              p.id === item.id ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p
            )
          } else {
            newItems = [...state.items, { ...item, qty: Math.max(1, item.qty) }]
          }
          return { items: newItems, ...calculateTotals(newItems) };
        })
      },
      remove: (id) => {
        set((state) => {
          const newItems = state.items.filter((p) => p.id !== id);
          return { items: newItems, ...calculateTotals(newItems) };
        })
      },
      setQty: (id, qty) => {
        set((state) => {
          const newItems = state.items.map((p) =>
            p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p
          );
          return { items: newItems, ...calculateTotals(newItems) };
        })
      },
      clear: () => {
        set({ items: [], subtotal: 0, totalShipping: 0, totalTax: 0, total: 0 })
      },
    }),
    { 
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const newTotals = calculateTotals(state.items);
          state.subtotal = newTotals.subtotal;
          state.totalShipping = newTotals.totalShipping;
          state.totalTax = newTotals.totalTax;
          state.total = newTotals.total;
        }
      }
    }
  )
)
