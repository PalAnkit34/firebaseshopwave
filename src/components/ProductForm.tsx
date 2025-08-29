
'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2, Upload } from 'lucide-react'
import { IKContext, IKUpload } from 'imagekitio-react';
import { useToast } from '@/hooks/use-toast'

const categories = ['Tech', 'Home', 'Ayurvedic', 'Beauty', 'Groceries', 'Pooja']
const subcategories: Record<string, string[]> = {
    Tech: ['Mobiles', 'Laptops', 'Audio', 'Cameras', 'Wearables', 'Accessories', 'Tablets'],
    Home: ['Decor', 'Lighting', 'Kitchenware', 'Wall Decor', 'Appliances', 'Smart-Home'],
    Ayurvedic: ['Ayurvedic Medicine', 'Homeopathic Medicines', 'Personal-Care', 'Beverages'],
    Beauty: ['Makeup', 'Skincare', 'Hair-Care'],
    Groceries: ['Staples', 'Snacks', 'Beverages', 'Oils'],
    Pooja: ['Dhoop', 'Agarbatti', 'Aasan and Mala', 'Photo Frame'],
}

interface ProductFormProps {
    product?: Product
    onSave: (product: Omit<Product, 'id' | 'ratings'>) => void
    onCancel: () => void
}

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

type FormData = Omit<Product, 'id' | 'ratings' | 'price'> & {
    price: { original: number | string, discounted: number | string, currency: string }
};

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<FormData>>({
        name: '',
        slug: '',
        brand: '',
        category: 'Tech',
        subcategory: 'Mobiles',
        price: { original: '', discounted: '', currency: '₹' },
        quantity: 0,
        image: '',
        extraImages: [],
        video: '',
        description: '',
        shortDescription: '',
        features: [],
        specifications: {},
        tags: [],
        sku: '',
        shippingCost: 0,
        taxPercent: 18,
        inventory: { inStock: true, lowStockThreshold: 5 },
        codAvailable: false,
        returnPolicy: { eligible: true, duration: 7 },
        warranty: '1 Year Warranty',
        status: 'active'
    })
    const { toast } = useToast();

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                price: {
                    original: product.price.original,
                    discounted: product.price.discounted || '',
                    currency: product.price.currency || '₹',
                },
                extraImages: product.extraImages || [],
                features: product.features || [],
                tags: product.tags || [],
                specifications: product.specifications || {},
                inventory: product.inventory || { inStock: true, lowStockThreshold: 5 },
                returnPolicy: product.returnPolicy || { eligible: true, duration: 7 },
            })
        }
    }, [product])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const isCheckbox = type === 'checkbox';
        const checked = (e.target as HTMLInputElement).checked;

        const updateState = (prevState: Partial<FormData>): Partial<FormData> => {
             switch (name) {
                case 'original':
                case 'discounted':
                    return { ...prevState, price: { ...(prevState.price!), [name]: value } }
                case 'quantity':
                case 'shippingCost':
                case 'taxPercent':
                case 'returnPolicy.duration':
                case 'inventory.lowStockThreshold':
                    return { ...prevState, [name]: Number(value) }
                case 'inventory.inStock':
                    return { ...prevState, inventory: { ...(prevState.inventory!), inStock: checked } }
                case 'codAvailable':
                    return { ...prevState, codAvailable: checked };
                case 'returnPolicy.eligible':
                    return { ...prevState, returnPolicy: { ...(prevState.returnPolicy!), eligible: checked } };
                case 'features':
                case 'tags':
                    return { ...prevState, [name]: value.split(',').map(s => s.trim()).filter(Boolean) }
                case 'specifications':
                     const specs = value.split('\n').reduce((acc, line) => {
                        const [key, val] = line.split(':');
                        if (key && val) acc[key.trim()] = val.trim();
                        return acc;
                    }, {} as Record<string, string>);
                    return { ...prevState, specifications: specs };
                default:
                    const keys = name.split('.');
                    if (keys.length > 1) {
                        return {
                            ...prevState,
                            [keys[0]]: { ...(prevState as any)[keys[0]], [keys[1]]: value }
                        }
                    }
                    return { ...prevState, [name]: value }
            }
        }
        setFormData(prev => updateState(prev));
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
        if (formData.name && formData.price?.original) {
            const finalData = {
                ...formData,
                price: {
                    original: Number(formData.price.original),
                    discounted: formData.price.discounted ? Number(formData.price.discounted) : undefined,
                    currency: '₹'
                }
            }
            onSave(finalData as Omit<Product, 'id' | 'ratings'>)
        } else {
            toast({ title: "Missing Information", description: "Please fill in at least Name and Original Price.", variant: "destructive" });
        }
    }

    const handleMediaUpload = (name: 'image' | 'video' | `extraImages.${number}`, url: string) => {
        if (name.startsWith('extraImages.')) {
            const index = Number(name.split('.')[1]);
            handleExtraImageChange(index, url);
        } else {
            setFormData(prev => ({ ...prev, [name]: url }));
        }
    };
    
    const handleUploadSuccess = (res: any, fieldName: string) => {
        handleMediaUpload(fieldName as any, res.url);
        toast({ title: "Upload Successful", description: "Your file has been uploaded." });
    };

    const handleUploadError = (err: any) => {
        toast({ title: "Upload Failed", description: err.message || "Could not upload file.", variant: "destructive" });
    };

    const handleExtraImageChange = (index: number, value: string) => {
        setFormData(prev => {
            const newImages = [...(prev.extraImages || [])];
            newImages[index] = value;
            return { ...prev, extraImages: newImages };
        });
    };

    const addExtraImage = () => {
        setFormData(prev => ({
            ...prev,
            extraImages: [...(prev.extraImages || []), '']
        }));
    };

    const removeExtraImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            extraImages: (prev.extraImages || []).filter((_, i) => i !== index)
        }));
    };

    const Input = ({ name, label, ...props }: any) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input id={name} name={name} onChange={handleChange} {...props} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-brand" />
        </div>
    )
    
    const UploadInput = ({ name, label, value, ...props }: { name: string; label: string; value: string;[key: string]: any; }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input id={name} name={name} value={value} onChange={handleChange} {...props} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:ring-brand" />
                <IKUpload
                    folder="/shopwave"
                    fileName={`product_${Date.now()}`}
                    onSuccess={(res: any) => handleUploadSuccess(res, name)}
                    onError={handleUploadError}
                    useUniqueFileName={true}
                >
                    <Button type="button" variant="outline" size="icon" aria-label="Upload" className="flex-shrink-0">
                        <Upload className="h-4 w-4" />
                    </Button>
                </IKUpload>
            </div>
        </div>
    );

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
    
    const Checkbox = ({ name, label, ...props }: any) => (
        <div className="flex items-center gap-2">
            <input id={name} name={name} type="checkbox" onChange={handleChange} {...props} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
            <label htmlFor={name} className="text-sm font-medium text-gray-700">{label}</label>
        </div>
    );
    
    const specificationsToString = (specs: Record<string, string> | undefined) => {
        if (!specs) return '';
        return Object.entries(specs).map(([key, value]) => `${key}: ${value}`).join('\n');
    }
    
    if (!urlEndpoint || !publicKey) {
        return <div className="text-red-600 p-4 rounded-md bg-red-50 border border-red-200">ImageKit configuration is missing. Please check your environment variables.</div>;
    }

    return (
        <IKContext
            urlEndpoint={urlEndpoint}
            publicKey={publicKey}
            authenticationEndpoint="/api/imagekit/auth"
        >
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto p-1 pr-4">
                <Input name="name" label="Product Name" value={formData.name} required />
                <Input name="slug" label="Product Slug (URL)" value={formData.slug} placeholder="e.g., galaxy-a54-5g-128" required />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="brand" label="Brand" value={formData.brand} required />
                    <Input name="sku" label="SKU (Stock Keeping Unit)" value={formData.sku} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UploadInput name="image" label="Main Image URL" value={formData.image || ''} placeholder="Upload or paste URL" />
                    <UploadInput name="video" label="Video URL (optional)" value={formData.video || ''} placeholder="Upload or paste URL" />
                </div>
                
                 <div className="rounded-md border p-3 space-y-3">
                    <h3 className="text-md font-medium">Extra Images</h3>
                    {formData.extraImages?.map((imgUrl, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <UploadInput 
                                name={`extraImages.${index}`}
                                label={`Image ${index + 1}`}
                                value={imgUrl}
                                placeholder="Upload or paste URL"
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeExtraImage(index)} aria-label="Remove image" className="self-end">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addExtraImage} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Image
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select name="category" label="Category" value={formData.category} onChange={handleCategoryChange}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                    <Select name="subcategory" label="Subcategory" value={formData.subcategory}>
                        {(subcategories[formData.category || 'Tech'] || []).map(sc => <option key={sc} value={sc}>{sc.replace('-', ' ')}</option>)}
                    </Select>
                </div>
                
                <div className="rounded-md border p-3 space-y-3">
                    <h3 className="text-md font-medium">Pricing & Stock</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input name="original" label="Original Price" type="number" value={formData.price?.original} required />
                        <Input name="discounted" label="Discounted Price" type="number" value={formData.price?.discounted || ''} />
                        <Input name="quantity" label="Stock Quantity" type="number" value={formData.quantity} required />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input name="shippingCost" label="Shipping Cost" type="number" value={formData.shippingCost || 0} />
                        <Input name="taxPercent" label="Tax Percent" type="number" value={formData.taxPercent || 0} />
                     </div>
                </div>

                <TextArea name="shortDescription" label="Short Description (for product card)" value={formData.shortDescription} rows={2} />
                <TextArea name="description" label="Full Description (for product page)" value={formData.description} rows={4} />

                <div className="rounded-md border p-3 space-y-3">
                    <h3 className="text-md font-medium">Details & SEO</h3>
                    <TextArea name="features" label="Features (comma-separated)" value={(formData.features || []).join(', ')} rows={2} />
                    <TextArea name="specifications" label="Specifications (one per line, e.g., RAM: 8 GB)" value={specificationsToString(formData.specifications)} rows={3} />
                    <TextArea name="tags" label="Tags for SEO (comma-separated)" value={(formData.tags || []).join(', ')} rows={2} />
                </div>

                <div className="rounded-md border p-3 space-y-3">
                    <h3 className="text-md font-medium">Policies & Inventory</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input name="warranty" label="Warranty" value={formData.warranty} />
                         <Select name="status" label="Product Status" value={formData.status}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="discontinued">Discontinued</option>
                        </Select>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <Checkbox name="codAvailable" label="Cash on Delivery Available" checked={formData.codAvailable || false} />
                        <Checkbox name="returnPolicy.eligible" label="Return Eligible" checked={formData.returnPolicy?.eligible || false} />
                     </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Input name="returnPolicy.duration" label="Return Duration (Days)" type="number" value={formData.returnPolicy?.duration || 7} disabled={!formData.returnPolicy?.eligible}/>
                        <Input name="inventory.lowStockThreshold" label="Low Stock Threshold" type="number" value={formData.inventory?.lowStockThreshold || 5} />
                     </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white py-3">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Product</Button>
                </div>
            </form>
        </IKContext>
    )
}
