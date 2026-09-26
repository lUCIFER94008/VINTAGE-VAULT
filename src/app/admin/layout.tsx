'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user || user.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [user, loading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#111111] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#666666]">
            AUTHENTICATING ADMIN ACCESS...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] flex">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Admin Content Container */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
