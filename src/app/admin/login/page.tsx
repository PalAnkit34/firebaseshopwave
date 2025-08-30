
'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAdminAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="card bg-white p-8 shadow-lg">
           <div className="text-center mb-6">
             <div className="inline-block bg-brand p-3 rounded-full">
                <LayoutDashboard className="h-8 w-8 text-white" />
             </div>
            <h1 className="text-2xl font-bold mt-2">Admin Panel</h1>
            <p className="text-gray-500">Please sign in to continue</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-2 border"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
