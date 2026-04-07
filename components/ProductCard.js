'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 shadow-2xl relative"
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-[#111]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out ${product.available === false ? 'grayscale-[0.5] opacity-60' : ''}`}
        />
        <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${
          product.available !== false 
            ? 'bg-black/60 text-gold border-gold/20' 
            : 'bg-red-500/20 text-red-500 border-red-500/30'
        }`}>
          {product.available !== false ? 'New Arrival' : 'Out of Stock'}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </div>
        <p className="text-gold text-2xl font-bold tracking-tighter mb-4">
          ₹{product.price}
        </p>

        <Link href={`/product/${product._id}`}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white text-black text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-gold transition-all duration-300"
          >
            View Details
          </motion.button>
        </Link>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
