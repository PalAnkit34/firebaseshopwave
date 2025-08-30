
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { safeGet, safeSet } from '@/lib/storage'
import { useWishlist } from '@/lib/wishlistStore'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import { useOrders } from '@/lib/ordersStore'

interface CustomUser {
  id: string; // Phone number will be the ID
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  login: (phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the init and clear functions from the stores
  const { init: initWishlist, clear: clearWishlist } = useWishlist();
  const { init: initCart, clear: clearCart } = useCart();
  const { init: initAddresses, clear: clearAddresses } = useAddressBook();
  const { init: initOrders, clear: clearOrders } = useOrders();


  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initializeUser = (storedUser: CustomUser) => {
      setUser(storedUser);
      // Initialize stores for the logged-in user
      const unsubWishlist = initWishlist(storedUser.id);
      const unsubCart = initCart(storedUser.id);
      const unsubAddresses = initAddresses(storedUser.id);
      const unsubOrders = initOrders(storedUser.id);
      unsubs = [unsubWishlist, unsubCart, unsubAddresses, unsubOrders];
    };
    
    const storedUser = safeGet<CustomUser | null>('custom-user', null);
    if (storedUser) {
      initializeUser(storedUser);
    }
    setLoading(false);

    // Return cleanup function to unsubscribe on component unmount
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [initWishlist, initCart, initAddresses, initOrders]);

  const login = (phone: string) => {
    const newUser: CustomUser = { id: phone };
    safeSet('custom-user', newUser);
    setUser(newUser);
    // Initialize stores on new login
    initWishlist(newUser.id);
    initCart(newUser.id);
    initAddresses(newUser.id);
    initOrders(newUser.id);
  }

  const logout = () => {
    safeSet('custom-user', null); // Clear from storage
    setUser(null);
    // Clear data from all stores on logout
    clearWishlist();
    clearCart();
    clearAddresses();
    clearOrders();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
