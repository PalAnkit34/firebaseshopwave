
'use client'
import { create } from 'zustand'
import { safeGet, safeSet } from './storage'
import type { Product } from './types'
import { useProductStore } from './productStore'

export type CartItem = Pick<Product, 'id' | 'name' | 'image'> & {
  qty: number
  price: number
}

type AllCartsData = {
  [userId: string]: CartItem[]
}

type CartState = {
  items: CartItem[]
  subtotal: number
  totalShipping: number
  totalTax: number
  total: number
  init: (userId: string) => void
  add: (userId: string, item: CartItem) => void
  remove: (userId: string, id: string) => void
  setQty: (userId: string, id: string, qty: number) => void
  clear: () => void
  clearCartFromDB: (userId: string) => void
}

const calculateTotals = (items: CartItem[]) => {
  const products = useProductStore.getState().products;
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  
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

  const calculatedTax = items.reduce((acc, cartItem) => {
    const product = products.find(p => p.id === cartItem.id)
    const taxRate = product?.taxPercent || 0
    return acc + (cartItem.price * cartItem.qty * (taxRate / 100));
  }, 0)

  const totalTax = Math.min(calculatedTax, 500); // Cap the tax at 500

  const total = subtotal + totalShipping + totalTax
  return { subtotal, totalShipping, totalTax, total }
}

const getAllCarts = (): AllCartsData => {
  return safeGet('all-carts', {});
}

const saveAllCarts = (data: AllCartsData) => {
  safeSet('all-carts', data);
}

export const useCart = create<CartState>()((set, get) => ({
  items: [],
  subtotal: 0,
  totalShipping: 0,
  totalTax: 0,
  total: 0,
  init: (userId: string) => {
    const allCarts = getAllCarts();
    const userCart = allCarts[userId] || [];
    set({ items: userCart, ...calculateTotals(userCart) });
  },
  add: (userId: string, item: CartItem) => {
    const allCarts = getAllCarts();
    let userCart = allCarts[userId] || [];
    const existing = userCart.find((p) => p.id === item.id)
    
    if (existing) {
      userCart = userCart.map((p) =>
        p.id === item.id ? { ...p, qty: Math.min(99, p.qty + item.qty) } : p
      )
    } else {
      userCart = [...userCart, { ...item, qty: Math.max(1, item.qty) }]
    }

    allCarts[userId] = userCart;
    saveAllCarts(allCarts);
    set({ items: userCart, ...calculateTotals(userCart) });
  },
  remove: (userId: string, id: string) => {
    const allCarts = getAllCarts();
    let userCart = allCarts[userId] || [];
    const newItems = userCart.filter((p) => p.id !== id);
    
    allCarts[userId] = newItems;
    saveAllCarts(allCarts);
    set({ items: newItems, ...calculateTotals(newItems) });
  },
  setQty: (userId: string, id: string, qty: number) => {
    const allCarts = getAllCarts();
    let userCart = allCarts[userId] || [];
    const newItems = userCart.map((p) =>
      p.id === id ? { ...p, qty: Math.max(1, Math.min(99, qty)) } : p
    );

    allCarts[userId] = newItems;
    saveAllCarts(allCarts);
    set({ items: newItems, ...calculateTotals(newItems) });
  },
  clear: () => {
    set({ items: [], subtotal: 0, totalShipping: 0, totalTax: 0, total: 0 })
  },
  clearCartFromDB: (userId: string) => {
    const allCarts = getAllCarts();
    allCarts[userId] = [];
    saveAllCarts(allCarts);
    get().clear();
  }
}))
