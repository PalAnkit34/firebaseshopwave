
'use client'
import { create } from 'zustand'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

type WishlistState = {
  ids: string[]
  hasNewItem: boolean
  isLoading: boolean
  init: (userId: string) => () => void
  toggle: (userId: string, productId: string) => Promise<void>
  has: (id: string) => boolean
  clearNewItemStatus: () => void
  clear: () => void
}

export const useWishlist = create<WishlistState>()((set, get) => ({
  ids: [],
  hasNewItem: false,
  isLoading: true,
  init: (userId: string) => {
    set({ isLoading: true });
    const docRef = doc(db, 'wishlists', userId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ ids: docSnap.data().productIds || [], isLoading: false });
      } else {
        // Create the document if it doesn't exist for a new user
        setDoc(docRef, { productIds: [] });
        set({ ids: [], isLoading: false });
      }
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  },
  toggle: async (userId: string, productId: string) => {
    const docRef = doc(db, 'wishlists', userId);
    const exists = get().ids.includes(productId);

    if (exists) {
      await updateDoc(docRef, {
        productIds: arrayRemove(productId)
      });
    } else {
      await updateDoc(docRef, {
        productIds: arrayUnion(productId)
      });
      set({ hasNewItem: true });
    }
  },
  has: (id: string) => {
    return get().ids.includes(id)
  },
  clearNewItemStatus: () => {
    set({ hasNewItem: false })
  },
  clear: () => {
    set({ ids: [], isLoading: true, hasNewItem: false });
  }
}));
