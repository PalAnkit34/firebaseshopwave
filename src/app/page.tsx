
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BannerSlider from '@/components/BannerSlider';
import { PRODUCTS } from '@/lib/sampleData';
import ProductCard from '@/components/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import PriceTag from '@/components/PriceTag';
import type { Product } from '@/lib/types';


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


const techDeals = PRODUCTS.filter(p => p.category === 'Tech' && p.price.discounted && p.quantity > 0).slice(0, 8);
const fashionDeals = PRODUCTS.filter(p => p.category === 'Fashion' && p.price.discounted && p.quantity > 0).slice(0, 8);
const ayurvedicDeals = PRODUCTS.filter(p => p.category === 'Ayurvedic' && p.price.discounted && p.quantity > 0).slice(0, 8);
const filterCategories = ['All', 'Tech', 'Fashion', 'Ayurvedic'];
const PRODUCTS_TO_SHOW = 10;

const useProductCycler = (products: Product[], interval: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, interval);
    return () => clearInterval(timer);
  }, [products.length, interval]);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + products.length) % products.length);
  };

  return {
    currentProduct: products[currentIndex],
    handleNext,
    handlePrev,
    currentIndex
  };
};

function OfferCard({ title, products, href }: { title: string; products: Product[]; href: string }) {
  const { currentProduct, handleNext, handlePrev } = useProductCycler(products, 4000);

  if (!products || products.length === 0) return null;

  return (
    <div className="card p-3 h-full flex flex-col">
      <h3 className="font-bold text-md mb-2">{title}</h3>
      <div className="relative flex-grow">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full h-full"
        >
          <CarouselContent>
            {products.map((p, index) => (
              <CarouselItem key={index}>
                <Link href={`/product/${p.slug}`} className="block w-full h-full relative rounded-lg overflow-hidden group aspect-square">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="25vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
      <Link href={href} className="block mt-3 text-center text-sm font-semibold text-brand hover:underline">
        See all deals
      </Link>
    </div>
  );
}


export default function Home() {
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_TO_SHOW);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    const inStockProducts = PRODUCTS.filter(p => p.quantity > 0);
    if (selectedCategory === 'All') {
      return inStockProducts;
    }
    return inStockProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(PRODUCTS_TO_SHOW);
  };
  
  const handleViewMore = () => {
    setVisibleCount(prevCount => prevCount + PRODUCTS_TO_SHOW);
  };

  return (
    <div className="space-y-8">
      <BannerSlider />
      
      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Today's Best Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <OfferCard title="Top Tech Deals" products={techDeals} href="/search?category=Tech"/>
            <OfferCard title="Latest in Fashion" products={fashionDeals} href="/search?category=Fashion"/>
            <OfferCard title="Ayurvedic Essentials" products={ayurvedicDeals} href="/search?category=Ayurvedic"/>
        </div>
      </section>

      <section>
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
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>
        
        <div className="flex justify-center mb-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 bg-gray-100 rounded-full p-1">
            {filterCategories.map(c => (
              <button 
                key={c} 
                onClick={() => handleCategoryClick(c)} 
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCategory === c ? 'bg-brand text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
           {visibleProducts.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        
        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleViewMore}
              className="rounded-xl bg-brand/90 px-8 py-3 font-semibold text-white transition-colors hover:bg-brand"
            >
              View More
            </button>
          </div>
        )}
      </section>
      
    </div>
  );
}
