import Fuse from 'fuse.js'
import { PRODUCTS } from './sampleData'

const fuse = new Fuse(PRODUCTS, { keys: ['name','brand','category','tags'], includeScore: true, threshold: 0.4 })

export const liveSearch = (q: string) => {
  if (!q.trim()) return [] as typeof PRODUCTS
  return fuse.search(q).slice(0, 8).map(r => r.item)
}

export const filterProducts = (opts: { q?: string; category?: string; min?: number; max?: number; brand?: string; rating?: number; sort?: 'new'|'priceAsc'|'priceDesc'|'popular' }) => {
  let list = [...PRODUCTS]
  if (opts.q) {
    const set = new Set(liveSearch(opts.q).map(p => p.id))
    list = list.filter(p => set.has(p.id))
  }
  if (opts.category && opts.category !== 'All') list = list.filter(p => p.category === opts.category)
  if (opts.brand) list = list.filter(p => p.brand === opts.brand)
  if (opts.rating) list = list.filter(p => (p.ratings?.average ?? 0) >= opts.rating!)
  if (typeof opts.min === 'number') list = list.filter(p => (p.price.discounted ?? p.price.original) >= opts.min!)
  if (typeof opts.max === 'number') list = list.filter(p => (p.price.discounted ?? p.price.original) <= opts.max!)
  switch (opts.sort) {
    case 'priceAsc': list.sort((a,b) => (a.price.discounted ?? a.price.original) - (b.price.discounted ?? b.price.original)); break
    case 'priceDesc': list.sort((a,b) => (b.price.discounted ?? b.price.original) - (a.price.discounted ?? a.price.original)); break
    case 'popular': list.sort((a,b) => (b.ratings?.count ?? 0) - (a.ratings?.count ?? 0)); break
    default: break
  }
  return list
}
