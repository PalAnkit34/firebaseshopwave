import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Healthy Juice', from: 30, href: '#', image: 'https://picsum.photos/400/300?random=1', dataAiHint: 'juice bottles' },
  { name: 'Ayurvedic Medicine', from: 20, href: '#', image: 'https://picsum.photos/400/300?random=2', dataAiHint: 'ayurvedic herbs' },
  { name: 'Homeopathic Medicines', from: 40, href: '#', image: 'https://picsum.photos/400/300?random=3', dataAiHint: 'homeopathic remedies' },
  { name: 'Churna', from: 15, href: '#', image: 'https://picsum.photos/400/300?random=4', dataAiHint: 'herbal powder' },
  { name: 'Pooja Items', from: 10, href: '#', image: 'https://picsum.photos/400/300?random=5', dataAiHint: 'pooja thali' },
  { name: 'Daily Needs', from: 25, href: '#', image: 'https://picsum.photos/400/300?random=6', dataAiHint: 'grocery items' },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-green-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-green-800">Ayurvedic Products</h1>
        <p className="mt-2 text-lg text-green-700">
          Discover natural wellness with our authentic Ayurvedic products. Handcrafted with care using traditional methods.
        </p>
        <div className="mt-6 mx-auto max-w-lg">
          <input
            type="search"
            placeholder="Search Ayurvedic products..."
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group block">
              <div className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={category.dataAiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                  <p className="text-gray-200 text-sm">From ₹{category.from}</p>
                  <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
