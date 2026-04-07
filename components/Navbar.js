'use client';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo */}
          <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-gold hover:opacity-80 transition-opacity">
            VINTAGE.VAULT
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 space-x-12 text-[10px] font-bold uppercase tracking-[0.3em]">
            <Link href="/" className="hover:text-gold transition-colors duration-300">Home</Link>
            <Link href="/products" className="hover:text-gold transition-colors duration-300 text-white/70">Shop All</Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-5 md:space-x-8">
            <Link href="/login" className="hover:text-gold transition-colors text-white/90">
              <User size={20} className="md:w-6 md:h-6" />
            </Link>
            <Link href="/cart" className="hover:text-gold transition-colors relative text-white/90">
              <ShoppingBag size={20} className="md:w-6 md:h-6" />
              <span className="absolute -top-2 -right-2 bg-gold text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              className="lg:hidden text-white hover:text-gold transition-colors" 
              onClick={() => setIsOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-16">
                <span className="text-xl font-black tracking-tighter text-gold">VINTAGE.VAULT</span>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-gold p-2">
                  <X size={32} />
                </button>
              </div>

              <nav className="flex flex-col space-y-10 text-center">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Shop All', path: '/products' },
                  { name: 'Login', path: '/login' },
                  { name: 'Cart', path: '/cart' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link 
                      href={item.path} 
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-bold uppercase tracking-widest hover:text-gold transition-colors inline-block"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto text-center border-t border-white/10 pt-8">
                <p className="text-gold text-xs font-bold uppercase tracking-widest">Timeless Style.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
