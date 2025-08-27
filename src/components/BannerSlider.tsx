'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const BANNERS = [
  { id:1, img:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop', title:'Big Tech Deals', link:'/search?category=Tech' },
  { id:2, img:'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1600&auto=format&fit=crop', title:'Festive Fashion Sale', link:'/search?category=Fashion' },
  { id:3, img:'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop', title:'Ayurvedic Essentials', link:'/search?category=Ayurvedic' },
]

export default function BannerSlider(){
  const [idx, setIdx] = useState(0)
  useEffect(() => { const t = setInterval(()=> setIdx(i => (i+1)%BANNERS.length), 4000); return ()=>clearInterval(t) }, [])
  const b = BANNERS[idx]
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-2xl md:h-64">
      <AnimatePresence>
        <motion.a 
          key={b.id} 
          href={b.link} 
          className="absolute inset-0"
          initial={{opacity:0, scale:1.05}} 
          animate={{opacity:1, scale:1}} 
          exit={{opacity:0, scale:1.05}} 
          transition={{duration:0.7, ease: 'easeInOut'}}
        >
          <Image src={b.img} alt={b.title} fill sizes="100vw" className="object-cover"/>
        </motion.a>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-sm font-medium backdrop-blur-sm">{b.title}</div>
      <div className="absolute bottom-3 right-3 flex gap-1">
        {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}></button>
        ))}
      </div>
    </div>
  )
}
