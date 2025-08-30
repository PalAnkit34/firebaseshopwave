
'use client'
import { create } from 'zustand'
import type { Product } from './types'
import { AYURVEDIC_PRODUCTS } from './sampleData'
import { HOME_PRODUCTS } from './data/home'
import { TECH_PRODUCTS } from './data/tech'

const ALL_SAMPLE_PRODUCTS = [...AYURVEDIC_PRODUCTS, ...HOME_PRODUCTS, ...TECH_PRODUCTS];

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
    set({ isLoading: true });
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products from API, using local fallback.');
      }
      const products: Product[] = await response.json();
      set({ products, isLoading: false });
    } catch (error) {
      console.warn("API Error:", error instanceof Error ? error.message : String(error));
      // Use the combined sample data as a fallback
      set({ products: ALL_SAMPLE_PRODUCTS, isLoading: false });
    }
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
      console.error("Error revalidating products:", error);
      // Don't fall back here, to avoid overwriting potentially good stale data
      set({ isLoading: false });
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
