
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

const techCategories = [
  { name: 'Mobiles', href: '/search?category=Tech&subcategory=Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartphones gadgets' },
  { name: 'Laptops', href: '/search?category=Tech&subcategory=Laptops', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop', dataAiHint: 'modern laptop' },
  { name: 'Audio', href: '/search?category=Tech&subcategory=Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'headphones audio' },
  { name: 'Cameras', href: '/search?category=Tech&subcategory=Cameras', image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800&auto=format&fit=crop', dataAiHint: 'dslr camera' },
  { name: 'Wearables', href: '/search?category=Tech&subcategory=Wearables', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartwatch technology' },
  { name: 'Accessories', href: '/search?category=Tech&subcategory=Accessories', image: 'https://images.unsplash.com/photo-1615663245642-9904791cd90f?q=80&w=800&auto=format&fit=crop', dataAiHint: 'computer mouse' },
];

const fashionCategories = [
    { name: 'Men\'s Casual', href: '/search?category=Fashion&subcategory=Men-Casual', image: 'https://images.unsplash.com/photo-1602293589922-3a5682d3809d?q=80&w=800&auto=format&fit=crop', dataAiHint: 'denim shirt' },
    { name: 'Women\'s Ethnic', href: '/search?category=Fashion&subcategory=Women-Ethnic', image: 'https://images.unsplash.com/photo-1622354223106-24c01798835d?q=80&w=800&auto=format&fit=crop', dataAiHint: 'anarkali kurta' },
    { name: 'Footwear', href: '/search?category=Fashion&subcategory=Footwear', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop', dataAiHint: 'stylish sneakers' },
    { name: 'Men\'s Ethnic', href: '/search?category=Fashion&subcategory=Men-Ethnic', image: 'https://images.unsplash.com/photo-1593032228653-25cb157b70a8?q=80&w=800&auto=format&fit=crop', dataAiHint: 'cotton kurta' },
    { name: 'Women\'s Western', href: '/search?category=Fashion&subcategory=Women-Western', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop', dataAiHint: 'floral dress' },
    { name: 'Accessories', href: '/search?category=Fashion&subcategory=Accessories', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', dataAiHint: 'sunglasses fashion' },
];

function CategoryHeader({ title, description, linkText, bannerImage, categories, bannerColor = "bg-gray-100", buttonColor = "bg-brand" }: { title: string, description: string, linkText: string, bannerImage: string, categories: any[], bannerColor?: string, buttonColor?:string }) {
    return (
        <div className="space-y-8 mb-8">
            <section>
                <div className={`relative overflow-hidden rounded-2xl p-6 md:p-12 ${bannerColor}`}>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="text-center md:text-left z-10">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{title}</h1>
                            <p className="mt-4 text-gray-600">{description}</p>
                            <Link href="/search?category=Ayurvedic" className={`mt-6 inline-block text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors ${buttonColor}`}>
                                {linkText}
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-full">
                            <Image
                            src={bannerImage}
                            alt="Category Banner"
                            fill
                            className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {categories.map((category) => (
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
                        <div className={`mt-1 text-white px-3 py-1 rounded-md text-xs font-semibold transition-colors inline-block ${buttonColor}`}>
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
  
  const renderCategoryHeader = () => {
    switch (opts.category) {
        case 'Ayurvedic':
            return <CategoryHeader 
                title="Buy Online 100% Pure Products at Best Price"
                description="Get all Ashram Products Delivered Anywhere in India - Order from your Home!"
                linkText="Shop Now"
                bannerImage="https://storage.googleapis.com/stabl-media/pro-101/476e93e2-8958-4796-913a-f110a3070659.png"
                categories={ayurvedicCategories}
                bannerColor="bg-green-50"
                buttonColor="bg-green-700 hover:bg-green-800"
            />
        case 'Tech':
            return <CategoryHeader 
                title="Latest in Electronics"
                description="Discover cutting-edge technology and get the best deals on all electronic gadgets."
                linkText="Explore Tech"
                bannerImage="https://images.unsplash.com/photo-1550009158-94ae76552485?q=80&w=1200&auto=format&fit=crop"
                categories={techCategories}
                bannerColor="bg-blue-50"
                buttonColor="bg-blue-600 hover:bg-blue-700"
            />
        case 'Fashion':
             return <CategoryHeader 
                title="Trendsetting Styles"
                description="Update your wardrobe with the latest trends in fashion. Unbeatable prices."
                linkText="Shop Fashion"
                bannerImage="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop"
                categories={fashionCategories}
                bannerColor="bg-pink-50"
                buttonColor="bg-pink-500 hover:bg-pink-600"
            />
        default:
            return null;
    }
  }

  return (
    <>
      {renderCategoryHeader()}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
