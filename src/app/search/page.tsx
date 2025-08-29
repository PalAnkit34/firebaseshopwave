

'use client'
import { useMemo, Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { filterProducts } from '@/lib/search'
import Filters from '@/components/Filters'
import SortBar from '@/components/SortBar'
import ProductCard from '@/components/ProductCard'
import CategoryPills from '@/components/CategoryPills'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Filter, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryGrid from '@/components/CategoryGrid';
import { cn } from '@/lib/utils';
import { useProductStore } from '@/lib/productStore';

const topCategories = [
  { name: 'Pooja Essentials', href: '/search?category=Pooja', image: 'https://images.unsplash.com/photo-1629828325255-2cb25c165a63?q=80&w=400&auto=format&fit=crop', dataAiHint: 'pooja items' },
  { name: 'Best Selling', href: '/search?sort=popular', image: 'https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=400&auto=format&fit=crop', dataAiHint: 'sale offer' },
  { name: 'New Arrivals', href: '/search?sort=new', image: 'https://images.unsplash.com/photo-1524678606370-a47625cb810c?q=80&w=400&auto=format&fit=crop', dataAiHint: 'new products' },
  { name: 'Corporate Gifting', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?q=80&w=400&auto=format&fit=crop', dataAiHint: 'corporate gifts' },
  { name: 'Home & Kitchen', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=400&auto=format&fit=crop', dataAiHint: 'modern kitchen' },
  { name: 'Toys & Games', href: '/search?category=Toys', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=400&auto=format&fit=crop', dataAiHint: 'children toys' },
  { name: 'Cleaning Supplies', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1582735773152-7935fbb1b41f?q=80&w=400&auto=format&fit=crop', dataAiHint: 'cleaning supplies' },
  { name: 'Personal Care', href: '/search?category=Ayurvedic&subcategory=Personal-Care', image: 'https://images.unsplash.com/photo-1631777053082-a7459143992a?q=80&w=400&auto=format&fit=crop', dataAiHint: 'personal care' },
  { name: 'Electronics', href: '/search?category=Tech', image: 'https://images.unsplash.com/photo-1550009158-94ae76552485?q=80&w=400&auto=format&fit=crop', dataAiHint: 'electronic gadgets' },
  { name: 'Home Improvement', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop', dataAiHint: 'modern home' },
  { name: 'Mobile Cover', href: '/search?category=Tech&subcategory=Accessories', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=400&auto=format&fit=crop', dataAiHint: 'phone case' },
  { name: 'Custom Print Products', href: '/search', image: 'https://images.unsplash.com/photo-1506784983877-45594efa4c85?q=80&w=400&auto=format&fit=crop', dataAiHint: 'custom printing' },
];

const ayurvedicSubCategories = [
  { name: 'Healthy Juice', href: '/search?category=Food%20%26%20Drinks&subcategory=Healthy%20Juice', image: 'https://images.unsplash.com/photo-1652122788538-9aba111c550e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxqdWljZSUyMGJvdHRsZXN8ZW58MHx8fHwxNzU2Mzc5MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'juice bottles' },
  { name: 'Ayurvedic Medicine', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine', image: 'https://images.unsplash.com/photo-1705083649602-03c5fbae2e89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxheXVydmVkaWMlMjBoZXJic3xlbnwwfHx8fDE3NTYzNzg5Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'ayurvedic herbs' },
  { name: 'Homeopathic Medicines', href: '/search?category=Ayurvedic&subcategory=Homeopathic Medicines', image: 'https://images.unsplash.com/photo-1694035449621-8fe51b28f59f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxoZXJiYWwlMjByZW1lZHl8ZW58MHx8fHwxNzU2Mzc4OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'herbal remedy' },
  { name: 'Churna', href: '/search?category=Ayurvedic&subcategory=Ayurvedic Medicine&tertiaryCategory=Churna', image: 'https://images.unsplash.com/photo-1704650312022-ed1a76dbed1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxoZXJiYWwlMjBwb3dkZXJ8ZW58MHx8fHwxNzU2Mzc4OTc3fDA&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'herbal powder' },
  { name: 'Pooja Items', href: '/search?category=Pooja', image: 'https://images.unsplash.com/photo-1723937188995-beac88d36998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwb29qYSUyMGl0ZW1zfGVufDB8fHx8MTc1NjM3ODk3N3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'pooja items' },
  { name: 'Daily Needs', href: '/search?category=Groceries', image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Z3JvY2VyeSUyMHN0b3JlfGVufDB8fHx8MTc1NjM3ODk3N3ww&ixlib=rb-4.1.0&q=80&w=1080', dataAiHint: 'grocery store' },
];

const poojaSubCategories = [
    { name: 'Dhoop', href: '/search?category=Pooja&subcategory=Dhoop', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/Pooja%20Items/Dhoop/photo_2024-03-05_07-10-38-300x300.webp?updatedAt=1756372192267', dataAiHint: 'incense dhoop' },
    { name: 'Agarbatti', href: '/search?category=Pooja&subcategory=Agarbatti', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/Pooja%20Items/Aggarbatti/shanti-flora-2-300x300.jpg?updatedAt=1756372078860', dataAiHint: 'incense sticks' },
    { name: 'Aasan and Mala', href: '/search?category=Pooja&subcategory=Aasan%20and%20Mala', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/Pooja%20Items/Aasan%20and%20Mala/1485014052Tulsi-Mala80-300x300.webp?updatedAt=1756371924065', dataAiHint: 'prayer beads' },
    { name: 'Photo Frame', href: '/search?category=Pooja&subcategory=Photo%20Frame', image: 'https://ik.imagekit.io/b5qewhvhb/e%20commers/Pooja%20Items/Photo%20Frame/1643871099bapujiphotoframeL26-300x300.webp?updatedAt=1756372238874', dataAiHint: 'photo frame' },
];

const techCategories = [
  { name: 'Mobiles', href: '/search?category=Tech&subcategory=Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartphones gadgets' },
  { name: 'Laptops', href: '/search?category=Tech&subcategory=Laptops', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop', dataAiHint: 'modern laptop' },
  { name: 'Audio', href: '/search?category=Tech&subcategory=Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'headphones audio' },
  { name: 'Cameras', href: '/search?category=Tech&subcategory=Cameras', image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800&auto=format&fit=crop', dataAiHint: 'dslr camera' },
  { name: 'Wearables', href: '/search?category=Tech&subcategory=Wearables', image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartwatch technology' },
  { name: 'Accessories', href: '/search?category=Tech&subcategory=Accessories', image: 'https://images.unsplash.com/photo-1615663245642-9904791cd90f?q=80&w=800&auto=format&fit=crop', dataAiHint: 'computer mouse' },
];

const homeCategories = [
    { name: 'Decor', href: '/search?category=Home&subcategory=Decor', image: 'https://images.unsplash.com/photo-1534349762230-e09968411995?q=80&w=800&auto=format&fit=crop', dataAiHint: 'home decor' },
    { name: 'Lighting', href: '/search?category=Home&subcategory=Lighting', image: 'https://images.unsplash.com/photo-1617013685142-df02ca451390?q=80&w=800&auto=format&fit=crop', dataAiHint: 'modern lighting' },
    { name: 'Kitchenware', href: '/search?category=Home&subcategory=Kitchenware', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=800&auto=format&fit=crop', dataAiHint: 'kitchenware set' },
    { name: 'Wall Decor', href: '/search?category=Home&subcategory=Wall%20Decor', image: 'https://images.unsplash.com/photo-1579541620958-c6996119565e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'wall art' },
    { name: 'Appliances', href: '/search?category=Home&subcategory=Appliances', image: 'https://images.unsplash.com/photo-1626806819282-2c1dc0165453?q=80&w=800&auto=format&fit=crop', dataAiHint: 'kitchen appliances' },
    { name: 'Smart Home', href: '/search?category=Home&subcategory=Smart-Home', image: 'https://images.unsplash.com/photo-1659024492834-c7b4c6a8f1b2?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smart home' },
];

const foodAndDrinksCategories = [
  { name: 'Beverages', href: '/search?category=Food%20%26%20Drinks&subcategory=Beverages', image: 'https://images.unsplash.com/photo-1551024709-8f232a510e52?q=80&w=800&auto=format&fit=crop', dataAiHint: 'cold beverages' },
  { name: 'Dry Fruits', href: '/search?category=Food%20%26%20Drinks&subcategory=Dry%20Fruits', image: 'https://images.unsplash.com/photo-1595425126622-db139b5523f0?q=80&w=800&auto=format&fit=crop', dataAiHint: 'assorted nuts' },
  { name: 'Healthy Juice', href: '/search?category=Food%20%26%20Drinks&subcategory=Healthy%20Juice', image: 'https://images.unsplash.com/photo-1578852632225-17a4c48a472c?q=80&w=800&auto=format&fit=crop', dataAiHint: 'juice bottles' },
];


function CategoryHeader({ title, description, linkText, bannerImages, categories, bannerColor = "bg-gray-100", buttonColor = "bg-primary" }: { title: string, description: string, linkText: string, bannerImages: string[], categories?: any[], bannerColor?: string, buttonColor?:string }) {
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
                <div className={cn("relative overflow-hidden rounded-2xl p-6 md:p-12", bannerColor)}>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="text-center md:text-left z-10">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">{title}</h1>
                            <p className="mt-4 text-gray-600">{description}</p>
                            <Link href="#product-grid" className={cn("mt-6 inline-block text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors", buttonColor)}>
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
            
            {categories && <CategoryGrid categories={categories} buttonColor={buttonColor} />}
        </div>
    );
}

function SearchContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const { products, isLoading } = useProductStore();
  const [isFilterOpen, setFilterOpen] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(true)

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
  
  const list = useMemo(() => filterProducts(products, opts), [products, sp])
  
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
            return (
                <div className="mb-8">
                  <CategoryHeader 
                      title="Latest in Tech"
                      description="Explore the newest gadgets and accessories to elevate your lifestyle."
                      linkText="Shop Tech"
                      bannerImages={[
                          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop",
                          "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1200&auto=format&fit=crop",
                      ]}
                      bannerColor="bg-blue-50"
                      buttonColor="bg-blue-600 hover:bg-blue-700"
                  />
                  <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4 text-center">Top Categories</h2>
                       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
                        {topCategories.map((category) => (
                          <Link key={category.name} href={category.href} className="group block text-center">
                            <div className="relative aspect-square w-full mx-auto max-w-[150px]">
                              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-b-lg shadow-md"></div>
                              <div className="absolute inset-0 flex items-end justify-center pb-2">
                                 <Image
                                  src={category.image}
                                  alt={category.name}
                                  width={120}
                                  height={120}
                                  className="w-full h-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                                  data-ai-hint={category.dataAiHint}
                                />
                              </div>
                            </div>
                            <h3 className="mt-2 text-sm font-semibold text-gray-700 group-hover:text-brand">{category.name}</h3>
                          </Link>
                        ))}
                      </div>
                  </div>
                </div>
            );
        case 'Home':
             return <CategoryHeader 
                title="Beautiful Home Decor"
                description="Elevate your living space with our curated collection of home accessories."
                linkText="Shop Home"
                bannerImages={[
                    "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={homeCategories}
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
         case 'Pooja':
            return <CategoryHeader 
                title="Sacred Pooja Essentials"
                description="Find all your pooja samagri in one place. Pure and authentic items for your rituals."
                linkText="Explore Items"
                bannerImages={[
                    "https://images.unsplash.com/photo-1629828325255-2cb25c165a63?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1594580236058-f4a4a73455963?q=80&w=1200&auto=format&fit=crop",
                ]}
                categories={poojaSubCategories}
                bannerColor="bg-amber-50"
                buttonColor="bg-amber-600 hover:bg-amber-700"
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
                        { name: 'Home', href: '/search?category=Home', image: homeCategories[0].image, dataAiHint: 'stylish apparel' },
                        { name: 'Ayurvedic', href: '/search?category=Ayurvedic', image: ayurvedicSubCategories[1].image, dataAiHint: 'natural remedies' },
                        { name: 'Food & Drinks', href: '/search?category=Food%20%26%20Drinks', image: foodAndDrinksCategories[0].image, dataAiHint: 'delicious food' },
                        { name: 'Pooja', href: '/search?category=Pooja', image: poojaSubCategories[0].image, dataAiHint: 'pooja items' },
                        { name: 'Groceries', href: '/search?category=Groceries', image: ayurvedicSubCategories.find(c => c.name === 'Daily Needs')?.image || '', dataAiHint: 'fresh groceries' },
                    ]}
                />
            }
            return null;
    }
  }

  const renderTertiaryCategoryHeader = () => {
      const sub = opts.subcategory;
      if (!sub || opts.tertiaryCategory) return null;
      
      const subcategoryTertiary = [...new Set(products
          .filter(p => p.subcategory === sub && p.tertiaryCategory)
          .map(p => p.tertiaryCategory!)
      )].map(tc => ({
          name: tc.replace(/-/g, ' '),
          href: `/search?category=${opts.category}&subcategory=${sub}&tertiaryCategory=${tc}`,
          image: products.find(p => p.tertiaryCategory === tc)?.image || 'https://picsum.photos/400/300',
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


  const shouldRenderProductGrid = list.length > 0 && (opts.q || opts.subcategory || opts.tertiaryCategory || (opts.category && !['Ayurvedic', 'Tech', 'Home', 'Food & Drinks', 'Pooja'].includes(opts.category)));
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <>
      {renderCategoryHeader()}
      {renderTertiaryCategoryHeader()}
      
      <div id="product-grid" className="scroll-mt-20">
        <div className="md:hidden">
          <CategoryPills />
        </div>
        <div className="grid md:grid-cols-[auto_1fr] gap-6">
          <AnimatePresence>
            {isFilterVisible && (
              <motion.aside 
                className="hidden md:block w-[240px]"
                initial={{ width: 0, opacity: 0, x: -100 }}
                animate={{ width: 240, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="sticky top-24">
                  <Filters />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <section>
            <PageTitle />
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
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
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setIsFilterVisible(!isFilterVisible)}
                      className="hidden md:inline-flex"
                    >
                      {isFilterVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                    </Button>
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
      {opts.category === 'Tech' && !opts.subcategory && !opts.tertiaryCategory && (
        <div className="mt-12">
            <CategoryGrid categories={techCategories} buttonColor="bg-blue-600 hover:bg-blue-700" />
        </div>
      )}
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
