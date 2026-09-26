'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen bg-white">
              {mounted ? <Navbar /> : (
                <header className="bg-white text-[#111111] h-20 border-b border-[#EAEAEA] px-8 flex items-center justify-between">
                  <span className="font-black text-xl tracking-tighter uppercase text-[#111111]">VINTAGE VAULT</span>
                </header>
              )}
              <main className="flex-grow bg-white">{children}</main>
              {mounted && <Footer />}
            </div>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
