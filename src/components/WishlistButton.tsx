
'use client'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlistStore'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function WishlistButton({ id }: { id: string }) {
  const { has, toggle } = useWishlist()
  const [isWished, setIsWished] = useState(false)

  // Avoid hydration mismatch by setting state after mount
  useEffect(() => {
    setIsWished(has(id))
  }, [has, id])

  const handleToggle = () => {
    toggle(id)
    setIsWished(!isWished)
  }

  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Wishlist" 
      onClick={handleToggle} 
      className={`rounded-full p-2 transition-colors ${isWished ? 'bg-red-100 text-red-500' : 'bg-gray-100/80 text-gray-600 hover:bg-red-100/50 hover:text-red-500'}`}
    >
      <Heart className={`h-5 w-5 ${isWished ? 'fill-red-500' : 'fill-transparent'}`} />
    </motion.button>
  )
}
