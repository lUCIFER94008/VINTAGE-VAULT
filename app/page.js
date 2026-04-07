'use client';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Truck, RefreshCcw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: '5 Sleeve Jersey', slug: 'jersey', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800' },
  { name: 'Shorts', slug: 'shorts', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Track Pant', slug: 'trackpant', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Printed Socks', slug: 'socks', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=800' },
  { name: 'Headwear', slug: 'headwear', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800' },
  { name: 'Baggy', slug: 'baggy', image: 'https://weavewardrobe.com/cdn/shop/files/2_119b4419-b42c-4457-a628-e13c2a2da54d_900x.jpg?v=1740581904' },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1600" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20 w-full">
          <div className="max-w-4xl text-center lg:text-left mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-[90%] mx-auto lg:mx-0 break-words"
            >
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-4 leading-tight">
                <span className="text-white">VINTAGE.</span>
                <br className="md:hidden" />
                <span className="text-gold lg:ml-4">VAULT</span>
              </h1>
              
              <p className="text-sm md:text-xl text-gray-300 mb-10 tracking-[0.2em] uppercase font-light max-w-xl mx-auto lg:mx-0">
                TIMELESS STYLE. <br className="md:hidden" /> SUSTAINABLE FASHION.
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/products" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-gold text-black px-12 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    Shop Now <ChevronRight className="inline-block ml-1" size={16} />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Subtle bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* Features Strip */}
      <section className="bg-black py-12 border-y border-white/5 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="p-3 rounded-full bg-gold/10 text-gold mb-1">
                <Truck size={24} />
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-white/90">Shipping All Over India</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="p-3 rounded-full bg-gold/10 text-gold mb-1">
                <RefreshCcw size={24} />
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-white/90">Exchange & Replacement</span>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="p-3 rounded-full bg-gold/10 text-gold mb-1">
                <Smartphone size={24} />
              </div>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-white/90">COD & WhatsApp Orders</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-gold text-[10px] font-bold uppercase tracking-[0.5em] block mb-4"
            >
              The Collection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase"
            >
              Shop By Category
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, i) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer border border-white/10 hover:border-gold/50 transition-colors duration-500"
              >
                <img 
                  src={cat.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.7] group-hover:brightness-[0.5]" 
                  alt={cat.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-2xl font-black mb-3 text-white tracking-tighter uppercase leading-tight">{cat.name}</h4>
                  <Link 
                    href={`/products?category=${cat.slug}`} 
                    className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                  >
                    Explore <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
                
                {/* Glow affect on hover */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-gold/30 transition-all duration-500 rounded-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-gold/5 blur-[150px] rounded-full -z-10" />
      </section>

      {/* Premium Footer Text */}
      <section className="py-20 bg-black text-center border-t border-white/5">
        <div className="container mx-auto px-4">
          <h3 className="text-gold/20 text-4xl md:text-8xl font-black tracking-tighter mb-8 opacity-20">VINTAGE.VAULT</h3>
          <p className="max-w-2xl mx-auto text-gray-500 text-sm leading-relaxed mb-12">
            Curated for those who value uniqueness and quality. Sustainable fashion is not just a trend, it's a lifestyle that begins in our vault.
          </p>
          <div className="flex justify-center space-x-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             {/* Brand logos / Trust marks could go here */}
          </div>
        </div>
      </section>
    </div>
  );
}
