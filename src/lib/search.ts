
import Fuse from 'fuse.js'
import type { Product } from './types'

// IDs of specific products to feature across categories
const FEATURED_HOME_PRODUCT_IDS = [
  'P_HOME_BA_01', 
  'P_HOME_KW_01', 
  'P_HOME_KW_02', 
  'P_HOME_KW_03'
];

export const liveSearch = (q: string, products: Product[]) => {
  if (!q.trim()) return []
  const fuse = new Fuse(products, { keys: ['name','brand','category','tags'], includeScore: true, threshold: 0.4 })
  return fuse.search(q).slice(0, 8).map(r => r.item)
}

export const filterProducts = (products: Product[], opts: { q?: string; category?: string; subcategory?:string; tertiaryCategory?:string; min?: number; max?: number; brand?: string; rating?: number; sort?: 'new'|'priceAsc'|'priceDesc'|'popular' }) => {
  let list = [...products]
  
  // Custom sort to push out-of-stock items to the end first
  list.sort((a, b) => {
    const aInStock = a.quantity > 0 ? 1 : 0;
    const bInStock = b.quantity > 0 ? 1 : 0;
    return bInStock - aInStock;
  });

  if (opts.q) {
    const fuse = new Fuse(products, { keys: ['name','brand','category','tags'], threshold: 0.4 });
    list = fuse.search(opts.q).map(result => result.item);
  }

  // Handle category filtering
  if (opts.category && opts.category !== 'All') {
    const featuredHomeProducts = products.filter(p => FEATURED_HOME_PRODUCT_IDS.includes(p.id));
    
    if (opts.category === 'Pooja') {
      list = list.filter(p => p.category === 'Pooja' || p.subcategory === 'Puja-Essentials');
    } else if (opts.category === 'Tech') {
      // For 'Tech', include actual tech products AND the featured home products
      const techProducts = list.filter(p => p.category === 'Tech');
      const uniqueFeatured = featuredHomeProducts.filter(fp => !techProducts.some(tp => tp.id === fp.id));
      list = [...techProducts, ...uniqueFeatured];
    } else {
      list = list.filter(p => p.category === opts.category);
    }
  }
  
  if (opts.subcategory) list = list.filter(p => p.subcategory === opts.subcategory)
  if (opts.tertiaryCategory) list = list.filter(p => p.tertiaryCategory === opts.tertiaryCategory)
  if (opts.brand) list = list.filter(p => p.brand === opts.brand)
  if (opts.rating) list = list.filter(p => (p.ratings?.average ?? 0) >= opts.rating!)
  if (typeof opts.min === 'number') list = list.filter(p => (p.price.discounted ?? p.price.original) >= opts.min!)
  if (typeof opts.max === 'number') list = list.filter(p => (p.price.discounted ?? p.price.original) <= opts.max!)
  
  // Further sorting on the (now stock-sorted) list
  switch (opts.sort) {
    case 'priceAsc': list.sort((a,b) => (a.price.discounted ?? a.price.original) - (b.price.discounted ?? b.price.original)); break
    case 'priceDesc': list.sort((a,b) => (b.price.discounted ?? b.price.original) - (a.price.discounted ?? a.price.original)); break
    case 'popular': list.sort((a,b) => (b.ratings?.count ?? 0) - (a.ratings?.count ?? 0)); break;
    // case 'new': list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    default: break
  }
  
  // Re-apply stock sorting to preserve it after other sorts
  list.sort((a, b) => {
    const aInStock = a.quantity > 0 ? 1 : 0;
    const bInStock = b.quantity > 0 ? 1 : 0;
    return bInStock - aInStock;
  });

  return list
}
