'use client'
import { useMemo, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PRODUCTS } from '@/lib/sampleData'
import { filterProducts } from '@/lib/search'
import Filters from '@/components/Filters'
import SortBar from '@/components/SortBar'
import ProductCard from '@/components/ProductCard'
import CategoryPills from '@/components/CategoryPills'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Filter } from 'lucide-react'

function SearchContent() {
  const sp = useSearchParams()
  const [isFilterOpen, setFilterOpen] = useState(false)
  const opts = {
    q: sp.get('query') || undefined,
    category: sp.get('category') || undefined,
    subcategory: sp.get('subcategory') || undefined,
    min: sp.get('min') ? Number(sp.get('min')) : undefined,
    max: sp.get('max') ? Number(sp.get('max')) : undefined,
    brand: sp.get('brand') || undefined,
    rating: sp.get('rating') ? Number(sp.get('rating')) : undefined,
    sort: (sp.get('sort') as any) || undefined,
  }
  
  const list = useMemo(() => filterProducts(PRODUCTS, opts), [sp])
  
  const suggestions = (cat:string, exceptId:string) => PRODUCTS.filter(p => p.category===cat && p.id!==exceptId).slice(0,6).map(p=>({ slug:p.slug, image:p.image, name:p.name, price:p.price.discounted ?? p.price.original }))

  return (
    <>
      <div className="md:hidden">
        <CategoryPills />
      </div>
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <Filters />
        </aside>
        <section>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-grow">
                <div className="flex items-center gap-4">
                     <div className="md:hidden">
                        <Sheet open={isFilterOpen} onOpenChange={setFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <div className="p-4">
                                     <h3 className="text-lg font-semibold mb-4">Filters</h3>
                                    <Filters />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Showing {list.length} result{list.length === 1 ? '' : 's'}</div>
                      {opts.q && <div className="text-xs text-gray-500">for "{opts.q}"</div>}
                    </div>
                </div>
            </div>
            <SortBar />
          </div>
          {list.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {list.map(p => (
                <ProductCard key={p.id} p={p} suggest={suggestions(p.category, p.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 rounded-xl border bg-white">
                <p className="text-gray-600">No products found.</p>
                <p className="text-sm text-gray-500">Try adjusting your filters.</p>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
