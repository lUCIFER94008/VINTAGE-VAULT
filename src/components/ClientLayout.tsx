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
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://res.cloudinary.com/dpmpefw2p/image/upload/v1790496666/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.jpg"
                      alt="VINTAGE VAULT Logo"
                      className="w-10 h-10 object-contain rounded-md border border-[#EAEAEA]"
                    />
                    <span className="font-black text-xl tracking-tighter uppercase text-[#111111]">VINTAGE VAULT</span>
                  </div>
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
