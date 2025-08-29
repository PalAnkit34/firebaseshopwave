'use client'
import { create } from 'zustand'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { Address } from './types'

type AddressState = {
  addresses: Address[]
  isLoading: boolean
  init: (userId: string) => () => void
  save: (userId: string, address: Address) => Promise<void>
  remove: (userId: string, addressId: string) => Promise<void>
  setDefault: (userId: string, addressId: string) => Promise<void>
  clear: () => void
}

const getDocRef = (userId: string) => doc(db, 'addresses', userId);

export const useAddressBook = create<AddressState>()((set, get) => ({
  addresses: [],
  isLoading: true,
  init: (userId: string) => {
    set({ isLoading: true });
    const docRef = getDocRef(userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const addresses = docSnap.data().list || [];
        set({ addresses, isLoading: false });
      } else {
        // Create the document if it doesn't exist for a new user
        setDoc(docRef, { list: [] });
        set({ addresses: [], isLoading: false });
      }
    });
    return unsubscribe; // Return the unsubscribe function for cleanup
  },
  save: async (userId, address) => {
    const docRef = getDocRef(userId);
    const state = get();
    const existing = state.addresses.find((a) => a.id === address.id);
    let newAddresses: Address[];

    if (existing) {
      newAddresses = state.addresses.map((a) => (a.id === address.id ? address : a));
    } else {
      const newAddress = { ...address, id: `addr_${Date.now()}` };
      newAddresses = [newAddress, ...state.addresses];
    }
    
    // If setting default, ensure only one is default
    if (address.default) {
      newAddresses = newAddresses.map(a => ({
        ...a, 
        default: a.id === (address.id || newAddresses[0].id)
      }));
    }

    await setDoc(docRef, { list: newAddresses });
  },
  remove: async (userId, addressId) => {
    const docRef = getDocRef(userId);
    const state = get();
    const newAddresses = state.addresses.filter((a) => a.id !== addressId);
    await setDoc(docRef, { list: newAddresses });
  },
  setDefault: async (userId, addressId) => {
    const docRef = getDocRef(userId);
    const state = get();
    const newAddresses = state.addresses.map((a) => ({ ...a, default: a.id === addressId }));
    await setDoc(docRef, { list: newAddresses });
  },
  clear: () => {
    set({ addresses: [], isLoading: true });
  }
}))
