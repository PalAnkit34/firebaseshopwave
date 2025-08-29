
'use client'
import { create } from 'zustand'
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from './types'

type ProductState = {
  products: Product[]
  isLoading: boolean
  init: () => () => void
  addProduct: (productData: Omit<Product, 'id' | 'ratings'>) => Promise<void>
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id' | 'ratings'>>) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
}

const productCollectionRef = collection(db, 'products');

export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  isLoading: true,
  init: () => {
    const unsubscribe = onSnapshot(productCollectionRef, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      set({ products, isLoading: false });
    }, (error) => {
      console.error("Error fetching products:", error);
      set({ isLoading: false });
    });
    return unsubscribe;
  },
  addProduct: async (productData) => {
    await addDoc(productCollectionRef, {
      ...productData,
      ratings: { average: 0, count: 0 }, // Initial ratings
      createdAt: serverTimestamp(),
    });
  },
  updateProduct: async (productId, productData) => {
    const productDocRef = doc(db, 'products', productId);
    await updateDoc(productDocRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
  },
  deleteProduct: async (productId) => {
    const productDocRef = doc(db, 'products', productId);
    await deleteDoc(productDocRef);
  },
}));

// Initialize the store immediately for all pages
useProductStore.getState().init();
