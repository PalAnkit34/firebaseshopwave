
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { safeGet, safeSet } from '@/lib/storage'
import { useWishlist } from '@/lib/wishlistStore'
import { useCart } from '@/lib/cartStore'
import { useAddressBook } from '@/lib/addressStore'
import { useOrders } from '@/lib/ordersStore'
import { useNotificationStore } from '@/lib/notificationStore'

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

const getAllUsers = (): Record<string, CustomUser> => {
    return safeGet('all-users', {});
}

const saveAllUsers = (users: Record<string, CustomUser>) => {
    safeSet('all-users', users);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [tempPhone, setTempPhone] = useState<string | null>(null);

  const { init: initWishlist, clear: clearWishlist } = useWishlist();
  const { init: initCart, clear: clearCart } = useCart();
  const { init: initAddresses, clear: clearAddresses } = useAddressBook();
  const { init: initOrders, clear: clearOrders } = useOrders();
  const { init: initNotifications, clear: clearNotifications } = useNotificationStore();


  const initializeStoresForUser = (userId: string) => {
    initWishlist(userId);
    initCart(userId);
    initAddresses(userId);
    initOrders(userId);
    initNotifications(userId);
  };

  const clearAllStores = () => {
      clearWishlist();
      clearCart();
      clearAddresses();
      clearOrders();
      clearNotifications();
  }

  useEffect(() => {
    const storedUser = safeGet<CustomUser | null>('current-user', null);
    
    if (storedUser) {
      setUser(storedUser);
      initializeStoresForUser(storedUser.id);
    }
    
    setLoading(false);
  }, []);

  const login = async (phone: string) => {
    setLoading(true);
    const allUsers = getAllUsers();
    const existingUser = allUsers[phone];

    if (existingUser) {
      safeSet('current-user', existingUser);
      setUser(existingUser);
      initializeStoresForUser(existingUser.id);
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
    const allUsers = getAllUsers();
    const newUser: CustomUser = {
      id: tempPhone,
      fullName: fullName,
      createdAt: Date.now(),
    };
    
    allUsers[tempPhone] = newUser;
    saveAllUsers(allUsers);

    safeSet('current-user', newUser);
    setUser(newUser);
    initializeStoresForUser(newUser.id);
    setIsNewUser(false);
    setTempPhone(null);
    setLoading(false);
  };
  
  const updateUserProfile = async (profileData: Partial<CustomUser>) => {
    if (!user) return;
    const allUsers = getAllUsers();
    const updatedUser = { ...user, ...profileData };
    
    allUsers[user.id] = updatedUser;
    saveAllUsers(allUsers);

    setUser(updatedUser);
    safeSet('current-user', updatedUser);
  };

  const logout = () => {
    safeSet('current-user', null);
    setUser(null);
    clearAllStores();
  }

  return (
    <AuthContext.Provider value={{ user, loading, isNewUser, login, completeRegistration, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
