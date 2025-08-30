
'use client'
import { create } from 'zustand'
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from './types'
import { PRODUCTS as localProducts } from './sampleData'

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
      const backendProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      // Merge local and backend products
      // Use a Map to handle potential duplicates, giving priority to backend products
      const productMap = new Map<string, Product>();
      
      // First, add all local products
      localProducts.forEach(p => productMap.set(p.id, p));

      // Then, overwrite with backend products if IDs match, or add if new
      backendProducts.forEach(p => productMap.set(p.id, p));
      
      const combinedProducts = Array.from(productMap.values());

      set({ products: combinedProducts, isLoading: false });
    }, (error) => {
      console.error("Error fetching products:", error);
      // Fallback to local products if firestore fails
      set({ products: localProducts, isLoading: false });
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
