
'use client'
import { create } from 'zustand'
import { doc, onSnapshot, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import type { Order, Address, PaymentMethod } from './types'
import type { CartItem } from './cartStore'

type OrdersState = {
  orders: Order[]
  isLoading: boolean
  hasNewOrder: boolean
  init: (userId: string | null) => () => void
  placeOrder: (userId: string, items: CartItem[], address: Address, total: number, payment: PaymentMethod) => Promise<Order>
  updateOrderStatus: (userId: string, orderId: string, status: Order['status']) => Promise<void>
  clearNewOrderStatus: () => void
  clear: () => void
}

const getDocRef = (userId: string) => doc(db, 'orders', userId);

export const useOrders = create<OrdersState>()((set, get) => ({
  orders: [],
  isLoading: true,
  hasNewOrder: false,
  init: (userId) => {
    set({ isLoading: true });
    
    // If userId is provided, we listen to a specific user's orders document.
    if (userId) {
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
    } 
    // If no userId (for admin), we fetch all order documents individually.
    else {
        const collRef = collection(db, 'orders');
        const unsubscribe = onSnapshot(collRef, async (querySnapshot) => {
            const allOrders: Order[] = [];
            for (const doc of querySnapshot.docs) {
                 const data = doc.data();
                 if (data.list) {
                    allOrders.push(...data.list);
                 }
            }
            set({ orders: allOrders, isLoading: false });
        }, (error) => {
            console.error("Error fetching all orders:", error);
            set({ isLoading: false }); // Stop loading on error
        });
        return unsubscribe;
    }
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
    const currentOrders = get().orders;
    const newOrders = [order, ...currentOrders];
    await setDoc(docRef, { list: newOrders, hasNewOrder: true });
    set({ hasNewOrder: true }); 
    return order;
  },
  updateOrderStatus: async (userId: string, orderId: string, status: Order['status']) => {
    const docRef = getDocRef(userId);
    const state = get();
    // In admin view, state.orders contains all orders. Find the specific user's orders.
    const allDocsSnapshot = await getDocs(collection(db, 'orders'));
    let targetDocRef: any = null;
    let userOrders: Order[] = [];

    for (const doc of allDocsSnapshot.docs) {
        const ordersList = doc.data().list as Order[];
        if (ordersList.some(o => o.address.phone === userId)) {
            targetDocRef = doc.ref;
            userOrders = ordersList;
            break;
        }
    }

    if (!targetDocRef) {
        console.error("Could not find document for user:", userId);
        return;
    }

    const newOrders = userOrders.map(o => 
      o.id === orderId ? { ...o, status: status } : o
    );
    await updateDoc(targetDocRef, { list: newOrders });
  },
  clearNewOrderStatus: async () => {
     set({ hasNewOrder: false });
  },
  clear: () => {
    set({ orders: [], isLoading: true, hasNewOrder: false });
  }
}));
