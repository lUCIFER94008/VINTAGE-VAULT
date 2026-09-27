'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappUrl = "https://wa.me/919605332248?text=Hello%20VINTAGE%20VAULT%2C%20I%20need%20assistance.";

  return (
    <footer className="bg-white text-[#666666] border-t border-[#EAEAEA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#EAEAEA]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dpmpefw2p/image/upload/v1790498090/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.png"
                alt="VINTAGE VAULT Logo"
                className="w-9 h-9 object-contain rounded-md border border-[#EAEAEA] shrink-0"
              />
              <span className="text-2xl font-black tracking-tighter text-[#111111] uppercase group-hover:text-zinc-600 transition-colors">
                VINTAGE VAULT
              </span>
            </Link>
            <p className="text-sm italic text-[#666666] font-medium">
              &quot;Timeless Style. Always Wins.&quot;
            </p>
            <p className="text-xs text-[#888888] leading-relaxed max-w-sm">
              Curated modern streetwear, heavyweight jerseys, vintage wash raw denim, and essential daily accessories. Crafting luxury streetwear aesthetics for the modern minimalist.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/__.vintagevault/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-widest">SHOP</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-[#111111] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/5-sleeve-jerseys" className="hover:text-[#111111] transition-colors">
                  5-Sleeve Jerseys
                </Link>
              </li>
              <li>
                <Link href="/category/jeans" className="hover:text-[#111111] transition-colors">
                  Jeans & Denim
                </Link>
              </li>
              <li>
                <Link href="/category/full-sleeve-shirts" className="hover:text-[#111111] transition-colors">
                  Full Sleeve Shirts
                </Link>
              </li>
              <li>
                <Link href="/category/socks" className="hover:text-[#111111] transition-colors">
                  Ribbed Socks
                </Link>
              </li>
              <li>
                <Link href="/category/caps" className="hover:text-[#111111] transition-colors">
                  Caps & Beanies
                </Link>
              </li>
              <li>
                <Link href="/category/glasses" className="hover:text-[#111111] transition-colors">
                  Eyewear & Glasses
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-widest">HELP & SUPPORT</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/account/orders" className="hover:text-[#111111] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#111111] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#111111] transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#111111] transition-colors"
                >
                  Contact Us (WhatsApp)
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-widest">ACCOUNT</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-[#111111] transition-colors">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#111111] transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#111111] transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="hover:text-[#111111] transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-[#888888] hover:text-[#111111] transition-colors pt-2 block font-mono">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#888888] gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center sm:text-left">
            <p>© 2026 VINTAGE VAULT. All rights reserved.</p>
            <span className="hidden sm:inline text-[#CCCCCC]">•</span>
            <p className="text-[#888888]">
              Developed by{' '}
              <a
                href="https://www.pixelriftonline.online/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#111111] hover:underline transition-colors"
              >
                Pixelrift
              </a>
            </p>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>WhatsApp Ordering System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
