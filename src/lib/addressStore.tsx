'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { safeGet, safeSet } from './storage'
import type { Address } from './types'

const AddrCtx = createContext<{ addresses: Address[]; save: (a: Address) => void; remove: (id: string) => void; setDefault: (id: string) => void }>({ addresses: [], save: () => {}, remove: () => {}, setDefault: () => {} })

export const AddressProvider = ({ children }: { children: React.ReactNode }) => {
  const [addresses, setAddresses] = useState<Address[]>(safeGet<Address[]>('addresses', []))
  useEffect(() => { safeSet('addresses', addresses) }, [addresses])
  
  const save = (a: Address) => {
    setAddresses(prev => {
      const existing = prev.find(addr => addr.id === a.id);
      let newAddresses: Address[];
      if (existing) {
        newAddresses = prev.map(addr => addr.id === a.id ? a : addr);
      } else {
        newAddresses = [{ ...a, id: `addr_${Date.now()}` }, ...prev];
      }
      if (a.default) {
        return newAddresses.map(addr => ({ ...addr, default: addr.id === (a.id || newAddresses[0].id) }));
      }
      return newAddresses;
    });
  };

  const remove = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));
  
  const setDefault = (id: string) => setAddresses(prev => prev.map((a) => ({ ...a, default: a.id === id })))

  return <AddrCtx.Provider value={{ addresses, save, remove, setDefault }}>{children}</AddrCtx.Provider>
}
export const useAddressBook = () => useContext(AddrCtx)
