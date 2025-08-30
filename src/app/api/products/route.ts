
import { NextResponse, type NextRequest } from 'next/server';
import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';

const productCollectionRef = collection(db, 'products');

// GET all products
export async function GET(request: NextRequest) {
  try {
    const snapshot = await getDocs(productCollectionRef);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: NextRequest) {
    try {
        const productData = await request.json();

        // Basic validation
        if (!productData.name || !productData.price?.original) {
            return NextResponse.json({ error: 'Missing required fields: name and price.original' }, { status: 400 });
        }

        const docRef = await addDoc(productCollectionRef, {
            ...productData,
            ratings: { average: 4.5, count: 1 }, // Default ratings
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const newProduct = { ...productData, id: docRef.id, ratings: { average: 4.5, count: 1 } };
        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
