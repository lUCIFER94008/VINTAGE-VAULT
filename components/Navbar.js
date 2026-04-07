'use client';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-gold">
          VINTAGE.VAULT
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-sm font-medium uppercase tracking-widest">
          <Link href="/" className="hover:text-gold transition">Home</Link>
          <Link href="/products" className="hover:text-gold transition">Shop All</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/login" className="hover:text-gold transition">
            <User size={20} />
          </Link>
          <button className="hover:text-gold transition relative">
            <ShoppingBag size={20} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col space-y-6 text-center uppercase tracking-widest text-sm">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)}>Shop All</Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
}
