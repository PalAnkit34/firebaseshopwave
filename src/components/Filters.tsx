'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Filters(){
  const router = useRouter(); const sp = useSearchParams(); const path = usePathname()
  const set = (patch: Record<string,string|number|undefined>) => {
    const url = new URLSearchParams(sp.toString())
    Object.entries(patch).forEach(([k,v]) => v===undefined || v === '' ? url.delete(k) : url.set(k, String(v)))
    router.replace(`${path}?${url.toString()}`)
  }

  return (
    <div className="space-y-4">
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
