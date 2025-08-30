
'use client'
import { create } from 'zustand'
import { safeGet, safeSet } from './storage'
import type { Address } from './types'

type AddressBookData = {
  [userId: string]: Address[]
}

type AddressState = {
  addresses: Address[]
  isLoading: boolean
  init: (userId: string) => void
  save: (userId: string, address: Address) => void
  remove: (userId: string, addressId: string) => void
  setDefault: (userId: string, addressId: string) => void
  clear: () => void
}

const getAddressBook = (): AddressBookData => {
  return safeGet('address-book', {});
}

const saveAddressBook = (data: AddressBookData) => {
  safeSet('address-book', data);
}

export const useAddressBook = create<AddressState>()((set, get) => ({
  addresses: [],
  isLoading: true,
  init: (userId: string) => {
    set({ isLoading: true });
    const addressBook = getAddressBook();
    const userAddresses = addressBook[userId] || [];
    set({ addresses: userAddresses, isLoading: false });
  },
  save: (userId, address) => {
    const addressBook = getAddressBook();
    let userAddresses = addressBook[userId] || [];
    const existingIndex = userAddresses.findIndex((a) => a.id === address.id);
    
    let newAddress: Address;

    if (existingIndex > -1) {
      newAddress = { ...userAddresses[existingIndex], ...address };
      userAddresses[existingIndex] = newAddress;
    } else {
      newAddress = { ...address, id: `addr_${Date.now()}` };
      userAddresses.push(newAddress);
    }
    
    if (newAddress.default) {
      userAddresses = userAddresses.map(a => ({
        ...a, 
        default: a.id === newAddress.id
      }));
    }

    addressBook[userId] = userAddresses;
    saveAddressBook(addressBook);
    set({ addresses: userAddresses });
  },
  remove: (userId, addressId) => {
    const addressBook = getAddressBook();
    let userAddresses = addressBook[userId] || [];
    const newAddresses = userAddresses.filter((a) => a.id !== addressId);
    
    addressBook[userId] = newAddresses;
    saveAddressBook(addressBook);
    set({ addresses: newAddresses });
  },
  setDefault: (userId, addressId) => {
    const addressBook = getAddressBook();
    let userAddresses = addressBook[userId] || [];
    const newAddresses = userAddresses.map((a) => ({ ...a, default: a.id === addressId }));
    
    addressBook[userId] = newAddresses;
    saveAddressBook(addressBook);
    set({ addresses: newAddresses });
  },
  clear: () => {
    set({ addresses: [], isLoading: true });
  }
}))
