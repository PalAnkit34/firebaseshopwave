'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WishlistState = {
  ids: string[]
  hasNewItem: boolean
  toggle: (id: string) => void
  has: (id: string) => boolean
  clearNewItemStatus: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      hasNewItem: false,
      toggle: (id: string) => {
        set((state) => {
          const exists = state.ids.includes(id)
          if (exists) {
            return { ids: state.ids.filter((x) => x !== id) }
          }
          // Only set notification for new items
          return { ids: [...state.ids, id], hasNewItem: true }
        })
      },
      has: (id: string) => {
        return get().ids.includes(id)
      },
      clearNewItemStatus: () => {
        set({ hasNewItem: false })
      },
    }),
    { name: 'wishlist-storage' }
  )
)
