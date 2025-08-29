
'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { safeGet, safeSet } from '@/lib/storage'

// A simplified User object for our custom auth
interface CustomUser {
  id: string; // Phone number will be the ID
  // We can add more fields here later if needed
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

  useEffect(() => {
    // On app load, check if a user is "logged in" from localStorage
    const storedUser = safeGet<CustomUser | null>('custom-user', null);
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (phone: string) => {
    const newUser: CustomUser = { id: phone };
    safeSet('custom-user', newUser);
    setUser(newUser);
  }

  const logout = () => {
    safeSet('custom-user', null); // Clear from storage
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
