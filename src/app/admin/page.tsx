'use client'
import Link from 'next/link'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import { useOrders } from '@/lib/ordersStore'
import PriceTag from '@/components/PriceTag'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { Product, User } from '@/lib/types'

const StatCard = ({ title, value, icon:Icon, currency }: { title: string, value: string | number, icon: React.ElementType, currency?: string }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{currency}{value}</p>
        </div>
        <div className="bg-brand/10 text-brand p-3 rounded-full">
            <Icon className="h-6 w-6" />
        </div>
    </div>
)

export default function AdminDashboard() {
  const { orders } = useOrders() // This is still client-side, will replace later
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, usersRes] = await Promise.all([
            api.get('/products'),
            api.get('/users')
        ]);
        setProducts(productsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  
  if (loading) {
      return <div>Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={totalSales.toLocaleString('en-IN')} currency="₹" icon={DollarSign} />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} />
        <StatCard title="Total Products" value={products.length} icon={Package} />
        <StatCard title="Total Customers" value={users.length} icon={Users} />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Products</h2>
            <Link href="/admin/add-product" className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand/90 transition-colors">
                Add Product
            </Link>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Stock</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.slice(0, 5).map(p => (
                        <tr key={p._id} className="bg-white border-b hover:bg-gray-50">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-3">
                                <div className="relative h-10 w-10 shrink-0">
                                  <Image src={p.image} alt={p.name} fill className="rounded-md object-cover"/>
                                </div>
                                {p.name}
                            </th>
                            <td className="px-6 py-4">{p.category}</td>
                            <td className="px-6 py-4"><PriceTag original={p.price.original} discounted={p.price.discounted} /></td>
                            <td className="px-6 py-4">{p.quantity}</td>
                            <td className="px-6 py-4">
                                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline ml-3">Delete</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}
