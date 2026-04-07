'use client';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Truck, RefreshCcw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: '5 Sleeve Jersey', slug: 'jersey', image: 'https://images.unsplash.com/photo-1580087442627-6260ef222122?auto=format&fit=crop&q=80&w=800' },
  { name: 'Shorts', slug: 'shorts', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Track Pant', slug: 'trackpant', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Printed Socks', slug: 'socks', image: 'https://images.unsplash.com/photo-1582966772640-3104347878e7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Headwear', slug: 'headwear', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800' },
  { name: 'Baggy', slug: 'baggy', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=800' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow"
            alt="Hero Background"
          />
        </div>

        <div className="relative z-20 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white uppercase italic"
          >
            VINTAGE.<span className="text-gold">VAULT</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-8 tracking-[0.2em] uppercase font-light"
          >
            Timeless Style. Sustainable Fashion.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href="/products">
              <button className="bg-gold text-black px-10 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                Shop Now <ChevronRight className="inline-block ml-2" size={16} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-black py-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <Truck className="text-gold" size={24} />
            <span className="text-xs uppercase tracking-widest font-semibold">Shipping All Over India</span>
          </div>
          <div className="flex items-center space-x-4 justify-center">
            <RefreshCcw className="text-gold" size={24} />
            <span className="text-xs uppercase tracking-widest font-semibold">Exchange & Replacement available</span>
          </div>
          <div className="flex items-center space-x-4 justify-center md:justify-end">
            <Smartphone className="text-gold" size={24} />
            <span className="text-xs uppercase tracking-widest font-semibold">COD & WhatsApp Orders</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-2">Collections</h2>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">SHOP BY CATEGORY</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer border border-white/5"
            >
              <img 
                src={cat.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={cat.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                <h4 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 leading-tight">{cat.name}</h4>
                <Link href={`/products?category=${cat.slug}`} className="text-gold text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Promo */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-lg mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">PREMIUM <br/> <span className="text-gold italic">THRIFTED</span> GOODS.</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Every piece in our vault is curated for those who value uniqueness and quality. Sustainable fashion is not just a trend, it's a lifestyle.
            </p>
            <Link href="/products">
              <button className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gold transition-colors">
                View Entire Catalog
              </button>
            </Link>
          </div>
          <div className="relative z-10 w-full md:w-1/2 flex justify-center">
             <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full animate-pulse" />
                <img 
                  src="https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&q=80&w=800" 
                  className="relative z-20 w-full h-full object-cover rounded-3xl border border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500"
                  alt="Promo Product"
                />
             </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full" />
        </div>
      </section>
    </div>
  );
}
