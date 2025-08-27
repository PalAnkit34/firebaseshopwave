import Link from 'next/link';
import Image from 'next/image';
import BannerSlider from '@/components/BannerSlider';
import { PRODUCTS } from '@/lib/sampleData';
import ProductCard from '@/components/ProductCard';

const categories = [
  { name: 'Healthy Juice', href: '/search?category=Groceries&subcategory=Beverages', image: 'https://images.unsplash.com/photo-1578852632225-17a4c48a472c?q=80&w=800&auto=format&fit=crop', dataAiHint: 'juice bottles' },
  { name: 'Ayurvedic Medicine', href: '/search?category=Ayurvedic', image: 'https://images.unsplash.com/photo-1598870783995-62955132c389?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ayurvedic herbs' },
  { name: 'Homeopathy', href: '/search?category=Homeopathy', image: 'https://images.unsplash.com/photo-1631049354023-866d3a95f50f?q=80&w=800&auto=format&fit=crop', dataAiHint: 'herbal remedy' },
  { name: 'Churna', href: '/search?category=Ayurvedic&subcategory=Herbal-Powders', image: 'https://images.unsplash.com/photo-1545249390-6b7f2d0d4d1a?q=80&w=800&auto=format&fit=crop', dataAiHint: 'herbal powder' },
  { name: 'Pooja Items', href: '/search?category=Pooja', image: 'https://images.unsplash.com/photo-1604580862942-5340152a7813?q=80&w=800&auto=format&fit=crop', dataAiHint: 'pooja items' },
  { name: 'Daily Needs', href: '/search?category=Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop', dataAiHint: 'grocery store' },
];

const latestAyurvedicProducts = PRODUCTS.filter(p => p.category === 'Ayurvedic').slice(0, 6);

export default function Home() {
  return (
    <div className="space-y-8">
      <BannerSlider />
      
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
                   <div className="mt-1 bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-700 transition-colors inline-block">
                    Shop Now
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-center">Our Latest Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
           {latestAyurvedicProducts.map(p => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
      
    </div>
  );
}
