
import ProductCard from './ProductCard'
import type { Product } from '@/lib/types'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 rounded-xl border bg-white">
        <p className="text-gray-600">No products found.</p>
        <p className="text-sm text-gray-500">Please try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {products.map(p => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  )
}
