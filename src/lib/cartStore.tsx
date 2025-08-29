
'use client'
import { create } from 'zustand'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from './types'
import { useProductStore } from './productStore'

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
  const products = useProductStore.getState().products;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  
  // Dynamic shipping cost logic
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  let totalShipping = 0;
  if (totalItems > 0) {
    if (totalItems <= 2) {
      totalShipping = 45;
    } else if (totalItems <= 8) {
      totalShipping = 65;
    } else {
      totalShipping = 100;
      const remainingItems = totalItems - 8;
      totalShipping += Math.ceil(remainingItems / 5) * 35;
    }
  }

  const totalTax = items.reduce((acc, cartItem) => {
    const product = products.find(p => p.id === cartItem.id)
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
    // This function clears the local state. 
    // The cart in firestore should be cleared explicitly after a successful order.
    set({ items: [], subtotal: 0, totalShipping: 0, totalTax: 0, total: 0 })
  },
}))
