'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, ShoppingBag, Heart, MapPin, LogOut, ShieldAlert } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto p-16 text-center text-[#666666]">
          Loading account details...
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully.', 'info');
    router.push('/');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Profile Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white font-black text-2xl flex items-center justify-center uppercase shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-[#25D366] uppercase tracking-widest">
                CUSTOMER PROFILE
              </span>
              <h1 className="text-2xl font-black text-[#111111] uppercase">{user.name}</h1>
              <p className="text-xs text-[#666666] font-mono mt-0.5">
                {user.email} | {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="bg-[#111111] hover:bg-zinc-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" /> Admin Portal
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white border border-[#EAEAEA] text-[#111111] hover:text-[#DC2626] text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1.5 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="p-6 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#111111] transition-all space-y-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F8F8F8] text-[#111111] flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-colors border border-[#EAEAEA]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#111111] uppercase">MY ORDERS</h3>
            <p className="text-xs text-[#666666]">View order history and track active WhatsApp orders.</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="p-6 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#111111] transition-all space-y-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F8F8F8] text-[#111111] flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-colors border border-[#EAEAEA]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#111111] uppercase">WISHLIST</h3>
            <p className="text-xs text-[#666666]">Access saved products and move items to cart.</p>
          </Link>

          <Link
            href="/account/addresses"
            className="p-6 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#111111] transition-all space-y-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F8F8F8] text-[#111111] flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-colors border border-[#EAEAEA]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#111111] uppercase">MY ADDRESSES</h3>
            <p className="text-xs text-[#666666]">Manage saved shipping addresses for quick checkout.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
