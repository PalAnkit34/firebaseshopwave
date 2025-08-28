'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type WishlistState = {
  ids: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id: string) => {
        set((state) => {
          const exists = state.ids.includes(id)
          if (exists) {
            return { ids: state.ids.filter((x) => x !== id) }
          }
          return { ids: [...state.ids, id] }
        })
      },
      has: (id: string) => {
        return get().ids.includes(id)
      },
    }),
    { name: 'wishlist-storage' }
  )
)
