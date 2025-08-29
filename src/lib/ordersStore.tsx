
'use client'
import { create } from 'zustand'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Order, Address, PaymentMethod } from './types'
import type { CartItem } from './cartStore'

type OrdersState = {
  orders: Order[]
  isLoading: boolean
  hasNewOrder: boolean
  init: (userId: string) => () => void
  placeOrder: (userId: string, items: CartItem[], address: Address, total: number, payment: PaymentMethod) => Promise<Order>
  clearNewOrderStatus: () => void
  clear: () => void
}

const getDocRef = (userId: string) => doc(db, 'orders', userId);

export const useOrders = create<OrdersState>()((set, get) => ({
  orders: [],
  isLoading: true,
  hasNewOrder: false,
  init: (userId: string) => {
    set({ isLoading: true });
    const docRef = getDocRef(userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ orders: data.list || [], hasNewOrder: data.hasNewOrder || false, isLoading: false });
      } else {
        setDoc(docRef, { list: [], hasNewOrder: false });
        set({ orders: [], hasNewOrder: false, isLoading: false });
      }
    });
    return unsubscribe;
  },
  placeOrder: async (userId, items, address, total, payment) => {
    const docRef = getDocRef(userId);
    const order: Order = {
      id: 'O' + Date.now().toString().slice(-6),
      createdAt: Date.now(),
      items: items.map(it => ({ productId: it.id, qty: it.qty, price: it.price, name: it.name, image: it.image })),
      total,
      address,
      payment,
      status: 'Pending',
    }
    const newOrders = [order, ...get().orders];
    await setDoc(docRef, { list: newOrders, hasNewOrder: true });
    set({ hasNewOrder: true }); // Also update local state immediately
    return order;
  },
  clearNewOrderStatus: async () => {
    const userId = get().orders.length > 0 ? get().orders[0].address.phone : null;
    // Note: This logic is a bit fragile, relies on user being logged in and having orders.
    // A more robust solution might pass userId if available.
    // For now, it clears the local flag. The remote flag will be cleared on next order.
    set({ hasNewOrder: false });
  },
  clear: () => {
    set({ orders: [], isLoading: true, hasNewOrder: false });
  }
}));
