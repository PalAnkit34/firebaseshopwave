import Link from 'next/link';
import { ShoppingCart, Heart, Search } from 'lucide-react';

export default function TechHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-transparent text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ShopWave
        </Link>
        <div className="flex items-center gap-4">
          <button>
            <Search className="h-6 w-6" />
          </button>
          <button>
            <Heart className="h-6 w-6" />
          </button>
          <button>
            <ShoppingCart className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
