'use client'
import Link from 'next/link'
import PriceTag from './PriceTag'
import RatingStars from './RatingStars'
import WishlistButton from './WishlistButton'
import { useCart } from '@/lib/cartStore'
import { motion } from 'framer-motion'
import ProductSuggestionsRow from './ProductSuggestionsRow'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import { Button } from './ui/button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function ProductCard({ p, suggest }: { p: Product; suggest?: any[] }) {
  const { add } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const price = p.price.discounted ?? p.price.original
  
  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Please Login", description: "You need to be logged in to add items to your cart.", variant: "destructive" });
      return;
    }
    add(user.id, { id: p.id, qty: 1, price, name: p.name, image: p.image });
    toast({ title: "Added to Cart", description: `${p.name} has been added to your cart.` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-2 flex flex-col group"
    >
      <div className="relative">
        <Link href={`/product/${p.slug}`}>
          <div className="relative w-full h-32 overflow-hidden">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
              className="rounded-lg object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="absolute right-1 top-1">
          <WishlistButton id={p.id} />
        </div>
      </div>
      <div className="flex-grow flex flex-col pt-2 px-1">
        <Link href={`/product/${p.slug}`} className="flex-grow">
          <div className="line-clamp-2 h-9 text-sm font-medium">{p.name}</div>
          <RatingStars value={p.ratings?.average ?? 0} />
          <div className="mt-1">
            <PriceTag original={p.price.original} discounted={p.price.discounted} />
          </div>
        </Link>
        <div className="mt-2">
            {p.quantity > 0 ? (
                <Button onClick={handleAddToCart} size="sm" className="w-full h-9">
                    Add to Cart
                </Button>
            ) : (
                <Button size="sm" className="w-full h-9" disabled>
                    Out of Stock
                </Button>
            )}
        </div>
      </div>
      {/* Below-card suggestions */}
      {suggest && suggest.length > 0 && (
        <div className="mt-4 border-t pt-2">
          <div className="mb-1 text-xs font-medium text-gray-500">Customers also viewed</div>
          <ProductSuggestionsRow products={suggest} />
        </div>
      )}
    </motion.div>
  )
}
