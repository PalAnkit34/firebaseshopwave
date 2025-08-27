'use client'
import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { safeGet, safeSet } from './storage'

export type CartItem = { id: string; qty: number; price: number; name: string; image: string }

const CartCtx = createContext<{
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  total: number
}>({ items: [], add: () => {}, remove: () => {}, setQty: () => {}, clear: () => {}, total: 0 })

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(safeGet<CartItem[]>('cart', []))
  useEffect(() => { safeSet('cart', items) }, [items])

  const add = (item: CartItem) => {
    setItems(prev => {
      const e = prev.find(p => p.id === item.id)
      if (e) return prev.map(p => p.id === item.id ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p)
      return [...prev, item]
    })
  }
  const remove = (id: string) => setItems(prev => prev.filter(p => p.id !== id))
  const setQty = (id: string, qty: number) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p))
  const clear = () => setItems([])
  const total = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items])

  return <CartCtx.Provider value={{ items, add, remove, setQty, clear, total }}>{children}</CartCtx.Provider>
}
export const useCart = () => useContext(CartCtx)
