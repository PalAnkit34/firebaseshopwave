
'use client'
import { create } from 'zustand'
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import type { Product } from './types'
import { PRODUCTS as localProducts } from './sampleData'

type ProductState = {
  products: Product[]
  isLoading: boolean
  init: () => Promise<void>
  revalidate: () => Promise<void>
  addProduct: (productData: Omit<Product, 'id' | 'ratings'>) => Promise<void>
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id' | 'ratings'>>) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
}

const productCollectionRef = collection(db, 'products');

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  isLoading: true,
  init: async () => {
    // Initial fetch, don't re-fetch if products are already loaded
    if (get().products.length > 0) {
      set({ isLoading: false });
      return;
    }
    await get().revalidate();
  },
  revalidate: async () => {
    set({ isLoading: true });
    try {
      const snapshot = await getDocs(productCollectionRef);
      const backendProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      const productMap = new Map<string, Product>();
      localProducts.forEach(p => productMap.set(p.id, p));
      backendProducts.forEach(p => productMap.set(p.id, p));
      
      const combinedProducts = Array.from(productMap.values());
      set({ products: combinedProducts, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ products: localProducts, isLoading: false }); // Fallback
    }
  },
  addProduct: async (productData) => {
    await addDoc(productCollectionRef, {
      ...productData,
      ratings: { average: 0, count: 0 },
      createdAt: serverTimestamp(),
    });
    await get().revalidate(); // Re-fetch products after adding
  },
  updateProduct: async (productId, productData) => {
    const productDocRef = doc(db, 'products', productId);
    await updateDoc(productDocRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
    await get().revalidate(); // Re-fetch products after updating
  },
  deleteProduct: async (productId) => {
    const productDocRef = doc(db, 'products', productId);
    await deleteDoc(productDocRef);
    await get().revalidate(); // Re-fetch products after deleting
  },
}));

// Initialize the store immediately for all pages
useProductStore.getState().init();
