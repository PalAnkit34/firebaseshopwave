'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AccountPage(){
  const [isLogin, setIsLogin] = useState(true)
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="mx-auto max-w-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
        >
          <h1 className="mb-4 text-center text-2xl font-semibold">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h1>
          <form className="card space-y-4 p-6">
            {!isLogin && <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Full Name" required />}
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Email Address" type="email" required />
            <input type="password" className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Password" required />
            <button className="w-full rounded-xl bg-brand py-2.5 font-semibold text-white transition-colors hover:bg-brand/90">{isLogin ? 'Login' : 'Create Account'}</button>
            <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button type="button" onClick={()=>setIsLogin(!isLogin)} className="w-full rounded-xl border py-2 text-sm font-semibold transition-colors hover:bg-gray-50">
              {isLogin ? 'New user? Create account' : 'Already have an account? Login'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
      <p className="mt-4 text-center text-xs text-gray-500">This is a mock authentication screen. <br/> Connect to your real authentication API later.</p>
    </div>
  )
}
