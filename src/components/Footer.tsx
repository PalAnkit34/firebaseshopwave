import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800">ShopWave</h3>
            <p className="text-sm text-gray-600 mt-2">Your one-stop shop for everything you need.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-brand">Home</Link></li>
              <li><Link href="/search" className="text-gray-600 hover:text-brand">Search</Link></li>
              <li><Link href="/orders" className="text-gray-600 hover:text-brand">My Orders</Link></li>
              <li><Link href="/account" className="text-gray-600 hover:text-brand">Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Help</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="#" className="text-gray-600 hover:text-brand">FAQ</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-brand">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-brand">Shipping Policy</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-brand">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Follow Us</h3>
            <div className="flex items-center gap-4 mt-2">
              <Link href="#" className="text-gray-500 hover:text-brand"><Facebook size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-brand"><Twitter size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-brand"><Instagram size={20} /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
