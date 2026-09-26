'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safe product attribute fallbacks
  const safeId = product?._id?.toString() || (product as any)?.id || product?.slug || 'product';
  const safeName = product?.name || 'Unnamed Product';
  const safePrice = product?.price ?? 0;
  const safeOriginalPrice = product?.originalPrice ?? safePrice;
  const safeCategory = product?.category || 'Collection';
  const safeStock = product?.stock ?? 0;
  const safeRating = product?.rating ?? 4.8;
  const safeDiscount = product?.discount ?? 0;

  const inWishlist = isInWishlist(safeId);

  const defaultPlaceholder =
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

  const primaryImage =
    !imageError && product?.images && product.images.length > 0
      ? product.images[0]
      : defaultPlaceholder;

  const hoverImage =
    !imageError && product?.images && product.images.length > 1
      ? product.images[1]
      : primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedSize = product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    const selectedColor = product?.colors && product.colors.length > 0 ? product.colors[0] : 'Default';

    addToCart(product, selectedSize, selectedColor, 1);
    showToast(`Added "${safeName}" to your cart!`, 'success');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      inWishlist ? `Removed from wishlist` : `Added "${safeName}" to wishlist`,
      'info'
    );
  };

  return (
    <div
      className="group relative bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F8F8]">
        <Link href={`/product/${product?.slug || safeId}`}>
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={safeName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {safeDiscount > 0 && (
            <span className="bg-[#DC2626] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              {safeDiscount}% OFF
            </span>
          )}
          {product?.isNewArrival && (
            <span className="bg-[#111111] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Heart Button - White circular with dark icon */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full bg-white text-[#111111] shadow-md border border-[#EAEAEA] transition-all duration-200 z-10 hover:scale-110 ${
            inWishlist ? 'text-[#DC2626]' : 'hover:text-[#DC2626]'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
        </button>

        {/* Hover Quick Actions Overlay */}
        <div
          className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <Link
            href={`/product/${product?.slug || safeId}`}
            className="flex-1 bg-white/95 text-[#111111] text-xs font-semibold py-2.5 rounded-xl border border-[#EAEAEA] shadow-md backdrop-blur-md flex items-center justify-center gap-1.5 hover:bg-[#F8F8F8] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={safeStock <= 0}
            className="flex-1 bg-[#111111] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-zinc-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#666666] mb-1">
            <span className="capitalize font-medium text-[#666666] truncate max-w-[120px]">
              {safeCategory.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{safeRating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product?.slug || safeId}`}>
            <h3 className="text-sm font-bold text-[#111111] tracking-tight line-clamp-1 hover:text-zinc-600 transition-colors">
              {safeName}
            </h3>
          </Link>
        </div>

        {/* Stock & Price */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-black text-[#111111] tracking-tight">
              {formatCurrency(safePrice)}
            </span>
            {safeOriginalPrice > safePrice && (
              <span className="text-xs text-[#888888] line-through font-medium">
                {formatCurrency(safeOriginalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Mobile / Default Button */}
          <button
            onClick={handleAddToCart}
            disabled={safeStock <= 0}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{safeStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
