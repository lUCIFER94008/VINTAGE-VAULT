'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const CATEGORIES = [
  "5 Sleeve Jersey",
  "Shorts",
  "Track Pant",
  "Printed Socks",
  "Headwear",
  "Baggy"
];

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: 10000 },
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === category) {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceClick = (min, max) => {
    // Current simple implementation: logic can be expanded
    // For now, it's a visual placeholder as per user's Step 7
  };

  return (
    <aside className="sticky top-32 space-y-10 pr-8 border-r border-white/5 h-fit hidden md:block">
      {/* Categories Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-6">
          Collections
        </h3>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <motion.div
                key={cat}
                whileHover={{ x: 4 }}
                onClick={() => handleCategoryClick(cat)}
                className={`cursor-pointer text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center group ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-all duration-300 ${
                  isActive ? 'bg-gold scale-125' : 'bg-transparent group-hover:bg-white/20'
                }`} />
                {cat}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Price Filtering Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-6">
          Price Range
        </h3>
        <div className="space-y-4">
          {PRICE_RANGES.map((range) => (
            <div
              key={range.label}
              className="group flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-4 h-4 rounded border border-white/10 group-hover:border-gold/50 transition-colors" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors">
                {range.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeCategory && (
        <button
          onClick={() => router.push('/products')}
          className="w-full py-3 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-white/5 hover:text-white transition-all"
        >
          Clear All Filters
        </button>
      )}
    </aside>
  );
}
