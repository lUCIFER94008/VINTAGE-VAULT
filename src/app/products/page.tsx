'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { Product } from '@/types';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { formatCurrency } from '@/lib/whatsapp';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  const categories = [
    { name: 'All Categories', slug: 'all' },
    { name: '5-Sleeve', slug: '5-sleeve-jerseys' },
    { name: 'Baggy', slug: 'baggy' },
    { name: 'Full-Sleeve Stripes', slug: 'full-sleeve-stripes' },
    { name: 'Socks', slug: 'socks' },
    { name: 'Headwear', slug: 'headwear' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Shorts', slug: 'shorts' },
    { name: 'T-Shirts', slug: 't-shirts' },
    { name: 'Track Pant', slug: 'track-pant' },
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Olive'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = `/api/products?sort=${sortBy}`;
        if (selectedCategory !== 'all') url += `&category=${selectedCategory}`;
        if (selectedSize !== 'all') url += `&size=${selectedSize}`;
        if (selectedColor !== 'all') url += `&color=${selectedColor}`;
        if (maxPrice < 2000) url += `&maxPrice=${maxPrice}`;
        if (inStockOnly) url += `&inStock=true`;

        const newArrival = searchParams.get('newArrival');
        const featured = searchParams.get('featured');
        if (newArrival) url += `&newArrival=true`;
        if (featured) url += `&featured=true`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, selectedSize, selectedColor, maxPrice, inStockOnly, sortBy, searchParams]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(2000);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const FilterSidebar = () => (
    <div className="space-y-8 text-[#111111]">
      <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#111111]" />
          <span>FILTERS</span>
        </h3>
        <button
          onClick={clearFilters}
          className="text-xs text-[#666666] hover:text-[#111111] underline font-semibold"
        >
          RESET ALL
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#888888]">CATEGORY</h4>
        <div className="space-y-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl transition-colors font-medium flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-[#111111] text-white font-bold'
                  : 'hover:bg-[#F8F8F8] text-[#666666] hover:text-[#111111]'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#888888]">MAX PRICE</h4>
          <span className="text-xs font-black text-[#111111]">{formatCurrency(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#111111] bg-[#EAEAEA] cursor-pointer h-1.5 rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-[#888888] font-mono">
          <span>₹0</span>
          <span>₹2,000</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#888888]">SIZE</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSize('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              selectedSize === 'all'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white border-[#EAEAEA] text-[#666666] hover:border-[#111111]'
            }`}
          >
            ALL
          </button>
          {sizes.map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                selectedSize === sz
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white border-[#EAEAEA] text-[#666666] hover:border-[#111111]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#888888]">COLOR</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedColor('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              selectedColor === 'all'
                ? 'bg-[#111111] text-white border-[#111111]'
                : 'bg-white border-[#EAEAEA] text-[#666666] hover:border-[#111111]'
            }`}
          >
            ALL
          </button>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedColor === c
                  ? 'bg-[#111111] text-white border-[#111111] font-bold'
                  : 'bg-white border-[#EAEAEA] text-[#666666] hover:border-[#111111]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-[#111111]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-white border-[#EAEAEA] text-[#111111] accent-[#111111] cursor-pointer"
          />
          <span>IN STOCK ONLY</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-[#EAEAEA] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
              EXPLORE CATALOG
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111111] uppercase tracking-tight mt-1">
              ALL PRODUCTS
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-2">
              Explore our latest drop of heavyweight 5-sleeve jerseys, baggy denim, headwear, shorts & accessories.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden bg-white border border-[#EAEAEA] text-[#111111] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Filter className="w-4 h-4 text-[#111111]" />
              <span>FILTERS</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-[#EAEAEA] rounded-xl px-3 py-1.5 shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-[#888888]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#111111] focus:outline-none cursor-pointer py-1"
              >
                <option value="newest">Sort: Newest</option>
                <option value="popular">Sort: Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-[#EAEAEA] shadow-sm h-fit sticky top-24">
            <FilterSidebar />
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <GridSkeleton count={6} />
            ) : (
              <ProductGrid
                products={products}
                emptyMessage="No products match your selected filters."
              />
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white border-r border-[#EAEAEA] p-6 h-full overflow-y-auto z-10 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
                <span className="font-black text-sm uppercase text-[#111111]">FILTERS</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#666666] hover:text-[#111111]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterSidebar />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#111111] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider shadow-md"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-[#666666]">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
