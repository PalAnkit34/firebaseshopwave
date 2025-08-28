
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

    const Input = ({ name, label, ...props }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input id={name} name={name} onChange={handleChange} {...props} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-brand" />
        </div>
    )

    const Select = ({ name, label, children, ...props }: any) => (
         <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select id={name} name={name} onChange={props.onChange || handleChange} {...props} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-brand">
                {children}
            </select>
        </div>
    )
    
    const TextArea = ({ name, label, ...props }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <textarea id={name} name={name} onChange={handleChange} {...props} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-brand" />
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto p-1 pr-4">
            <Input name="name" label="Product Name" value={formData.name} required />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="brand" label="Brand" value={formData.brand} required />
                <Input name="image" label="Image URL" value={formData.image} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select name="category" label="Category" value={formData.category} onChange={handleCategoryChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Select name="subcategory" label="Subcategory" value={formData.subcategory}>
                    {subcategories[formData.category || 'Tech']?.map(sc => <option key={sc} value={sc}>{sc.replace('-', ' ')}</option>)}
                </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="original" label="Original Price" type="number" value={formData.price?.original} required />
                <Input name="discounted" label="Discounted Price" type="number" value={formData.price?.discounted} />
                <Input name="quantity" label="Stock Quantity" type="number" value={formData.quantity} required />
            </div>
            
            <TextArea name="shortDescription" label="Short Description (for product card)" value={formData.shortDescription} rows={2} />
            <TextArea name="description" label="Full Description (for product page)" value={formData.description} rows={4} />
            
            <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white py-3">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </div>
        </form>
    )
}
