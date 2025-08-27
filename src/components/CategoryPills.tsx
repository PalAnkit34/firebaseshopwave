'use client'
import { useRouter, useSearchParams } from 'next/navigation'
const cats = ['All','Tech','Fashion','Ayurvedic']
export default function CategoryPills(){
  const router = useRouter(); const sp = useSearchParams(); const active = sp.get('category') || 'All'

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(sp.toString());
    params.set('category', category);
    if (category === 'All') {
      params.delete('category');
    }
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
      {cats.map(c => (
        <button 
          key={c} 
          onClick={()=> handleCategoryClick(c)} 
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${active===c?'bg-brand text-white shadow':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}
