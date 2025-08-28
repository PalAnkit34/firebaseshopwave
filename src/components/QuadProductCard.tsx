
import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface QuadProductCardProps {
  title: string;
  products: Product[];
}

export default function QuadProductCard({ title, products }: QuadProductCardProps) {
  if (products.length < 4) {
    // Fill with placeholders if not enough products are provided
    const placeholders = Array.from({ length: 4 - products.length }).map((_, i) => ({
        id: `placeholder-${i}`,
        slug: '#',
        name: 'Coming Soon',
        image: 'https://picsum.photos/200/200',
        price: { original: 0 },
        category: '',
        brand: '',
        quantity: 0,
        description: ''
    }));
    products = [...products, ...placeholders];
  }

  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {products.slice(0, 4).map((p) => (
          <Link href={p.slug === '#' ? '#' : `/product/${p.slug}`} key={p.id} className="group block">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 25vw, 15vw"
                className="object-cover transition-transform group-hover:scale-105"
                data-ai-hint={`${p.category.toLowerCase()} ${p.brand.toLowerCase()}`}
              />
            </div>
            <p className="mt-1 truncate text-xs font-medium text-gray-700 group-hover:text-brand">
              {p.name}
            </p>
          </Link>
        ))}
      </div>
      <Link href={`/search?category=${products[0]?.category || ''}`} className="mt-3 block text-sm font-semibold text-brand hover:underline">
        See more
      </Link>
    </div>
  );
}
