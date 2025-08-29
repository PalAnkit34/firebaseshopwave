
'use client'
import { useState } from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AddressManager from '@/components/AddressManager'
import { useOrders } from '@/lib/ordersStore'
import { useWishlist } from '@/lib/wishlistStore'
import { useAuth } from '@/context/AuthContext'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
}

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { toast } = useToast();

    const handleAuthAction = async () => {
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast({ title: "Login Successful!", description: "Welcome back." });
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast({ title: "Signup Successful!", description: "Your account has been created." });
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            toast({ title: "Authentication Error", description: error.message, variant: "destructive" });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast({ title: "Login Successful!", description: "Welcome!" });
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            toast({ title: "Google Sign-In Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="mx-auto max-w-sm card p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h1>
            <div className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <Button onClick={handleAuthAction} className="w-full">
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>
                <Button onClick={handleGoogleSignIn} variant="outline" className="w-full flex items-center gap-2">
                    <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 244 504 110.1 504 0 393.9 0 256S110.1 8 244 8c66.8 0 126.9 25.8 171.4 68.3L354.7 137.9C323.5 109.4 287.4 92 244 92c-77.2 0-140 62.8-140 140s62.8 140 140 140c83.6 0 122.3-61.4 125.8-92.7H244v-75.5h243.2c1.3 7.8 2.8 15.3 2.8 23.3z"></path>
                    </svg>
                    Sign in with Google
                </Button>
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-500 hover:underline">
                    {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};


export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const [activeSection, setActiveSection] = useState(accountSections.DASHBOARD)
  const { hasNewOrder } = useOrders()
  const { hasNewItem } = useWishlist()
  
  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!user) {
    return <AuthForm />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case accountSections.ADDRESSES:
        return <AddressManager onBack={() => setActiveSection(accountSections.DASHBOARD)} />
      case accountSections.DASHBOARD:
      default:
        return (
          <div>
            <div className="card p-4 md:p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Welcome!</h2>
                        <p className="text-sm text-gray-500">{user.email || user.phoneNumber}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <DashboardCard icon={Package} title="My Orders" href="/orders" hasNotification={hasNewOrder} />
                <DashboardCard icon={Heart} title="Wishlist" href="/wishlist" hasNotification={hasNewItem} />
                <DashboardCard icon={MapPin} title="My Addresses" onClick={() => setActiveSection(accountSections.ADDRESSES)} />
                <DashboardCard icon={LifeBuoy} title="Help Center" href="#" />
            </div>

            <div className="card p-4">
                 <AccountLink title="Logout" icon={LogOut} onClick={logout} />
            </div>
          </div>
        )
    }
  }

  return (
     <motion.div
      key={activeSection}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="mx-auto max-w-2xl"
    >
      {renderSection()}
    </motion.div>
  )
}

const DashboardCard = ({ icon: Icon, title, href, onClick, hasNotification }: { icon: React.ElementType, title: string, href?: string, onClick?: () => void, hasNotification?: boolean }) => {
  const content = (
      <div className="card p-4 text-center flex flex-col items-center justify-center h-full relative">
          {hasNotification && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full blinking-dot"></div>}
          <Icon className="w-8 h-8 text-brand" />
          <h3 className="font-semibold">{title}</h3>
      </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return <button onClick={onClick} className="w-full">{content}</button>;
};

const AccountLink = ({ title, icon: Icon, onClick }: { title: string, icon: React.ElementType, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{title}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
)
