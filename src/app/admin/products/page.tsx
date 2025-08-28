
'use client'
import { useState } from 'react'
import { PRODUCTS } from '@/lib/sampleData'
import Image from 'next/image'
import PriceTag from '@/components/PriceTag'
import { Pencil, Trash2 } from 'lucide-react'
import ProductForm from '@/components/ProductForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>(PRODUCTS)
    const [isFormOpen, setFormOpen] = useState(false)
    const [isAlertOpen, setAlertOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)

    const handleAddProduct = () => {
        setSelectedProduct(undefined)
        setFormOpen(true)
    }

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product)
        setFormOpen(true)
    }

    const handleSaveProduct = (product: Product) => {
        setProducts(prev => {
            if (product.id) {
                // Editing existing product
                return prev.map(p => p.id === product.id ? product : p)
            } else {
                // Adding new product
                return [{ ...product, id: `P${Date.now()}` }, ...prev]
            }
        })
        setFormOpen(false)
    }

    const confirmDelete = (productId: string) => {
        setProductToDelete(productId)
        setAlertOpen(true)
    }

    const handleDeleteProduct = () => {
        if (productToDelete) {
            setProducts(prev => prev.filter(p => p.id !== productToDelete))
            setAlertOpen(false)
            setProductToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Products</h1>
                <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddProduct}>+ Add New Product</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        </DialogHeader>
                        <ProductForm 
                            product={selectedProduct} 
                            onSave={handleSaveProduct}
                            onCancel={() => setFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
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
                            {products.map(product => (
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
                                            <button onClick={() => handleEditProduct(product)} className="p-1 text-gray-500 hover:text-brand" aria-label="Edit product">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => confirmDelete(product.id)} className="p-1 text-gray-500 hover:text-red-600" aria-label="Delete product">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No products found.
                    </div>
                )}
            </div>

            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        from the list.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProduct}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
