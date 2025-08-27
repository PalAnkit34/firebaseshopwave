'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

const InputField = ({ id, label, type = 'text', placeholder, value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={placeholder}
            required={required}
        />
    </div>
);

const TextAreaField = ({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <textarea
            id={id}
            name={id}
            rows={4}
            value={value}
            onChange={onChange}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
        ></textarea>
    </div>
);

const SelectField = ({ id, label, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
            {children}
        </select>
    </div>
);


export default function AddProductPage() {
    const router = useRouter();
    const [product, setProduct] = useState({
        name: '',
        brand: '',
        category: 'Tech',
        image: '',
        originalPrice: '',
        discountedPrice: '',
        quantity: '',
        description: '',
        shortDescription: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        const productData = {
            name: product.name,
            brand: product.brand,
            category: product.category,
            image: product.image,
            price: {
                original: Number(product.originalPrice),
                discounted: product.discountedPrice ? Number(product.discountedPrice) : undefined,
            },
            quantity: Number(product.quantity),
            description: product.description,
            shortDescription: product.shortDescription,
            slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        };

        try {
            await api.post('/products', productData);
            alert('Product added successfully!');
            router.push('/admin');
        } catch (err) {
            console.error(err);
            setError('Failed to add product. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="name" label="Product Name" placeholder="e.g., Samsung Galaxy S23" value={product.name} onChange={handleChange} required />
                    <InputField id="brand" label="Brand" placeholder="e.g., Samsung" value={product.brand} onChange={handleChange} required />
                </div>

                <SelectField id="category" label="Category" value={product.category} onChange={handleChange}>
                    <option>Tech</option>
                    <option>Fashion</option>
                    <option>Ayurvedic</option>
                </SelectField>

                <InputField id="image" label="Image URL" placeholder="https://..." value={product.image} onChange={handleChange} required />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField id="originalPrice" label="Original Price (₹)" type="number" placeholder="e.g., 79999" value={product.originalPrice} onChange={handleChange} required />
                    <InputField id="discountedPrice" label="Discounted Price (₹)" type="number" placeholder="e.g., 74999" value={product.discountedPrice} onChange={handleChange} />
                    <InputField id="quantity" label="Quantity" type="number" placeholder="e.g., 100" value={product.quantity} onChange={handleChange} required />
                </div>

                <TextAreaField id="shortDescription" label="Short Description" placeholder="A brief summary of the product" value={product.shortDescription} onChange={handleChange} />
                <TextAreaField id="description" label="Full Description" placeholder="Detailed product description" value={product.description} onChange={handleChange} />

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => router.back()} className="py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={isLoading} className="py-2 px-4 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50">
                        {isLoading ? 'Adding...' : 'Add Product'}
                    </button>
                </div>
            </form>
        </div>
    )
}
