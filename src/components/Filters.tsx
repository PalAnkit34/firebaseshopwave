'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react';
import { PRODUCTS } from '@/lib/sampleData';

export default function Filters(){
  const router = useRouter(); 
  const sp = useSearchParams(); 
  const path = usePathname();
  
  const set = (patch: Record<string,string|number|undefined|null>) => {
    const url = new URLSearchParams(sp.toString())
    Object.entries(patch).forEach(([k,v]) => {
      if (v === undefined || v === '' || v === null) {
        url.delete(k);
      } else {
        url.set(k, String(v));
      }
    });
    router.replace(`${path}?${url.toString()}`);
  }

  const { availableSubcategories, activeSubcategory } = useMemo(() => {
    const currentCategory = sp.get('category');
    if (!currentCategory) return { availableSubcategories: [], activeSubcategory: null };
    
    const subcategories = [...new Set(PRODUCTS
      .filter(p => p.category === currentCategory && p.subcategory)
      .map(p => p.subcategory!)
    )];

    return { 
      availableSubcategories: subcategories,
      activeSubcategory: sp.get('subcategory')
    };
  }, [sp]);

  const handleSubcategoryChange = (subcategory: string, checked: boolean) => {
    if (checked) {
      set({ subcategory });
    } else {
      set({ subcategory: null });
    }
  };

  return (
    <div className="space-y-4">
      {availableSubcategories.length > 0 && (
        <div className="rounded-xl border p-3">
          <div className="mb-2 text-sm font-medium">Category</div>
          <div className="space-y-2">
            {availableSubcategories.map(sub => (
              <label key={sub} className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  checked={activeSubcategory === sub}
                  onChange={(e) => handleSubcategoryChange(sub, e.target.checked)}
                />
                {sub.replace('-', ' ')}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border p-3">
        <div className="mb-2 text-sm font-medium">Price</div>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" className="w-full rounded-lg border px-2 py-1 text-sm" defaultValue={sp.get('min')||''} onBlur={e=>set({ min: e.target.value||undefined })}/>
          <span>-</span>
          <input type="number" placeholder="Max" className="w-full rounded-lg border px-2 py-1 text-sm" defaultValue={sp.get('max')||''} onBlur={e=>set({ max: e.target.value||undefined })}/>
        </div>
      </div>

      <div className="rounded-xl border p-3">
        <div className="mb-2 text-sm font-medium">Brand</div>
        <select className="w-full rounded-lg border px-2 py-1 text-sm" defaultValue={sp.get('brand')||''} onChange={e=>set({ brand: e.target.value||undefined })}>
          <option value="">All</option>
          <option>Samsung</option>
          <option>DesiWear</option>
          <option>HerbCare</option>
          <option>Apple</option>
          <option>Google</option>
          <option>Dell</option>
          <option>Asus</option>
          <option>Sony</option>
        </select>
      </div>

      <div className="rounded-xl border p-3">
        <div className="mb-2 text-sm font-medium">Rating</div>
        <select className="w-full rounded-lg border px-2 py-1 text-sm" defaultValue={sp.get('rating')||''} onChange={e=>set({ rating: e.target.value||undefined })}>
          <option value="">Any</option>
          <option value="4">4★ & up</option>
          <option value="3">3★ & up</option>
        </select>
      </div>
    </div>
  )
}
