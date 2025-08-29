
'use client'
import { useState } from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AddressManager from '@/components/AddressManager'
import { useOrders } from '@/lib/ordersStore'
import { useWishlist } from '@/lib/wishlistStore'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
}

const AuthForm = () => {
    const { login } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const { toast } = useToast();

    const handleLogin = () => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast({
                title: "Invalid Phone Number",
                description: "Please enter a valid phone number with a country code (e.g., +919876543210).",
                variant: "destructive"
            });
            return;
        }
        login(phoneNumber);
        toast({ title: "Login Successful!", description: "Welcome back." });
    };

    return (
        <div className="mx-auto max-w-sm card p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Login or Sign Up</h1>
            <p className="text-sm text-gray-500 mb-4">Enter your phone number to continue. No password or OTP needed.</p>
            <div className="space-y-4">
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +919876543210"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <Button onClick={handleLogin} className="w-full">
                    Login / Sign Up
                </Button>
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
                        <p className="text-sm text-gray-500">{user.id}</p>
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
