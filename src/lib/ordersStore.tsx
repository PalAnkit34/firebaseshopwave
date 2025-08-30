
'use client'
import { create } from 'zustand'
import { safeGet, safeSet } from './storage'
import type { Order, Address, PaymentMethod } from './types'
import type { CartItem } from './cartStore'
import { useCart } from './cartStore'

type AllOrdersData = {
  [userId: string]: Order[]
}

type OrdersState = {
  orders: Order[]
  isLoading: boolean
  hasNewOrder: boolean
  init: (userId: string | null) => void
  placeOrder: (userId: string, items: CartItem[], address: Address, total: number, payment: PaymentMethod) => Promise<Order>
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
  clearNewOrderStatus: (userId: string) => void
  clear: () => void
}

const getAllOrders = (): AllOrdersData => {
  return safeGet('all-orders', {});
}

const saveAllOrders = (data: AllOrdersData) => {
  safeSet('all-orders', data);
}

export const useOrders = create<OrdersState>()((set, get) => ({
  orders: [],
  isLoading: true,
  hasNewOrder: false,
  init: (userId) => {
    set({ isLoading: true });
    const allOrdersData = getAllOrders();
    let ordersToShow: Order[] = [];
    let newOrderFlag = false;

    if (userId) { // Regular user
        ordersToShow = (allOrdersData[userId] || []).sort((a, b) => b.createdAt - a.createdAt);
        newOrderFlag = safeGet(`new-order-flag-${userId}`, false);
    } else { // Admin user
        for (const uid in allOrdersData) {
            ordersToShow.push(...allOrdersData[uid]);
        }
        ordersToShow.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    set({ orders: ordersToShow, hasNewOrder: newOrderFlag, isLoading: false });
  },
  placeOrder: async (userId, items, address, total, payment) => {
    const allOrdersData = getAllOrders();
    const userOrders = allOrdersData[userId] || [];
    const { clearCartFromDB } = useCart.getState();

    const order: Order = {
      id: 'O' + Date.now().toString().slice(-6),
      createdAt: Date.now(),
      items: items.map(it => ({ productId: it.id, qty: it.qty, price: it.price, name: it.name, image: it.image })),
      total,
      address,
      payment,
      status: 'Pending',
    }
    const newOrders = [order, ...userOrders];
    allOrdersData[userId] = newOrders;
    saveAllOrders(allOrdersData);
    
    await clearCartFromDB(userId);
    
    safeSet(`new-order-flag-${userId}`, true);
    set({ hasNewOrder: true, orders: newOrders }); 
    return order;
  },
  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    const allOrdersData = getAllOrders();
    let targetUserId: string | null = null;
    let targetOrderIndex = -1;

    for (const uid in allOrdersData) {
      const index = allOrdersData[uid].findIndex(o => o.id === orderId);
      if (index > -1) {
        targetUserId = uid;
        targetOrderIndex = index;
        break;
      }
    }

    if (targetUserId) {
        allOrdersData[targetUserId][targetOrderIndex].status = status;
        saveAllOrders(allOrdersData);
        get().init(null); // Re-init to refresh admin view
    } else {
        console.error("Could not find order to update:", orderId);
    }
  },
  clearNewOrderStatus: (userId: string) => {
     safeSet(`new-order-flag-${userId}`, false);
     set({ hasNewOrder: false });
  },
  clear: () => {
    set({ orders: [], isLoading: true, hasNewOrder: false });
  }
}));
