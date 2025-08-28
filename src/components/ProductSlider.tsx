
import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'

export default function ProductSlider({ products }: { products: Product[] }) {
  return (
    <div className="no-scrollbar -mx-3 flex gap-3 overflow-x-auto px-3 pb-2">
      {products.map(p => (
        <div key={p.id} className="w-[calc(50%-6px)] min-w-[calc(50%-6px)] md:w-[280px] md:min-w-[280px]">
          <ProductCard p={p} />
        </div>
      ))}
    </div>
  )
}
