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

export default function ProductCard({ p, suggest }:{ p: Product, suggest: any[] }){
  const { add } = useCart()
  const price = p.price.discounted ?? p.price.original
  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className="card p-3 flex flex-col">
      <div className="relative">
        <Link href={`/product/${p.slug}`}>
            <div className="relative w-full h-40">
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" className="rounded-xl object-cover"/>
            </div>
        </Link>
        <div className="absolute right-2 top-2">
          <WishlistButton id={p.id} />
        </div>
      </div>
      <div className="flex-grow flex flex-col pt-2">
        <Link href={`/product/${p.slug}`} className="flex-grow">
          <div className="line-clamp-2 h-10 text-sm font-medium">{p.name}</div>
          <RatingStars value={p.ratings?.average ?? 0} />
          <div className="mt-1">
            <PriceTag original={p.price.original} discounted={p.price.discounted} />
          </div>
        </Link>
        <div className="mt-2 flex gap-2">
          <button onClick={()=>add({ id:p.id, qty:1, price, name:p.name, image:p.image })} className="flex-1 rounded-xl bg-brand py-2 text-white text-sm font-semibold transition-colors hover:bg-brand/90">Add to Cart</button>
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
