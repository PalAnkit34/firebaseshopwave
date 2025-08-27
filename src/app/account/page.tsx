
'use client'
import { useState } from 'react'
import { User, Package, Heart, MapPin, LifeBuoy, LogOut, ChevronRight, Edit } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AddressManager from '@/components/AddressManager'

const accountSections = {
  DASHBOARD: 'DASHBOARD',
  ADDRESSES: 'ADDRESSES',
  EDIT_PROFILE: 'EDIT_PROFILE',
}

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState(accountSections.DASHBOARD)

  const mockUser = {
    fullName: 'Dhananjay Singh',
    email: 'd.singh@example.com',
    phone: '+91 98765 43210',
  }

  const renderSection = () => {
    switch (activeSection) {
      case accountSections.ADDRESSES:
        return <AddressManager onBack={() => setActiveSection(accountSections.DASHBOARD)} />
      case accountSections.EDIT_PROFILE:
        return (
           <div>
            <button onClick={() => setActiveSection(accountSections.DASHBOARD)} className="text-sm text-brand font-semibold mb-4">&larr; Back to Account</button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="card p-6 space-y-4">
              <input defaultValue={mockUser.fullName} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Full Name"/>
              <input defaultValue={mockUser.email} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Email" type="email"/>
              <input defaultValue={mockUser.phone} className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Phone"/>
              <button className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90">Save Changes</button>
            </div>
          </div>
        )
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
                        <h2 className="text-xl font-bold">{mockUser.fullName}</h2>
                        <p className="text-sm text-gray-500">{mockUser.email}</p>
                        <p className="text-sm text-gray-500">{mockUser.phone}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <DashboardCard icon={Package} title="My Orders" href="/orders" />
                <DashboardCard icon={Heart} title="Wishlist" href="/wishlist" />
                <DashboardCard icon={MapPin} title="My Addresses" onClick={() => setActiveSection(accountSections.ADDRESSES)} />
                <DashboardCard icon={LifeBuoy} title="Help Center" href="#" />
            </div>

            <div className="card p-4">
                 <AccountLink title="Edit Profile" icon={Edit} onClick={() => setActiveSection(accountSections.EDIT_PROFILE)} />
                 <AccountLink title="Logout" icon={LogOut} />
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

const DashboardCard = ({ icon: Icon, title, href, onClick }: { icon: React.ElementType, title: string, href?: string, onClick?: () => void }) => {
  const content = (
      <div className="card p-4 text-center flex flex-col items-center justify-center h-full">
          <Icon className="w-8 h-8 mb-2 text-brand" />
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
