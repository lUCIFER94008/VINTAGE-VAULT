"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const COLLECTIONS = [
  "5 Sleeve Jersey",
  "Shorts",
  "Track Pant",
  "Printed Socks",
  "Headwear",
  "Baggy"
];

const PRICE_RANGES = [
  "Under ₹500",
  "₹500 - ₹1000",
  "₹1000 - ₹2000",
  "Above ₹2000"
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleCategory = (category) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  return (
    <div className="bg-black/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-8 sticky top-32">
      <div>
        <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6 italic">Collections</h2>
        <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest transition-all">
          {COLLECTIONS.map((item) => {
            const isActive = activeCategory === item;
            return (
              <li 
                key={item} 
                onClick={() => handleCategory(item)}
                className={`cursor-pointer flex items-center transition-all ${isActive ? 'text-gold' : 'text-gray-500 hover:text-white'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${isActive ? 'bg-gold scale-125' : 'bg-white/10'}`} />
                {item}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6 italic">Price Range</h2>
        <ul className="space-y-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          {PRICE_RANGES.map((range) => (
            <li key={range} className="hover:text-gold cursor-pointer transition-colors flex items-center">
               <div className="w-3 h-3 border border-white/10 rounded mr-3" />
              {range}
            </li>
          ))}
        </ul>
      </div>
      
      {activeCategory && (
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearFilters}
          className="w-full py-4 border border-gold/30 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gold hover:bg-gold/10 transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)]"
        >
          Clear All Filters
        </motion.button>
      )}
    </div>
  );
}
