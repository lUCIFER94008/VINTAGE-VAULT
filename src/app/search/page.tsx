'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { Product } from '@/types';
import { Search, Sparkles } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Search Input Box */}
        <div className="max-w-3xl mx-auto space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search jerseys, jeans, caps, glasses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] placeholder-[#888888] rounded-2xl px-6 py-4 pl-14 text-base focus:outline-none focus:border-[#111111] shadow-sm"
              autoFocus
            />
            <Search className="w-6 h-6 text-[#888888] absolute left-4" />
            <button
              type="submit"
              className="absolute right-3 bg-[#111111] text-white font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
            >
              SEARCH
            </button>
          </form>

          {/* Search Suggestions Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-[#888888] uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> SUGGESTIONS:
            </span>
            {['jersey', 'jeans', 'flannel', 'caps', 'glasses', 'argentina'].map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                className="text-xs font-semibold bg-white border border-[#EAEAEA] text-[#666666] hover:text-[#111111] hover:border-[#111111] px-3 py-1 rounded-full uppercase transition-colors shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="border-b border-[#EAEAEA] pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] uppercase tracking-tight">
            {query ? `SEARCH RESULTS FOR "${query}"` : 'SEARCH VINTAGE VAULT'}
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Found {products.length} products matching your query.
          </p>
        </div>

        {/* Results Grid */}
        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          <ProductGrid
            products={products}
            emptyMessage={
              query
                ? `No products found matching "${query}". Try searching for jerseys, jeans, or caps.`
                : 'Type something in the search box above to explore.'
            }
          />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-[#666666]">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
