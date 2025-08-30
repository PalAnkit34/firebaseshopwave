
import type { Product } from '../types';

export const TECH_PRODUCTS: Product[] = [
  {
    id: 'P_TECH_M_01',
    slug: 'galaxy-a54-5g',
    name: 'Samsung Galaxy A54 5G (Awesome Violet, 8GB, 128GB Storage)',
    brand: 'Samsung',
    category: 'Tech',
    subcategory: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1678830440338-467537a6a422?q=80&w=800&auto=format&fit=crop',
    extraImages: [
        'https://images.unsplash.com/photo-1678830440375-816783f289b4?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1678830440330-801262d9894f?q=80&w=800&auto=format&fit=crop'
    ],
    quantity: 100,
    price: { original: 41999, discounted: 35499, currency: '₹' },
    description: 'A well-balanced 5G smartphone with a vibrant AMOLED display, capable OIS camera, and a long-lasting battery. Features IP67 water resistance for added durability.',
    shortDescription: 'Bright AMOLED, OIS camera, all-day battery.',
    features: ['6.4" FHD+ Super AMOLED Display', '50MP OIS Main Camera', '5000mAh Battery', 'IP67 Water Resistant'],
    specifications: { RAM: '8 GB', ROM: '128 GB', 'Processor': 'Exynos 1380' },
    ratings: { average: 4.3, count: 4500 },
    codAvailable: true,
    returnPolicy: { eligible: true, duration: 7 },
    warranty: '1 Year Manufacturer Warranty',
    tags: ['samsung', 'galaxy', '5g', 'smartphone', 'android']
  },
  {
    id: 'P_TECH_M_02',
    slug: 'apple-iphone-15',
    name: 'Apple iPhone 15 (128 GB) - Blue',
    brand: 'Apple',
    category: 'Tech',
    subcategory: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1700216223237-859c9a239af4?q=80&w=800&auto=format&fit=crop',
    quantity: 75,
    price: { original: 79900, currency: '₹' },
    description: 'The iPhone 15 brings you the Dynamic Island, a 48MP Main camera, and USB-C — all in a durable color-infused glass and aluminum design.',
    shortDescription: 'Dynamic Island, 48MP camera, USB-C.',
    features: ['6.1-inch Super Retina XDR display', 'Dynamic Island', 'A16 Bionic chip', 'USB-C connector'],
    specifications: { 'Display Size': '6.1 inches', 'Chip': 'A16 Bionic', 'Camera': '48MP Main' },
    ratings: { average: 4.7, count: 12000 },
    returnPolicy: { eligible: true, duration: 7 },
    warranty: '1 Year Apple Warranty',
    tags: ['apple', 'iphone', 'ios', 'smartphone']
  }
];
