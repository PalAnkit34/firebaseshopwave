

'use client'
import { useMemo, Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryGrid from '@/components/CategoryGrid';

const ayurvedicSubCategories = [
  { name: 'Healthy Juice', href: '/search?category=Food%20%26%20Drinks&subcategory=Healthy%20Juice', image: 'https://images.unsplash.com/photo-1652122788538-9aba111c550e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxqdWljZSUyMGJvdHRsZXN8ZW58MHx8fHwxNzU2Mzc5MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'juice bottles' },
  { name: 'Ayurvedic Medicine', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine', image: 'https://images.unsplash.com/photo-1705083649602-03c5fbae2e89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxheXVydmVkaWMlMjBoZXJic3xlbnwwfHx8fDE3NTYzNzg5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'ayurvedic herbs' },
  { name: 'Homeopathic Medicines', href: '/search?category=Ayurvedic&subcategory=Homeopathic Medicines', image: 'https://images.unsplash.com/photo-1694035449621-8fe51b28f59f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxoZXJiYWwlMjByZW1lZHl8ZW58MHx8fHwxNzU2Mzc4OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'herbal remedy' },
  { name: 'Churna', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine&tertiaryCategory=Churna', image: 'https://images.unsplash.com/photo-1704650312022-ed1a76dbed1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxoZXJiYWwlMjBwb3dkZXJ8ZW58MHx8fHwxNzU2Mzc4OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'herbal powder' },
  { name: 'Pooja Items', href: '/search?category=Pooja', image: 'https://images.unsplash.com/photo-1723937188995-beac88d36998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwb29qYSUyMGl0ZW1zfGVufDB8fHx8MTc1NjM3ODk3N3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'pooja items' },
  { name: 'Daily Needs', href: '/search?category=Groceries', image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Z3JvY2VyeSUyMHN0b3JlfGVufDB8fHx8MTc1NjM3ODk3N3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'grocery store' },
];

const ayurvedicTertiaryCategories: Record<string, any[]> = {
    'Ayurvedic Medicine': [
        { name: 'Ark', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine&tertiaryCategory=Ark', image: 'https://plus.unsplash.com/premium_photo-1678737104381-37466967733a?w=800&auto=format&fit=crop&q=60', dataAiHint: 'herbal extract' },
        { name: 'Tablets', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine&tertiaryCategory=Tablets', image: 'https://images.unsplash.com/photo-1598870783995-62955132c389?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ayurvedic herbs' },
        { name: 'Oil', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine&tertiaryCategory=Oil', image: 'https://images.unsplash.com/photo-1572455324483-c359ae4878a2?w=800&auto=format&fit=crop&q=60', dataAiHint: 'herbal oil' },
        { name: 'Skin Care', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine&tertiaryCategory=Skin Care', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=60', dataAiHint: 'natural cosmetics' },
    ],
}


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

const foodAndDrinksCategories = [
  { name: 'Beverages', href: '/search?category=Food%20%26%20Drinks&subcategory=Beverages', image: 'https://images.unsplash.com/photo-1551024709-8f232a510e52?q=80&w=800&auto=format&fit=crop', dataAiHint: 'cold beverages' },
  { name: 'Dry Fruits', href: '/search?category=Food%20%26%20Drinks&subcategory=Dry%20Fruits', image: 'https://images.unsplash.com/photo-1595425126622-db139b5523f0?q=80&w=800&auto=format&fit=crop', dataAiHint: 'assorted nuts' },
  { name: 'Healthy Juice', href: '/search?category=Food%20%26%20Drinks&subcategory=Healthy%20Juice', image: 'https://images.unsplash.com/photo-1578852632225-17a4c48a472c?q=80&w=800&auto=format&fit=crop', dataAiHint: 'juice bottles' },
];


function CategoryHeader({ title, description, linkText, bannerImages, categories, bannerColor = "bg-gray-100", buttonColor = "bg-primary" }: { title: string, description: string, linkText: string, bannerImages: string[], categories: any[], bannerColor?: string, buttonColor?:string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (bannerImages.length === 0) return;
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [bannerImages.length]);

    return (
        <div className="space-y-8 mb-8">
            <section>
                <div className={`relative overflow-hidden rounded-2xl p-6 md:p-12 ${bannerColor}`}>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="text-center md:text-left z-10">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{title}</h1>
                            <p className="mt-4 text-gray-600">{description}</p>
                            <Link href="#product-grid" className={`mt-6 inline-block text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors ${buttonColor}`}>
                                {linkText}
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-full">
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1, ease: 'easeInOut' }}
                                    className="absolute inset-0"
                                >
                                    {bannerImages.length > 0 && (
                                        <Image
                                            src={bannerImages[currentImageIndex]}
                                            alt="Category Banner"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
            
            <CategoryGrid categories={categories} buttonColor={buttonColor} />
        </div>
    );
}

function SearchContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const [isFilterOpen, setFilterOpen] = useState(false)
  const opts = {
    q: sp.get('query') || undefined,
    category: sp.get('category') || undefined,
    subcategory: sp.get('subcategory') || undefined,
    tertiaryCategory: sp.get('tertiaryCategory') || undefined,
    min: sp.get('min') ? Number(sp.get('min')) : undefined,
    max: sp.get('max') ? Number(sp.get('max')) : undefined,
    brand: sp.get('brand') || undefined,
    rating: sp.get('rating') ? Number(sp.get('rating')) : undefined,
    sort: (sp.get('sort') as any) || undefined,
  }
  
  const list = useMemo(() => filterProducts(PRODUCTS, opts), [sp])
  
  const renderCategoryHeader = () => {
    if (opts.q || opts.subcategory || opts.tertiaryCategory) return null;

    switch (opts.category) {
        case 'Ayurvedic':
            return <CategoryHeader 
                title="100% Pure Ayurvedic Products"
                description="Get authentic Ashram products delivered right to your doorstep, anywhere in India!"
                linkText="Shop Now"
                bannerImages={[
                    "https://storage.googleapis.com/stabl-media/pro-101/476e93e2-8958-4796-913a-f110a3070659.png",
                    "https://images.unsplash.com/photo-1591185854599-0734914c814b?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1558642144-3c82255d6b38?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={ayurvedicSubCategories}
                bannerColor="bg-green-50"
                buttonColor="bg-green-700 hover:bg-green-800"
            />
        case 'Tech':
            return <CategoryHeader 
                title="Latest in Electronics"
                description="Discover cutting-edge technology and get the best deals on all electronic gadgets."
                linkText="Explore Tech"
                bannerImages={[
                    "https://images.unsplash.com/photo-1550009158-94ae76552485?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={techCategories}
                bannerColor="bg-blue-50"
                buttonColor="bg-blue-600 hover:bg-blue-700"
            />
        case 'Fashion':
             return <CategoryHeader 
                title="Trendsetting Styles"
                description="Update your wardrobe with the latest trends in fashion. Unbeatable prices."
                linkText="Shop Fashion"
                bannerImages={[
                    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={fashionCategories}
                bannerColor="bg-pink-50"
                buttonColor="bg-pink-500 hover:bg-pink-600"
            />
        case 'Food & Drinks':
             return <CategoryHeader 
                title="Delicious Food & Drinks"
                description="Explore our range of healthy and tasty beverages and dry fruits."
                linkText="Shop Now"
                bannerImages={[
                    "https://images.unsplash.com/photo-1497515114629-481d0be42f57?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1627833055909-6d1a19b3a7b5?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={foodAndDrinksCategories}
                bannerColor="bg-orange-50"
                buttonColor="bg-orange-500 hover:bg-orange-600"
            />
        default:
             if (!opts.category) {
                 return <CategoryHeader 
                    title="Explore Our Products"
                    description="Find everything you need from tech gadgets to ayurvedic essentials."
                    linkText="Shop All"
                    bannerImages={[
                         "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1200&auto=format&fit=crop",
                         "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
                    ]}
                    categories={[
                        { name: 'Tech', href: '/search?category=Tech', image: techCategories[0].image, dataAiHint: 'latest gadgets' },
                        { name: 'Fashion', href: '/search?category=Fashion', image: fashionCategories[0].image, dataAiHint: 'stylish apparel' },
                        { name: 'Ayurvedic', href: '/search?category=Ayurvedic', image: ayurvedicSubCategories[1].image, dataAiHint: 'natural remedies' },
                        { name: 'Food & Drinks', href: '/search?category=Food%20%26%20Drinks', image: foodAndDrinksCategories[0].image, dataAiHint: 'delicious food' },
                        { name: 'Groceries', href: '/search?category=Groceries', image: ayurvedicSubCategories.find(c => c.name === 'Daily Needs')?.image || '', dataAiHint: 'fresh groceries' },
                        { name: 'Pooja Items', href: '/search?category=Pooja', image: ayurvedicSubCategories.find(c => c.name === 'Pooja Items')?.image || '', dataAiHint: 'holy items' },
                    ]}
                />
            }
            return null;
    }
  }

  const renderTertiaryCategoryHeader = () => {
      const sub = opts.subcategory;
      if (!sub || opts.tertiaryCategory) return null;
      
      const subcategoryTertiary = [...new Set(PRODUCTS
          .filter(p => p.subcategory === sub && p.tertiaryCategory)
          .map(p => p.tertiaryCategory!)
      )].map(tc => ({
          name: tc.replace(/-/g, ' '),
          href: `/search?category=${opts.category}&subcategory=${sub}&tertiaryCategory=${tc}`,
          image: PRODUCTS.find(p => p.tertiaryCategory === tc)?.image || 'https://picsum.photos/400/300',
          dataAiHint: tc.toLowerCase()
      }));

      if(subcategoryTertiary.length === 0) return null;

      return <CategoryHeader 
            title={sub.replace(/-/g, ' ')}
            description="Traditional and effective remedies for your health and well-being."
            linkText="Explore Now"
            bannerImages={[]}
            categories={subcategoryTertiary}
            bannerColor="bg-emerald-50"
            buttonColor="bg-emerald-700 hover:bg-emerald-800"
        />
  }
  
  const PageTitle = () => {
    if (opts.q) {
      return <h1 className="text-2xl font-bold mb-4">Search results for &quot;{opts.q}&quot;</h1>
    }
    
    if (!opts.category) {
        return null;
    }

    const Breadcrumb = () => (
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/search" className="hover:text-brand">Home</Link>
        {opts.category && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <Link href={`/search?category=${opts.category}`} className="hover:text-brand">
              {opts.category}
            </Link>
          </>
        )}
        {opts.subcategory && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <Link href={`/search?category=${opts.category}&subcategory=${opts.subcategory}`} className="hover:text-brand">
              {opts.subcategory.replace(/-/g, ' ')}
            </Link>
          </>
        )}
        {opts.tertiaryCategory && (
          <>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-semibold text-gray-700">
                {opts.tertiaryCategory.replace(/-/g, ' ')}
            </span>
          </>
        )}
      </nav>
    );

    return (
        <div className="flex items-center gap-2">
            <button onClick={() => router.back()} className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
                <ChevronLeft size={20} />
            </button>
            <Breadcrumb />
        </div>
    );
  }


  const shouldRenderProductGrid = list.length > 0 && (opts.q || opts.subcategory || opts.tertiaryCategory || (opts.category && !['Ayurvedic', 'Tech', 'Fashion', 'Food & Drinks'].includes(opts.category)));


  return (
    <>
      {renderCategoryHeader()}
      {renderTertiaryCategoryHeader()}
      
      <div id="product-grid" className="scroll-mt-20">
        <div className="md:hidden">
          <CategoryPills />
        </div>
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="hidden md:block">
            <Filters />
          </aside>
          <section>
            <PageTitle />
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <Sheet open={isFilterOpen} onOpenChange={setFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <div className="p-4 overflow-y-auto">
                                    <h3 className="text-lg font-semibold mb-4">Filters</h3>
                                    <Filters />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm text-gray-600">Showing {list.length} result{list.length === 1 ? '' : 's'}</div>
                      {opts.q && !opts.subcategory && <div className="text-xs text-gray-500">for &quot;{opts.q}&quot;</div>}
                    </div>
                </div>
              <SortBar />
            </div>
            {list.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
