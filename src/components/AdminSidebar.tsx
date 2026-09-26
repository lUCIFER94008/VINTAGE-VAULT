'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    showToast('Logged out of admin panel.', 'info');
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile Bar Top */}
      <div className="lg:hidden bg-white border-b border-[#EAEAEA] p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-black text-lg tracking-tight uppercase text-[#111111]">
            VV ADMIN
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#111111] hover:text-zinc-600"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#EAEAEA] flex flex-col justify-between p-5 transition-transform duration-300 lg:translate-x-0 shadow-sm ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Admin Header Logo */}
          <div className="pb-6 mb-6 border-b border-[#EAEAEA] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase text-[#111111]">
                VINTAGE VAULT
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#111111] uppercase">
                ADMIN CONTROL PANEL
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#F3F3F3] text-[#111111] border border-[#EAEAEA]'
                      : 'text-[#666666] hover:text-[#111111] hover:bg-[#F8F8F8]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#EAEAEA] flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-semibold text-[#666666] hover:text-[#111111] p-2.5 rounded-xl hover:bg-[#F8F8F8] transition-colors"
          >
            <Store className="w-4 h-4 text-[#111111]" />
            <span>Visit Live Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold text-[#DC2626] hover:text-red-700 p-2.5 rounded-xl hover:bg-red-50 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
