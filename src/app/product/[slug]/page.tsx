
'use client'
import { useMemo, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PRODUCTS } from '@/lib/sampleData'
import Gallery from '@/components/Gallery'
import PriceTag from '@/components/PriceTag'
import RatingStars from '@/components/RatingStars'
import QtyCounter from '@/components/QtyCounter'
import { useCart } from '@/lib/cartStore'
import WishlistButton from '@/components/WishlistButton'
import { ChevronLeft } from 'lucide-react'
import CustomerReviews from '@/components/CustomerReviews'
import ProductGrid from '@/components/ProductGrid'

function ProductDetailContent() {
  const router = useRouter()
  const { slug } = useParams()
  const p = useMemo(() => PRODUCTS.find(p => p.slug === slug), [slug])
  const [qty, setQty] = useState(1)
  const { add } = useCart()

  if (!p) {
    return <div>Product not found</div>
  }

  const price = p.price.discounted ?? p.price.original
  const images = [p.image, ...(p.extraImages||[])]
  const related = PRODUCTS.filter(x => x.category===p.category && x.id!==p.id).slice(0,4)

  const handleBuyNow = () => {
    add({ id:p.id, qty, price, name:p.name, image:p.image });
    router.push('/checkout');
  }

  return (
    <div>
      <button onClick={() => router.back()} className="md:hidden flex items-center gap-1 text-sm text-gray-600 mb-2">
        <ChevronLeft size={16} /> Back
      </button>
      <div className="grid gap-6 md:gap-10 lg:grid-cols-2">
        <div>
          <Gallery images={images} />
        </div>
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold md:text-2xl">{p.name}</h1>
            <WishlistButton id={p.id} />
          </div>
          <div className="mt-1 text-sm text-gray-500">by {p.brand}</div>
          <div className="mt-2"><RatingStars value={p.ratings?.average ?? 0} /></div>
          <div className="mt-3"><PriceTag original={p.price.original} discounted={p.price.discounted} /></div>
          <p className="mt-4 text-sm text-gray-700">{p.shortDescription}</p>
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Quantity</div>
            <QtyCounter value={qty} onChange={n => setQty(Math.max(1, Math.min(10, n)))} />
          </div>
          
          <div className="sticky-cta md:relative md:mt-4 md:border-0 md:p-0">
            <div className="container flex gap-3 py-3 md:p-0">
              <button onClick={()=>add({ id:p.id, qty, price, name:p.name, image:p.image })} className="flex-1 rounded-xl bg-brand/90 py-3 text-white font-semibold transition-colors hover:bg-brand">Add to Cart</button>
              <button onClick={handleBuyNow} className="flex-1 rounded-xl bg-brand py-3 text-white font-semibold transition-colors hover:bg-brand/90">Buy Now</button>
            </div>
          </div>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold">Highlights</h3>
              <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 space-y-1">
                {(p.features||[]).map((f,i)=> <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Specifications</h3>
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {Object.entries(p.specifications||{}).map(([k,v]) => (
                    <tr key={k} className="border-b last:border-0">
                      <td className="w-1/3 py-2 text-gray-500">{k}</td>
                      <td className="py-2 text-gray-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <CustomerReviews product={p} />
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Related Products</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  )
}
