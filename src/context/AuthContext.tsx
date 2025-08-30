
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { safeGet, safeSet } from '@/lib/storage'
import { useWishlist } from '@/lib/wishlistStore'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import { useOrders } from '@/lib/ordersStore'

export interface CustomUser {
  id: string; // Phone number will be the ID
  fullName?: string;
  createdAt?: number;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  isNewUser: boolean;
  login: (phone: string) => Promise<void>;
  completeRegistration: (fullName: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<CustomUser>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isNewUser: false,
  login: async () => {},
  completeRegistration: async () => {},
  updateUserProfile: async () => {},
  logout: () => {},
});

const getUserDocRef = (userId: string) => doc(db, 'users', userId);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [tempPhone, setTempPhone] = useState<string | null>(null);

  const { init: initWishlist, clear: clearWishlist } = useWishlist();
  const { init: initCart, clear: clearCart } = useCart();
  const { init: initAddresses, clear: clearAddresses } = useAddressBook();
  const { init: initOrders, clear: clearOrders } = useOrders();

  const initializeStoresForUser = (userId: string) => {
    const unsubWishlist = initWishlist(userId);
    const unsubCart = initCart(userId);
    const unsubAddresses = initAddresses(userId);
    const unsubOrders = initOrders(userId);
    return [unsubWishlist, unsubCart, unsubAddresses, unsubOrders];
  };

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    const storedUser = safeGet<CustomUser | null>('custom-user', null);
    
    if (storedUser) {
      setUser(storedUser);
      unsubs = initializeStoresForUser(storedUser.id);
    }
    
    setLoading(false);

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const login = async (phone: string) => {
    setLoading(true);
    const userDocRef = getUserDocRef(phone);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = { id: docSnap.id, ...docSnap.data() } as CustomUser;
      safeSet('custom-user', userData);
      setUser(userData);
      initializeStoresForUser(userData.id);
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
      setTempPhone(phone);
    }
    setLoading(false);
  }

  const completeRegistration = async (fullName: string) => {
    if (!tempPhone) return;
    setLoading(true);
    const newUser: CustomUser = {
      id: tempPhone,
      fullName: fullName,
      createdAt: Date.now(),
    };
    await setDoc(getUserDocRef(tempPhone), newUser);
    safeSet('custom-user', newUser);
    setUser(newUser);
    initializeStoresForUser(newUser.id);
    setIsNewUser(false);
    setTempPhone(null);
    setLoading(false);
  };
  
  const updateUserProfile = async (profileData: Partial<CustomUser>) => {
    if (!user) return;
    const userDocRef = getUserDocRef(user.id);
    await updateDoc(userDocRef, profileData);
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    safeSet('custom-user', updatedUser);
  };

  const logout = () => {
    safeSet('custom-user', null);
    setUser(null);
    clearWishlist();
    clearCart();
    clearAddresses();
    clearOrders();
  }

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser, login, completeRegistration, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
