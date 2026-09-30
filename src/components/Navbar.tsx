'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  const mainNavLinks = [
    { name: 'Home', href: '/' },
    { name: '5-Sleeve', href: '/category/5-sleeve-jerseys' },
    { name: 'Baggy', href: '/category/baggy' },
    { name: 'Full Sleeve', href: '/category/full-sleeve-shirts' },
    { name: 'Socks', href: '/category/socks' },
    { name: 'Headwear', href: '/category/headwear' },
    { name: 'Accessories', href: '/category/accessories' },
  ];

  const moreNavLinks = [
    { name: 'Shorts', href: '/category/shorts' },
    { name: 'T-Shirts', href: '/category/t-shirts' },
    { name: 'Track Pant', href: '/category/track-pant' },
    { name: 'New Arrivals', href: '/products?newArrival=true' },
    { name: 'Offers', href: '/products?featured=true' },
  ];

  const allNavLinks = [...mainNavLinks, ...moreNavLinks];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  // Do not render normal navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Main Sticky White Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] text-[#111111] shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Icon */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#111111] hover:text-zinc-600 focus:outline-none"
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dpmpefw2p/image/upload/v1790498090/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.png"
                alt="VINTAGE VAULT Logo"
                className="w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] object-cover rounded-full overflow-hidden shrink-0 border border-[#EAEAEA] shadow-sm"
              />
              <div className="flex flex-col items-start">
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-[#111111] group-hover:text-zinc-600 transition-colors leading-none">
                  VINTAGE VAULT
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#666666] font-bold uppercase mt-1">
                  TIMELESS STYLE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium">
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors duration-200 tracking-wide hover:text-[#111111] ${
                      isActive ? 'text-[#111111] font-bold border-b-2 border-[#111111] pb-1' : 'text-[#666666]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              <div className="relative group py-2">
                <button
                  className="flex items-center gap-1 text-[#666666] hover:text-[#111111] transition-colors tracking-wide py-1"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span>More</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-white border border-[#EAEAEA] rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                  {moreNavLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isActive ? 'bg-[#F8F8F8] font-bold text-[#111111]' : 'text-[#666666] hover:bg-[#F8F8F8] hover:text-[#111111]'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#111111] hover:text-zinc-600 transition-colors"
                aria-label="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/account/wishlist"
                className="p-2 text-[#111111] hover:text-zinc-600 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#111111] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              <Link
                href={user ? (user.role === 'admin' ? '/admin/dashboard' : '/account') : '/login'}
                className="p-2 text-[#111111] hover:text-zinc-600 transition-colors flex items-center gap-1"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
                {user && (
                  <span className="hidden md:inline text-xs font-semibold text-[#111111] max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                className="p-2 text-[#111111] hover:text-zinc-600 transition-colors relative bg-[#F8F8F8] border border-[#EAEAEA] rounded-full px-3 py-1.5 flex items-center gap-2"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#111111]" />
                <span className="text-xs font-bold text-[#111111]">{itemCount}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-[#EAEAEA] bg-white p-4 transition-all shadow-sm">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search jerseys, baggy, headwear, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] placeholder-[#888888] rounded-lg px-4 py-3 pl-11 text-sm focus:outline-none focus:border-[#111111]"
                  autoFocus
                />
                <Search className="w-5 h-5 text-[#888888] absolute left-3.5" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 text-[#666666] hover:text-[#111111] text-xs font-semibold uppercase tracking-wider"
                >
                  ESC
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white text-[#111111] h-full flex flex-col justify-between p-6 z-10 border-r border-[#EAEAEA] shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EAEAEA]">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://res.cloudinary.com/dpmpefw2p/image/upload/v1790498090/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.png"
                    alt="VINTAGE VAULT Logo"
                    className="w-[38px] h-[38px] object-cover rounded-full overflow-hidden shrink-0 border border-[#EAEAEA] shadow-sm"
                  />
                  <span className="text-lg font-black tracking-tight uppercase text-[#111111]">VINTAGE VAULT</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#666666] hover:text-[#111111]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col space-y-3">
                {allNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-[#666666] hover:text-[#111111] transition-colors py-1"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-[#EAEAEA] flex flex-col space-y-3">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-[#111111]"
                  >
                    My Account ({user.name})
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-[#666666] hover:text-[#111111]"
                  >
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-bold text-[#111111] flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-4 h-4" /> Admin Portal
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 px-4 rounded-lg bg-white border border-[#EAEAEA] text-sm font-semibold text-[#111111]"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 px-4 rounded-lg bg-[#111111] text-white text-sm font-bold"
                  >
                    REGISTER
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
