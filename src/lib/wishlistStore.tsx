
'use client'
import { create } from 'zustand'
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore'
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

const getDocRef = (userId: string) => doc(db, 'wishlists', userId);

export const useWishlist = create<WishlistState>()((set, get) => ({
  ids: [],
  hasNewItem: false,
  isLoading: true,
  init: (userId: string) => {
    set({ isLoading: true });
    const docRef = getDocRef(userId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ ids: docSnap.data().productIds || [], isLoading: false });
      } else {
        // Create the document if it doesn't exist for a new user
        setDoc(docRef, { productIds: [] });
        set({ ids: [], isLoading: false });
      }
    }, (error) => {
        console.error("Error in wishlist snapshot listener:", error);
        set({ isLoading: false });
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  },
  toggle: async (userId: string, productId: string) => {
    const docRef = getDocRef(userId);
    const exists = get().ids.includes(productId);

    try {
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
    } catch (error) {
       // If the document doesn't exist, create it first
      if ((error as any).code === 'not-found') {
        await setDoc(docRef, { productIds: [productId] });
        set({ hasNewItem: true });
      } else {
        console.error("Error toggling wishlist:", error);
      }
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
