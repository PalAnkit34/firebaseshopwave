import Link from 'next/link';
import Image from 'next/image';
import BannerSlider from '@/components/BannerSlider';

const categories = [
  { name: 'Tech', href: '/search?category=Tech', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', dataAiHint: 'smartphones gadgets' },
  { name: 'Fashion', href: '/search?category=Fashion', image: 'https://images.unsplash.com/photo-1593032228653-25cb157b70a8?q=80&w=800&auto=format&fit=crop', dataAiHint: 'ethnic wear' },
  { name: 'Home', href: '/search?category=Home', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=800&auto=format&fit=crop', dataAiHint: 'modern kitchen' },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <BannerSlider />
      
      <section className="bg-gray-100 rounded-2xl">
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800">Buy Online 100% Pure Products at Best Price</h2>
                    <p className="mt-4 text-gray-600">Get all Ashram Products Delivered Anywhere in India - Order from your Home!</p>
                    <Link href="/search?category=Ayurvedic" className="mt-6 inline-block bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition-colors">
                        Shop Now
                    </Link>
                </div>
                <div className="relative h-64 md:h-96">
                    <Image 
                        src="https://images.unsplash.com/photo-1600115332243-55f673449d85?q=80&w=800&auto=format&fit=crop"
                        alt="Ayurvedic Products"
                        fill
                        className="object-contain"
                        data-ai-hint="ayurvedic products collage"
                    />
                </div>
            </div>
        </div>
      </section>

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
