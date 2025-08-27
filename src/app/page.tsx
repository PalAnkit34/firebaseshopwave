import Link from 'next/link';
import Image from 'next/image';
import BannerSlider from '@/components/BannerSlider';

const categories = [
  { name: 'Tech', href: '/search?category=Tech', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartphones gadgets' },
  { name: 'Fashion', href: '/search?category=Fashion', image: 'https://images.unsplash.com/photo-1593032228653-25cb157b70a8?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ethnic wear' },
  { name: 'Ayurvedic', href: '/search?category=Ayurvedic', image: 'https://images.unsplash.com/photo-1545249390-6b7f2d0d4d1a?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ayurvedic herbs' },
];

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
                   <button className="mt-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

       <section className="text-center py-12 bg-green-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-green-800">Ayurvedic Essentials</h1>
        <p className="mt-2 text-lg text-green-700">
          Discover natural wellness with our authentic Ayurvedic products. Handcrafted with care.
        </p>
        <div className="mt-6">
          <Link href="/search?category=Ayurvedic" className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors">
            Explore Ayurveda
          </Link>
        </div>
      </section>
    </div>
  );
}
