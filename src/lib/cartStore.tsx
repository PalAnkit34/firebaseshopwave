'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from './types'

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
  total: number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        set((state) => {
          const existing = state.items.find((p) => p.id === item.id)
          if (existing) {
            return {
              items: state.items.map((p) =>
                p.id === item.id ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p
              ),
            }
          }
          return { items: [...state.items, { ...item, qty: Math.max(1, item.qty) }] }
        })
      },
      remove: (id) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== id),
        }))
      },
      setQty: (id, qty) => {
        set((state) => ({
          items: state.items.map((p) =>
            p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p
          ),
        }))
      },
      clear: () => {
        set({ items: [] })
      },
      get total() {
        return get().items.reduce((s, i) => s + i.qty * i.price, 0)
      },
    }),
    { name: 'cart-storage' }
  )
)
