'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { safeGet, safeSet } from './storage'

const WishCtx = createContext<{ ids: string[]; toggle: (id: string) => void; has: (id: string) => boolean }>({ ids: [], toggle: () => {}, has: () => false })

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [ids, setIds] = useState<string[]>(safeGet<string[]>('wishlist', []))
  useEffect(() => { safeSet('wishlist', ids) }, [ids])
  const toggle = (id: string) => setIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const has = (id: string) => ids.includes(id)
  return <WishCtx.Provider value={{ ids, toggle, has }}>{children}</WishCtx.Provider>
}
export const useWishlist = () => useContext(WishCtx)
