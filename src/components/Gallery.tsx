'use client'
import { useState } from 'react'
import SafeImage from './SafeImage'
import Image from 'next/image'

export default function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  if (!images || images.length === 0) {
    return <div className="aspect-square w-full rounded-xl bg-gray-200" />
  }

  return (
    <div>
      <SafeImage src={images[active]} alt={`Product image ${active + 1}`} className="mb-3 aspect-square w-full rounded-2xl" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button 
            key={i} 
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === active ? 'border-brand' : 'border-transparent hover:border-brand/50'}`} 
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
          >
            <div className="relative h-full w-full">
                <Image src={src} alt={`thumbnail ${i + 1}`} fill className="object-cover" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
