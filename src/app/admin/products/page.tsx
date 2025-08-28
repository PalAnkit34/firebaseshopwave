
'use client'
import { PRODUCTS } from '@/lib/sampleData'
import Image from 'next/image'
import PriceTag from '@/components/PriceTag'
import { Pencil, Trash2 } from 'lucide-react'

export default function AdminProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                 <button id="add" className="scroll-mt-20 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90">
                    + Add New Product
                </button>
            </div>

            <div className="card p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3">Product</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Price</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PRODUCTS.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 flex items-center gap-3">
                                        <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover"/>
                                        <span className="font-medium">{product.name}</span>
                                    </td>
                                    <td className="p-3">{product.category} / {product.subcategory}</td>
                                    <td className="p-3">
                                        <PriceTag original={product.price.original} discounted={product.price.discounted} />
                                    </td>
                                    <td className="p-3">{product.quantity} units</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1 text-gray-500 hover:text-brand" aria-label="Edit product">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="p-1 text-gray-500 hover:text-red-600" aria-label="Delete product">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {PRODUCTS.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    )
}
