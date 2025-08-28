
'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'

const categories = ['Tech', 'Fashion', 'Ayurvedic', 'Home', 'Beauty', 'Groceries']
const subcategories: Record<string, string[]> = {
    Tech: ['Mobiles', 'Laptops', 'Audio', 'Cameras', 'Wearables', 'Accessories', 'Tablets'],
    Fashion: ['Men-Ethnic', 'Women-Ethnic', 'Men-Casual', 'Women-Western', 'Footwear', 'Accessories', 'Men-Formal'],
    Ayurvedic: ['Supplements', 'Herbal-Powders', 'Personal-Care'],
    Home: ['Kitchenware', 'Appliances', 'Smart-Home'],
    Beauty: ['Makeup', 'Skincare', 'Hair-Care'],
    Groceries: ['Staples', 'Snacks', 'Beverages', 'Oils'],
}

interface ProductFormProps {
    product?: Product
    onSave: (product: Product) => void
    onCancel: () => void
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        brand: '',
        category: 'Tech',
        subcategory: 'Mobiles',
        price: { original: 0, discounted: 0 },
        quantity: 0,
        image: 'https://picsum.photos/400/400',
        description: '',
        shortDescription: '',
    })

    useEffect(() => {
        if (product) {
            setFormData(product)
        }
    }, [product])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === 'original' || name === 'discounted') {
            setFormData(prev => ({
                ...prev,
                price: { ...prev.price!, [name]: Number(value) }
            }))
        } else if (name === 'quantity') {
             setFormData(prev => ({ ...prev, quantity: Number(value) }))
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setFormData(prev => ({
            ...prev,
            category: category,
            subcategory: subcategories[category]?.[0] || '', // Reset subcategory
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Basic validation
        if (formData.name && formData.price?.original) {
            onSave(formData as Product)
        } else {
            alert('Please fill in at least Name and Original Price.')
        }
    }

    const Input = ({ name, label, value, ...props }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input id={name} name={name} value={value} onChange={handleChange} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm" />
        </div>
    )

    const Select = ({ name, label, value, children, ...props }: any) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={name} name={name} value={value} onChange={props.onChange || handleChange} {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm">
                {children}
            </select>
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" label="Product Name" value={formData.name} required />
                <Input name="brand" label="Brand" value={formData.brand} required />
                <Select name="category" label="Category" value={formData.category} onChange={handleCategoryChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Select name="subcategory" label="Subcategory" value={formData.subcategory}>
                    {subcategories[formData.category || 'Tech']?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </Select>
                <Input name="original" label="Original Price" type="number" value={formData.price?.original} required />
                <Input name="discounted" label="Discounted Price" type="number" value={formData.price?.discounted} />
                <Input name="quantity" label="Stock Quantity" type="number" value={formData.quantity} required />
                <Input name="image" label="Image URL" value={formData.image} />
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Full Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm"></textarea>
            </div>
             <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
                <input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm" />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </div>
        </form>
    )
}
