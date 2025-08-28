'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PRODUCTS } from '@/lib/sampleData';
import TechHeader from './TechHeader';
import { IndianRupee, Lock, Rocket, ShieldCheck } from 'lucide-react';

const techProducts = PRODUCTS.filter(p => p.category === 'Tech' && p.quantity > 0);

const videoSources = [
  'https://storage.googleapis.com/stabl-media/pro-101/0e753063-952a-4a25-a5da-1b32b91bb674.mp4',
  'https://storage.googleapis.com/stabl-media/pro-101/a02a8093-0b65-4f36-997c-930a6c6e3b5e.mp4',
  'https://storage.googleapis.com/stabl-media/pro-101/a338f9b9-299a-4e6a-85b2-3f40f28326a5.mp4',
];

const featureCards = [
    {
        icon: ShieldCheck,
        title: "1Cr+ Happy Customer's",
        description: "Delighted to have made our millions customer smile!",
    },
    {
        icon: Lock,
        title: "Secure Payment",
        description: "Encrypt financial data to ensure secure payment",
    },
    {
        icon: IndianRupee,
        title: "Lowest Price",
        description: "Best quality product at best rates",
    },
    {
        icon: Rocket,
        title: "Smooth Checkout",
        description: "Fast and effortless payment process",
    }
]

export default function TechLandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <TechHeader />
      <div className="relative h-screen w-full overflow-hidden">
        <Carousel className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent>
            {videoSources.map((src, index) => (
              <CarouselItem key={index}>
                <video
                  className="w-full h-full object-cover"
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto py-12 md:py-20 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
          Featured Products
        </h2>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {techProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                 <Link href={`/product/${product.slug}`} className="group">
                    <div className="overflow-hidden rounded-lg">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold truncate">{product.name}</h3>
                    <p className="text-gray-400">{product.brand}</p>
                 </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

       <div className="container mx-auto py-12 md:py-20 px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {featureCards.map((card, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-gray-900/50">
                        <card.icon className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
