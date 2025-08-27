'use client'
import { useState } from 'react'

const InputField = ({ id, label, type = 'text', placeholder, value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <input
            type={type}
            id={id}
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
            value={value}
            onChange={onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
            {children}
        </select>
    </div>
);


export default function AddProductPage() {
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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setProduct(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend API
        console.log('Product submitted:', product);
        alert('Product added successfully! (Check console for data)');
        // router.push('/admin');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
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
                    <button type="button" className="py-2 px-4 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">Add Product</button>
                </div>
            </form>
        </div>
    )
}
