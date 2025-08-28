
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/types';

const useProductCycler = (products: Product[], count: number, interval: number) => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (products.length <= count) return;
    
    const timer = setInterval(() => {
      setStartIndex(prevIndex => (prevIndex + count) % products.length);
    }, interval);

    return () => clearInterval(timer);
  }, [products.length, count, interval]);

  const getVisibleProducts = () => {
    const visible: Product[] = [];
    for (let i = 0; i < count; i++) {
        visible.push(products[(startIndex + i) % products.length]);
    }
    return visible;
  }

  return getVisibleProducts();
};

export default function OfferCard({ title, products, href }: { title: string; products: Product[]; href: string }) {
  const visibleProducts = useProductCycler(products, 4, 3000);

  return (
    <div className="card p-4 shrink-0 w-[calc(100%-2rem)] md:w-[320px]">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">Top picks for you</p>
        <div className="relative grid grid-cols-2 grid-rows-2 gap-2 aspect-square">
             <AnimatePresence>
                {visibleProducts.map((p, index) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href={`/product/${p.slug}`} className="block w-full h-full relative rounded-lg overflow-hidden group">
                            <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="25vw"
                                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                        </Link>
                    </motion.div>
                ))}
             </AnimatePresence>
        </div>
        <Link href={href} className="block mt-4 text-center text-sm font-semibold text-brand hover:underline">
            See all deals
        </Link>
    </div>
  );
}
