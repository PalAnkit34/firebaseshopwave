
import Link from 'next/link';
import Image from 'next/image';
import BannerSlider from '@/components/BannerSlider';
import { PRODUCTS } from '@/lib/sampleData';
import ProductCard from '@/components/ProductCard';

const categories = [
  { name: 'Tech', href: '/search?category=Tech', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartphones gadgets' },
  { name: 'Fashion', href: '/search?category=Fashion', image: 'https://images.unsplash.com/photo-1593032228653-25cb157b70a8?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ethnic wear' },
  { name: 'Home', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=800&auto=format&fit=crop', dataAiHint: 'modern kitchen' },
];

const latestProducts = PRODUCTS.slice(0, 8);

export default function Home() {
  return (
    <div className="space-y-8">
      <BannerSlider />
      
      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group block">
              <div className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={category.dataAiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
                  <div className="mt-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors inline-block">
                    Shop Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
           {latestProducts.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
      
    </div>
  );
}
