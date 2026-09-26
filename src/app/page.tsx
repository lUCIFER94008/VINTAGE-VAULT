'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  RotateCcw,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import ProductGrid from '@/components/ProductGrid';
import { GridSkeleton } from '@/components/LoadingSkeleton';
import { Product, Category } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/seedData';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES as any);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS as any);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products').catch((err) => {
          console.warn('Products fetch exception:', err);
          return null;
        }),
        fetch('/api/categories').catch((err) => {
          console.warn('Categories fetch exception:', err);
          return null;
        }),
      ]);

      if (!prodRes || !prodRes.ok) {
        throw new Error('Unable to load products. Please check connection.');
      }
      if (!catRes || !catRes.ok) {
        throw new Error('Unable to load categories. Please check connection.');
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }
      if (catData.success && Array.isArray(catData.categories)) {
        setCategories(catData.categories);
      }
    } catch (err: any) {
      console.error('HomePage fetch caught error:', err);
      setFetchError(err.message || 'Unable to load catalog data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const trendingProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.slice(0, 8);

  const reviews = [
    {
      name: 'Mohammed Rizwan',
      rating: 5,
      review: 'The quality of the Argentina 5-Sleeve Jersey is unmatched! Heavy cotton, perfectly oversized fit.',
      product: 'Argentina 5-Sleeve Retro Jersey',
      city: 'Kochi, Kerala',
    },
    {
      name: 'Ananya Sharma',
      rating: 5,
      review: 'Ordering on WhatsApp was super smooth. Got my raw denim acid wash jeans delivered in 2 days!',
      product: 'Raw Acid Wash Baggy Jeans',
      city: 'Mumbai',
    },
    {
      name: 'Vikramaditya S.',
      rating: 5,
      review: 'Best streetwear site in India. Premium fabric, clean packaging, and total value for money.',
      product: 'Heavy Flannel Oversized Plaid Shirt',
      city: 'Bengaluru',
    },
  ];

  return (
    <div className="bg-white space-y-20 pb-16">
      {/* SECTION 1 - PREMIUM WHITE HERO BANNER */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#FFFFFF] border-b border-[#EAEAEA]">
        {/* Background Subtle Gradient & Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80"
            alt="VINTAGE VAULT Fashion Hero"
            fill
            priority
            className="object-cover object-center opacity-15 transition-transform duration-1000"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F8F8] border border-[#EAEAEA] text-xs font-bold uppercase tracking-widest text-[#111111] shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>SPRING / SUMMER 2026 DROP NOW LIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-[#111111] leading-tight drop-shadow-sm">
            TIMELESS STYLE<br />
            <span className="text-zinc-500">
              ALWAYS WINS.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#666666] font-medium tracking-wide">
            Premium 5-Sleeve Jerseys, Vintage Raw Jeans & Everyday Streetwear Essentials.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto bg-[#111111] text-white font-black text-sm px-9 py-4 rounded-2xl hover:bg-zinc-800 transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 tracking-wider uppercase"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/category/5-sleeve-jerseys"
              className="w-full sm:w-auto bg-white text-[#111111] border border-[#111111] font-bold text-sm px-9 py-4 rounded-2xl hover:bg-[#F8F8F8] transition-all tracking-wider uppercase shadow-sm"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* API ERROR BANNER STATE */}
      {fetchError && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-base">
              <AlertCircle className="w-5 h-5" />
              <span>{fetchError}</span>
            </div>
            <p className="text-xs text-red-500">
              Unable to reach product server. Please verify your connection or try again.
            </p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 bg-[#111111] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-colors uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        </section>
      )}

      {/* SECTION 2 - SERVICE FEATURES (WHITE CARDS - 3 COLUMNS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#F8F8F8] text-[#111111] shrink-0 border border-[#EAEAEA]">
              <RotateCcw className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] uppercase">EASY RETURNS</h4>
              <p className="text-xs text-[#666666] mt-1">Simple size exchange</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#F8F8F8] text-[#111111] shrink-0 border border-[#EAEAEA]">
              <ShieldCheck className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] uppercase">PREMIUM QUALITY</h4>
              <p className="text-xs text-[#666666] mt-1">280+ GSM heavyweight fabrics</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#F8F8F8] text-[#111111] shrink-0 border border-[#EAEAEA]">
              <Headphones className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] uppercase">CUSTOMER SUPPORT</h4>
              <p className="text-xs text-[#666666] mt-1">Instant support on WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
              CATEGORIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight uppercase mt-1">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#111111] hover:text-zinc-600 uppercase tracking-wider flex items-center gap-1"
          >
            <span>VIEW ALL CATEGORIES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard
              key={cat._id?.toString() || cat.slug || `cat-${idx}`}
              name={cat.name}
              slug={cat.slug}
              image={cat.image || 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4 - TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-current text-amber-500" /> HOT DROPS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight uppercase mt-1">
              TRENDING NOW
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="text-xs font-bold text-[#111111] hover:text-zinc-600 uppercase tracking-wider flex items-center gap-1"
          >
            <span>SEE ALL TRENDING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? <GridSkeleton count={4} /> : <ProductGrid products={trendingProducts} />}
      </section>

      {/* SECTION 5 - NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
              JUST RELEASED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight uppercase mt-1">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/products?newArrival=true"
            className="text-xs font-bold text-[#111111] hover:text-zinc-600 uppercase tracking-wider flex items-center gap-1"
          >
            <span>EXPLORE ALL NEW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? <GridSkeleton count={4} /> : <ProductGrid products={newArrivals} />}
      </section>

      {/* SECTION 7 - BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
              POPULAR CHOICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight uppercase mt-1">
              BEST SELLERS
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#111111] hover:text-zinc-600 uppercase tracking-wider flex items-center gap-1"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? <GridSkeleton count={8} /> : <ProductGrid products={bestSellers} />}
      </section>

      {/* SECTION 8 - WHY VINTAGE VAULT (WHITE STANDARD) */}
      <section className="bg-[#F8F8F8] border-y border-[#EAEAEA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
              THE VINTAGE VAULT STANDARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-tight">
              WHY CHOOSE US
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-[#EAEAEA] text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto font-black text-lg">
                01
              </div>
              <h3 className="text-base font-bold text-[#111111] uppercase">PREMIUM QUALITY</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Heavyweight 280+ GSM fabrics, precision stitching, and custom washed finishes built to last.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAEAEA] text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto font-black text-lg">
                02
              </div>
              <h3 className="text-base font-bold text-[#111111] uppercase">AFFORDABLE PRICING</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Direct-to-consumer model ensures luxury streetwear aesthetics at transparent prices.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAEAEA] text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto font-black text-lg">
                03
              </div>
              <h3 className="text-base font-bold text-[#111111] uppercase">FAST DELIVERY</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Dispatched within 24 hours with express courier tracking across India.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center mx-auto font-black text-lg shadow-sm">
                04
              </div>
              <h3 className="text-base font-bold text-[#111111] uppercase">EASY WHATSAPP ORDERING</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                No complex payment forms. Confirm details directly with our team on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 - CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
            REAL FEEDBACK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-tight">
            CUSTOMER REVIEWS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#EAEAEA] flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#666666] italic leading-relaxed">
                  &quot;{rev.review}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#111111] flex items-center gap-1.5">
                    {rev.name} <CheckCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  </h4>
                  <p className="text-[#888888] text-[11px]">{rev.city}</p>
                </div>
                <span className="text-[10px] bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] px-2.5 py-1 rounded-full font-medium">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
