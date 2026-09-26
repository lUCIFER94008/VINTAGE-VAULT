'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/whatsapp';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Share2,
  CheckCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'size' | 'delivery' | 'reviews'>('desc');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#666666] font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold uppercase text-[#111111]">Product Not Found</h2>
        <p className="text-[#666666]">The product you are looking for does not exist or has been removed.</p>
        <Link
          href="/products"
          className="inline-block bg-[#111111] text-white font-bold text-xs px-8 py-3 rounded-xl uppercase tracking-wider"
        >
          EXPLORE CATALOG
        </Link>
      </div>
    );
  }

  const safeId = product._id?.toString() || (product as any).id || product.slug;
  const inWishlist = isInWishlist(safeId);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select a size first.', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor || 'Default', quantity);
    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showToast('Please select a size first.', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor || 'Default', quantity);
    router.push('/cart');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on VINTAGE VAULT`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#666666] uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#111111] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
          <Link href={`/category/${product.category}`} className="hover:text-[#111111] transition-colors">
            {product.category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
          <span className="text-[#111111] truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT GALLERY */}
          <ProductGallery images={product.images} name={product.name} />

          {/* RIGHT DETAILS */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-widest bg-[#F8F8F8] border border-[#EAEAEA] px-3 py-1 rounded-full">
                  {product.category.replace(/-/g, ' ')}
                </span>
                {product.stock > 0 ? (
                  <span className="text-xs font-semibold text-[#25D366] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> IN STOCK
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-[#DC2626]">OUT OF STOCK</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#111111] uppercase tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-[#111111] text-sm">
                    {product.rating ? product.rating.toFixed(1) : '4.8'}
                  </span>
                </div>
                <span className="text-[#888888]">•</span>
                <span className="text-[#666666] font-medium">
                  {product.reviewsCount || 12} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] flex items-center gap-4">
              <span className="text-3xl font-black text-[#111111] tracking-tight">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-[#888888] line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="bg-[#DC2626] text-white text-xs font-black uppercase px-3 py-1 rounded-full">
                  SAVE {product.discount}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-[#666666] leading-relaxed">{product.description}</p>

            {/* SIZE SELECTOR */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-widest text-[#111111]">
                  SELECT SIZE:
                </span>
                <button
                  onClick={() => setActiveTab('size')}
                  className="text-[#666666] hover:text-[#111111] underline font-medium"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes?.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] h-12 px-4 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#111111] text-white border-[#111111] shadow-md scale-105'
                        : 'bg-white border-[#EAEAEA] text-[#666666] hover:border-[#111111]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR SELECTOR */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111] block">
                  SELECT COLOR:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === col
                          ? 'bg-[#111111] text-white border-[#111111] shadow-md'
                          : 'bg-white border-[#EAEAEA] text-[#666666] hover:border-[#111111]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY PICKER */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#111111] block">
                QUANTITY:
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-[#EAEAEA] rounded-xl">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#111111] font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#111111] font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#888888] font-medium">
                  {product.stock} items left in vault
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-md disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-white hover:bg-[#F8F8F8] text-[#111111] border border-[#111111] font-black text-xs py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-sm disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    showToast(
                      inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
                      'info'
                    );
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    inWishlist
                      ? 'bg-red-50 border-red-200 text-[#DC2626]'
                      : 'bg-white border-[#EAEAEA] text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
                  <span>{inWishlist ? 'IN WISHLIST' : 'ADD TO WISHLIST'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-3 px-4 rounded-xl bg-white border border-[#EAEAEA] text-[#666666] hover:text-[#111111] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>SHARE</span>
                </button>
              </div>
            </div>

            {/* Quick Info Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#EAEAEA] text-center">
              <div className="p-3 bg-[#F8F8F8] rounded-xl space-y-1 border border-[#EAEAEA]">
                <Truck className="w-4 h-4 text-[#111111] mx-auto" />
                <span className="text-[10px] font-bold text-[#111111] uppercase block">FAST DISPATCH</span>
              </div>
              <div className="p-3 bg-[#F8F8F8] rounded-xl space-y-1 border border-[#EAEAEA]">
                <RotateCcw className="w-4 h-4 text-[#111111] mx-auto" />
                <span className="text-[10px] font-bold text-[#111111] uppercase block">EASY RETURN</span>
              </div>
              <div className="p-3 bg-[#F8F8F8] rounded-xl space-y-1 border border-[#EAEAEA]">
                <ShieldCheck className="w-4 h-4 text-[#111111] mx-auto" />
                <span className="text-[10px] font-bold text-[#111111] uppercase block">100% AUTHENTIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER INFORMATION TABS */}
        <div className="pt-12 border-t border-[#EAEAEA] space-y-6">
          <div className="flex border-b border-[#EAEAEA] overflow-x-auto gap-8">
            {[
              { id: 'desc', label: 'DESCRIPTION' },
              { id: 'size', label: 'SIZE GUIDE' },
              { id: 'delivery', label: 'DELIVERY & RETURNS' },
              { id: 'reviews', label: `REVIEWS (${product.reviewsCount || 12})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 text-xs font-black uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#888888] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm text-sm text-[#666666] leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#111111] text-base uppercase">PRODUCT DETAILS</h3>
                <p>{product.description}</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#888888] font-mono">
                  <li>Material: 100% Premium Heavyweight Combed Cotton / Raw Denim</li>
                  <li>Fit: Oversized Streetwear Drop-Shoulder Silhouette</li>
                  <li>Care Instructions: Machine wash cold inside out, tumble dry low</li>
                  <li>Origin: Crafted with precision in India</li>
                </ul>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#111111] text-base uppercase">OVERSIZED FIT CHART (INCHES)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#666666] border-collapse">
                    <thead>
                      <tr className="border-b border-[#EAEAEA] text-[#888888] uppercase font-mono">
                        <th className="py-2.5">SIZE</th>
                        <th className="py-2.5">CHEST</th>
                        <th className="py-2.5">LENGTH</th>
                        <th className="py-2.5">SLEEVE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEAEA] font-mono">
                      <tr><td className="py-2.5 font-bold text-[#111111]">S</td><td>42&quot;</td><td>28&quot;</td><td>12.5&quot;</td></tr>
                      <tr><td className="py-2.5 font-bold text-[#111111]">M</td><td>44&quot;</td><td>29&quot;</td><td>13.0&quot;</td></tr>
                      <tr><td className="py-2.5 font-bold text-[#111111]">L</td><td>46&quot;</td><td>30&quot;</td><td>13.5&quot;</td></tr>
                      <tr><td className="py-2.5 font-bold text-[#111111]">XL</td><td>48&quot;</td><td>31&quot;</td><td>14.0&quot;</td></tr>
                      <tr><td className="py-2.5 font-bold text-[#111111]">XXL</td><td>50&quot;</td><td>32&quot;</td><td>14.5&quot;</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#111111] text-base uppercase">SHIPPING INFORMATION</h3>
                <p>
                  Orders are processed and dispatched within 24 hours of WhatsApp confirmation. Delivery typically takes 2–5 business days depending on location.
                </p>
                <h4 className="font-bold text-[#111111] text-sm uppercase pt-2">RETURNS & EXCHANGES</h4>
                <p>
                  We accept size replacements and exchanges within 7 days of delivery. Products must be unwashed and unworn with original tags attached.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="font-bold text-[#111111] text-base uppercase">CUSTOMER REVIEWS</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#111111]">Mohammed Rizwan</span>
                      <span className="text-[#888888] font-mono">Verified Purchase</span>
                    </div>
                    <div className="flex gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <p className="text-xs text-[#666666]">
                      The fabric weight and stitching are incredible. Easily my favorite piece in the wardrobe right now.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
