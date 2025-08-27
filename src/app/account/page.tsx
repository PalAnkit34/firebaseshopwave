'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (isLogin) {
        if (email === 'user@example.com' && password === 'password') {
            setSuccess('Login successful! Redirecting...');
        } else {
            setError('Invalid credentials. (Hint: use user@example.com)');
        }
    } else {
        if (fullName && email && password) {
            setSuccess('Registration successful! You can now log in.');
            setIsLogin(true);
        } else {
            setError('Please fill all fields.');
        }
    }
    setIsLoading(false);
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
          <p className="text-center text-sm text-gray-500 mb-4">This is a mock authentication screen. No real accounts are created.</p>
          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            {error && <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-md bg-green-100 p-3 text-sm text-green-700">{success}</div>}
            {!isLogin && (
              <input 
                className="w-full rounded-lg border px-3 py-2 text-sm" 
                placeholder="Full Name" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required 
              />
            )}
            <input 
              className="w-full rounded-lg border px-3 py-2 text-sm" 
              placeholder="Email Address" 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              className="w-full rounded-lg border px-3 py-2 text-sm" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full rounded-xl bg-brand py-2.5 font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
            <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }} 
              className="w-full rounded-xl border py-2 text-sm font-semibold transition-colors hover:bg-gray-50"
            >
              {isLogin ? 'New user? Create account' : 'Already have an account? Login'}
            </button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
