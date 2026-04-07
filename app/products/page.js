'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          let filteredProducts = data.data;
          if (categoryFilter) {
            // Mapping friendly names to slug-like categories if needed, but here I'll check both
            filteredProducts = filteredProducts.filter(p => 
              p.category?.toLowerCase() === categoryFilter.toLowerCase() ||
              p.category?.toLowerCase().replace(/\s+/g, '') === categoryFilter.toLowerCase()
            );
          }
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs">Entering the Vault...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-4">
          {categoryFilter ? `${categoryFilter.toUpperCase()} COLLECTION` : 'THE ENTIRE VAULT'}
        </h1>
        <p className="text-gray-400 uppercase tracking-widest text-xs">
          {categoryFilter ? `Exploring ${categoryFilter} fashion` : 'Surplus / Thrifted Fashion Collection'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-24 bg-[#111] rounded-3xl border border-white/5">
          <p className="text-gray-500 mb-4 tracking-widest uppercase text-sm">Nothing found in this section.</p>
          <p className="text-gray-600 text-xs text-balance">We're constantly restocking. Check back soon or message us on WhatsApp.</p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
