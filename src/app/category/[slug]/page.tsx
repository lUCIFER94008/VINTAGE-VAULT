'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { Product, Category } from '@/types';
import { Filter, X, SlidersHorizontal, ArrowUpDown, AlertCircle, RotateCcw, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/whatsapp';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Olive'];

  const fetchCategoryData = async () => {
    setLoading(true);
    setFetchError(null);
    setCategoryNotFound(false);
    try {
      let url = `/api/products?category=${slug}&sort=${sortBy}`;
      if (selectedSize !== 'all') url += `&size=${selectedSize}`;
      if (selectedColor !== 'all') url += `&color=${selectedColor}`;
      if (maxPrice < 2000) url += `&maxPrice=${maxPrice}`;
      if (inStockOnly) url += `&inStock=true`;

      const [prodRes, catRes] = await Promise.all([
        fetch(url).catch((err) => {
          console.warn('Products fetch exception:', err);
          return null;
        }),
        fetch('/api/categories').catch((err) => {
          console.warn('Categories fetch exception:', err);
          return null;
        }),
      ]);

      if (!prodRes || !prodRes.ok) {
        throw new Error('Unable to load category products. Please try again.');
      }
      if (!catRes || !catRes.ok) {
        throw new Error('Unable to load categories. Please try again.');
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }

      if (catData.success && Array.isArray(catData.categories)) {
        const match = catData.categories.find((c: Category) => c.slug === slug);
        if (match) {
          setCategoryInfo(match);
        } else {
          // If no matching category found in official DB list, verify if any products match
          if (prodData.products && prodData.products.length > 0) {
            setCategoryInfo({
              _id: slug,
              name: slug.replace(/-/g, ' ').toUpperCase(),
              slug,
              description: 'Explore our latest collection of premium streetwear.',
            });
          } else {
            setCategoryNotFound(true);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch category page data', err);
      setFetchError(err.message || 'Unable to load category data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [slug, selectedSize, selectedColor, maxPrice, inStockOnly, sortBy]);

  const clearFilters = () => {
    setSelectedSize('all');
    setSelectedColor('all');
    setMaxPrice(2000);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const titleName = categoryInfo?.name || slug.replace(/-/g, ' ').toUpperCase();

  // If category is explicitly not found
  if (!loading && categoryNotFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] flex items-center justify-center mx-auto text-2xl font-bold">
          !
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            CATEGORY NOT FOUND
          </h1>
          <p className="text-sm text-[#666666]">
            The category &quot;{slug}&quot; does not exist or has been removed.
          </p>
        </div>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#111111] text-white font-bold text-xs px-8 py-3.5 rounded-full hover:bg-zinc-800 transition-colors uppercase tracking-wider shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>BACK TO SHOP</span>
          </Link>
        </div>
      </div>
    );
  }

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
              CATEGORY COLLECTION
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111111] uppercase tracking-tight mt-1">
              {titleName}
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-2 italic">
              &quot;{categoryInfo?.description || 'Explore our latest collection.'}&quot;
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
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

        {/* API Error Message */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchCategoryData}
              className="inline-flex items-center gap-2 bg-[#111111] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        )}

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
                emptyMessage={`NO PRODUCTS IN THIS CATEGORY`}
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
