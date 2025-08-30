
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
    if (get().products.length > 0 && !get().isLoading) {
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

      // In a real app, you might only use backendProducts.
      // Here, we merge with local sample data to ensure the store is always populated.
      const productMap = new Map<string, Product>();
      // Prioritize backend data over local data
      localProducts.forEach(p => productMap.set(p.id, p));
      backendProducts.forEach(p => productMap.set(p.id, p));
      
      const combinedProducts = Array.from(productMap.values());
      set({ products: combinedProducts, isLoading: false });
    } catch (error) {
      console.error("Error fetching products from Firestore:", error);
      // Fallback to local products if firestore fails
      set({ products: localProducts, isLoading: false }); 
    }
  },
  addProduct: async (productData) => {
    const docRef = await addDoc(productCollectionRef, {
      ...productData,
      ratings: { average: 4.5, count: 1 }, // Default ratings for new products
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Optimistically update the UI, then revalidate
    const newProduct = { ...productData, id: docRef.id, ratings: { average: 4.5, count: 1 } };
    set(state => ({ products: [...state.products, newProduct] }));
    await get().revalidate();
  },
  updateProduct: async (productId, productData) => {
    const productDocRef = doc(db, 'products', productId);
    await updateDoc(productDocRef, {
      ...productData,
      updatedAt: serverTimestamp(),
    });
     // Optimistically update the UI, then revalidate
    set(state => ({
        products: state.products.map(p => p.id === productId ? { ...p, ...productData } as Product : p)
    }));
    await get().revalidate();
  },
  deleteProduct: async (productId) => {
    const productDocRef = doc(db, 'products', productId);
    await deleteDoc(productDocRef);
    // Optimistically update the UI, then revalidate
    set(state => ({ products: state.products.filter(p => p.id !== productId) }));
    await get().revalidate();
  },
}));

// Initialize the store immediately for all pages to fetch products on app start.
useProductStore.getState().init();
