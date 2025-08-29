
'use client'
import { useState, useEffect } from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AddressManager from '@/components/AddressManager'
import { useOrders } from '@/lib/ordersStore'
import { useWishlist } from '@/lib/wishlistStore'
import { useAuth } from '@/context/AuthContext'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useToast } from '@/hooks/use-toast'

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
}

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const [activeSection, setActiveSection] = useState(accountSections.DASHBOARD)
  const { hasNewOrder } = useOrders()
  const { hasNewItem } = useWishlist()
  const { toast } = useToast()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [otpSent, setOtpSent] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
        try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        } catch (error) {
            console.error("Error initializing RecaptchaVerifier:", error);
            // Add a toast notification for the user
            toast({
                title: "Error",
                description: "Could not initialize login provider. Please refresh the page.",
                variant: "destructive"
            });
        }
    }
  }, [loading, user, toast]);

  const handleSendOtp = async () => {
    if (!phoneNumber || !/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
        toast({ title: "Invalid Phone Number", description: "Please enter a valid phone number with country code.", variant: "destructive" });
        return;
    }
    try {
        const verifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        setConfirmationResult(result);
        setOtpSent(true);
        toast({ title: "OTP Sent!", description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (error) {
        console.error("Error sending OTP:", error);
        toast({ title: "Error", description: "Failed to send OTP. Please try again.", variant: "destructive" });
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
        toast({ title: "Invalid OTP", description: "Please enter a valid 6-digit OTP.", variant: "destructive" });
        return;
    }
    try {
        await confirmationResult.confirm(otp);
        toast({ title: "Success!", description: "You have been logged in successfully." });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        toast({ title: "Error", description: "Invalid OTP. Please try again.", variant: "destructive" });
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!user) {
    return (
        <div className="mx-auto max-w-sm card p-6 text-center">
             <h1 className="text-2xl font-bold mb-4">Login or Signup</h1>
             {!otpSent ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Enter your phone number to receive a verification code.</p>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-lg border px-3 py-2 text-sm text-center"
                    />
                    <button onClick={handleSendOtp} className="w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
                        Send OTP
                    </button>
                </div>
             ) : (
                <div className="space-y-4">
                     <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to {phoneNumber}.</p>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full rounded-lg border px-3 py-2 text-sm text-center tracking-widest"
                    />
                     <button onClick={handleVerifyOtp} className="w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
                        Verify & Login
                    </button>
                    <button onClick={() => setOtpSent(false)} className="text-sm text-gray-500 hover:underline">
                        Change Number
                    </button>
                </div>
             )}
             <div id="recaptcha-container" className="mt-4"></div>
        </div>
    )
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
                        <p className="text-sm text-gray-500">{user.phoneNumber}</p>
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
