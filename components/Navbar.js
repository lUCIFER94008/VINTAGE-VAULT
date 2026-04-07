'use client';
import Link from 'next/link';
import { User, Menu, X } from 'lucide-react';
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
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-2 md:py-3 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 h-[60px]' : 'bg-transparent h-[70px]'
        } flex items-center`}
      >
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center transition-all duration-300">
          {/* Left: Logo (Reduced size) */}
          <Link href="/" className="text-lg md:text-xl font-black tracking-tighter text-gold hover:opacity-80 transition-opacity">
            VINTAGE.VAULT
          </Link>

          {/* Center: Desktop Links (Tightened tracking) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 space-x-10 text-[9px] font-bold uppercase tracking-[0.4em]">
            <Link href="/" className="hover:text-gold transition-colors duration-300">Home</Link>
            <Link href="/products" className="hover:text-gold transition-colors duration-300 text-white/70">Shop All</Link>
          </div>

          {/* Right: Icons (Scaled down) */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href="/login" className="hover:text-gold transition-colors text-white/90">
              <User size={18} className="md:w-5 md:h-5 text-gray-300 hover:text-gold" />
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              className="lg:hidden text-white hover:text-gold transition-colors p-1" 
              onClick={() => setIsOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Reduced font size and gap) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-lg"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <span className="text-lg font-black tracking-tighter text-gold">VINTAGE.VAULT</span>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-gold p-2">
                  <X size={28} />
                </button>
              </div>

              <nav className="flex flex-col space-y-8 text-center mt-10">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Shop All', path: '/products' },
                  { name: 'Login', path: '/login' },
                  { name: 'Register', path: '/register' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      href={item.path} 
                      onClick={() => setIsOpen(false)}
                      className="text-2xl md:text-3xl font-bold uppercase tracking-widest hover:text-gold transition-colors inline-block"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto text-center border-t border-white/5 pt-6 opacity-40">
                <p className="text-gold text-[8px] font-bold uppercase tracking-widest">Premium Thrifted Goods.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
