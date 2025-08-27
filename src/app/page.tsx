import BannerSlider from '@/components/BannerSlider'
import CategoryPills from '@/components/CategoryPills'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS } from '@/lib/sampleData'

export default function Home(){
  const suggestions = (cat:string, exceptId:string) => PRODUCTS.filter(p => p.category===cat && p.id!==exceptId).slice(0,6).map(p=>({ slug:p.slug, image:p.image, name:p.name, price:p.price.discounted ?? p.price.original }))
  
  return (
    <div className="space-y-5 pt-4 md:pt-0">
      <BannerSlider />
      <section>
        <h2 className="mb-2 text-lg font-semibold">Shop by Category</h2>
        <CategoryPills />
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Top Deals for You</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
          {PRODUCTS.map(p => (
            <ProductCard key={p.id} p={p} suggest={suggestions(p.category, p.id)} />
          ))}
        </div>
      </section>
    </div>
  )
}
