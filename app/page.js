'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, Truck, RefreshCcw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: '5 Sleeve Jersey', slug: '5 Sleeve Jersey', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
  { name: 'Shorts', slug: 'Shorts', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Track Pant', slug: 'Track Pant', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Printed Socks', slug: 'Printed Socks', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=800' },
  { name: 'Headwear', slug: 'Headwear', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800' },
  { name: 'Baggy', slug: 'Baggy', image: 'https://weavewardrobe.com/cdn/shop/files/2_119b4419-b42c-4457-a628-e13c2a2da54d_900x.jpg?v=1740581904' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-14 md:pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-start px-4 md:px-10 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://res.cloudinary.com/dpmpefw2p/image/upload/v1775923076/vintage-bg.jpg_k2fdso.jpg"
            alt="Vintage Vault Background"
            className="w-full h-full object-cover object-center"
          />

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10"></div>
          
          {/* Subtle bottom fade */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                VINTAGE. <br />
                <span className="text-gold">VAULT</span>
              </h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-6 text-gray-300 tracking-[0.3em] font-light text-xs md:text-lg uppercase max-w-lg"
              >
                TIMELESS STYLE. SUSTAINABLE FASHION.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-10"
              >
                <Link href="/products">
                  <button className="bg-gold text-black px-8 md:px-10 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-2 group text-xs md:text-sm">
                    SHOP NOW 
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Strip (Compact) */}
      <section className="bg-black py-8 border-y border-white/5 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 text-center">
            {[
              { icon: Truck, label: 'Shipping All Over India' },
              { icon: RefreshCcw, label: 'Exchange & Replacement' },
              { icon: Smartphone, label: 'COD & WhatsApp Orders' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="p-2 rounded-full bg-gold/5 text-gold mb-1">
                  <item.icon size={20} />
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/70">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category Section (Refined & Compact) */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-[#050505]">
        <div className="max-w-screen-xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gold text-[9px] font-bold uppercase tracking-[0.5em] block mb-2"
            >
              The Vault
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase"
            >
              Shop By Category
            </motion.h2>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="contents"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="group relative h-[200px] sm:h-[240px] md:h-[260px] overflow-hidden rounded-xl cursor-pointer border border-white/5 transition-all duration-300"
                >
                  <img 
                    src={cat.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" 
                    alt={cat.name}
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100" />
                  
                  <div className="absolute bottom-3 left-4 lg:bottom-4 lg:left-5 right-4 transition-all duration-300">
                    <span className="text-gold text-[9px] font-bold uppercase tracking-[2px] block mb-1 opacity-70">
                      Discover Collection
                    </span>
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight uppercase leading-tight">
                      {cat.name}
                    </h4>
                    
                    <div className="flex items-center mt-2 text-gold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                       <span className="text-[9px] font-bold uppercase tracking-widest mr-2">Shop Now</span>
                       <ArrowRight size={12} />
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/5 group-hover:ring-gold/30 transition-all duration-300 rounded-xl shadow-2xl" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-3xl bg-gold/5 blur-[100px] rounded-full -z-10" />
      </section>

      {/* Premium Footer Text (Compact) */}
      <section className="py-12 bg-black text-center border-t border-white/5">
        <div className="container mx-auto px-4">
          <h3 className="text-gold/10 text-3xl md:text-6xl font-black tracking-tighter mb-4 opacity-10 leading-none">VINTAGE.VAULT</h3>
          <p className="max-w-xl mx-auto text-gray-500 text-[11px] leading-relaxed mb-8 font-medium">
            Curated for those who value uniqueness and quality. Sustainable fashion is not just a trend, it's a lifestyle that begins in our vault.
          </p>
        </div>
      </section>
    </div>
  );
}
