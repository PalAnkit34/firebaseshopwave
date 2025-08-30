
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthContextType {
  adminUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !adminUser && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
    if (!loading && adminUser && pathname === '/admin/login') {
      router.push('/admin');
    }
  }, [adminUser, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const value = { adminUser, loading, error, login, logout };
  
  if (loading && pathname !== '/admin/login') {
     return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand"></div>
        </div>
     );
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
