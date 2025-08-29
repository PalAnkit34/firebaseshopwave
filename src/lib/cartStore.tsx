
'use client'
import { create } from 'zustand'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from './types'
import { PRODUCTS } from './sampleData'

export type CartItem = Pick<Product, 'id' | 'name' | 'image'> & {
  qty: number
  price: number
}

type CartState = {
  items: CartItem[]
  subtotal: number
  totalShipping: number
  totalTax: number
  total: number
  init: (userId: string) => () => void
  add: (userId: string, item: CartItem) => Promise<void>
  remove: (userId: string, id: string) => Promise<void>
  setQty: (userId: string, id: string, qty: number) => Promise<void>
  clear: () => void
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

export const useCart = create<CartState>()((set, get) => ({
  items: [],
  subtotal: 0,
  totalShipping: 0,
  totalTax: 0,
  total: 0,
  init: (userId: string) => {
    const docRef = doc(db, 'carts', userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const items = docSnap.data().items || [];
        set({ items, ...calculateTotals(items) });
      } else {
        setDoc(docRef, { items: [] });
        set({ items: [], ...calculateTotals([]) });
      }
    });
    return unsubscribe;
  },
  add: async (userId: string, item: CartItem) => {
    const docRef = doc(db, 'carts', userId);
    const state = get();
    const existing = state.items.find((p) => p.id === item.id)
    let newItems;
    if (existing) {
      newItems = state.items.map((p) =>
        p.id === item.id ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p
      )
    } else {
      newItems = [...state.items, { ...item, qty: Math.max(1, item.qty) }]
    }
    await setDoc(docRef, { items: newItems });
  },
  remove: async (userId: string, id: string) => {
    const docRef = doc(db, 'carts', userId);
    const state = get();
    const newItems = state.items.filter((p) => p.id !== id);
    await setDoc(docRef, { items: newItems });
  },
  setQty: async (userId: string, id: string, qty: number) => {
    const docRef = doc(db, 'carts', userId);
    const state = get();
    const newItems = state.items.map((p) =>
      p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p
    );
    await setDoc(docRef, { items: newItems });
  },
  clear: () => {
    set({ items: [], subtotal: 0, totalShipping: 0, totalTax: 0, total: 0 })
  },
}))
