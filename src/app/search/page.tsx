
'use client'
import { useMemo, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/sampleData'
import { filterProducts } from '@/lib/search'
import Filters from '@/components/Filters'
import SortBar from '@/components/SortBar'
import ProductCard from '@/components/ProductCard'
import CategoryPills from '@/components/CategoryPills'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Filter } from 'lucide-react'

const ayurvedicCategories = [
  { name: 'Healthy Juice', href: '/search?category=Groceries&subcategory=Beverages', image: 'https://images.unsplash.com/photo-1578852632225-17a4c48a472c?q=80&w=800&auto=format&fit=crop', dataAiHint: 'juice bottles' },
  { name: 'Ayurvedic Medicine', href: '/search?category=Ayurvedic', image: 'https://images.unsplash.com/photo-1598870783995-62955132c389?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ayurvedic herbs' },
  { name: 'Homeopathy', href: '/search?category=Homeopathy', image: 'https://images.unsplash.com/photo-1631049354023-866d3a95f50f?q=80&w=800&auto=format&fit=crop', dataAiHint: 'herbal remedy' },
  { name: 'Churna', href: '/search?category=Ayurvedic&subcategory=Herbal-Powders', image: 'https://images.unsplash.com/photo-1545249390-6b7f2d0d4d1a?q=80&w=800&auto=format&fit=crop', dataAiHint: 'herbal powder' },
  { name: 'Pooja Items', href: '/search?category=Pooja', image: 'https://images.unsplash.com/photo-1604580862942-5340152a7813?q=80&w=800&auto=format&fit=crop', dataAiHint: 'pooja items' },
  { name: 'Daily Needs', href: '/search?category=Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'grocery store' },
];


function AyurvedicHeader() {
    return (
        <div className="space-y-8 mb-8">
            <section>
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 p-6 md:p-12">
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="text-center md:text-left z-10">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Buy Online 100% Pure Products at Best Price</h1>
                            <p className="mt-4 text-gray-600">Get all Ashram Products Delivered Anywhere in India - Order from your Home!</p>
                            <Link href="/search?category=Ayurvedic" className="mt-6 inline-block bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition-colors">
                                Shop Now
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-full">
                            <Image
                            src="https://storage.googleapis.com/stabl-media/pro-101/476e93e2-8958-4796-913a-f110a3070659.png"
                            alt="Ayurvedic Products Collage"
                            fill
                            className="object-contain"
                            data-ai-hint="ayurvedic products"
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {ayurvedicCategories.map((category) => (
                    <Link key={category.name} href={category.href} className="group block relative aspect-video overflow-hidden rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300">
                        <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={category.dataAiHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-3 md:p-4 text-white">
                        <h3 className="text-lg md:text-xl font-semibold">{category.name}</h3>
                        <div className="mt-1 bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-700 transition-colors inline-block">
                            Shop Now
                        </div>
                        </div>
                    </Link>
                ))}
                </div>
            </section>
        </div>
    );
}

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
  
  const isAyurvedic = opts.category === 'Ayurvedic';

  return (
    <>
      {isAyurvedic && <AyurvedicHeader />}
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
                <ProductCard key={p.id} p={p} />
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
