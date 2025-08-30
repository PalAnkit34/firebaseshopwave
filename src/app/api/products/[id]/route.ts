
import { NextResponse, type NextRequest } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/lib/types';

// GET a single product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const productDocRef = doc(db, 'products', id);
        const docSnap = await getDoc(productDocRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = { id: docSnap.id, ...docSnap.data() } as Product;
        return NextResponse.json(product);
    } catch (error) {
        console.error(`Error fetching product ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT (update) a product by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const productData = await request.json();
        const productDocRef = doc(db, 'products', id);

        await updateDoc(productDocRef, {
            ...productData,
            updatedAt: serverTimestamp(),
        });

        return NextResponse.json({ message: 'Product updated successfully', id });

    } catch (error) {
        console.error(`Error updating product ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE a product by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        const productDocRef = doc(db, 'products', id);
        await deleteDoc(productDocRef);

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(`Error deleting product ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
