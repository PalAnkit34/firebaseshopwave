
'use client'
import { create } from 'zustand'
import type { Product } from './types'

type ProductState = {
  products: Product[]
  isLoading: boolean
  init: () => Promise<void>
  revalidate: () => Promise<void>
  addProduct: (productData: Omit<Product, 'id' | 'ratings'>) => Promise<void>
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id' | 'ratings'>>) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
}

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
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products from API');
      }
      const products: Product[] = await response.json();
      set({ products, isLoading: false });
    } catch (error) {
      console.error("Error fetching products from API:", error);
      set({ isLoading: false }); // Stop loading even if there's an error
    }
  },
  addProduct: async (productData) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to add product');
    }
    // Re-fetch all products to ensure UI is in sync with the database
    await get().revalidate();
  },
  updateProduct: async (productId, productData) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to update product');
    }
    // Re-fetch all products to ensure UI is in sync with the database
    await get().revalidate();
  },
  deleteProduct: async (productId) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete product');
    }
    // Re-fetch all products to ensure UI is in sync with the database
    await get().revalidate();
  },
}));

// Initialize the store immediately for all pages to fetch products on app start.
useProductStore.getState().init();
