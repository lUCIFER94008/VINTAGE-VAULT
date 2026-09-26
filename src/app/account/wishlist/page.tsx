'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import ProductGrid from '@/components/ProductGrid';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#EAEAEA] pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight flex items-center gap-3">
              <Heart className="w-7 h-7 text-[#DC2626] fill-current" />
              <span>MY WISHLIST ({wishlist.length})</span>
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              Your saved streetwear essentials. Move them to cart whenever you are ready.
            </p>
          </div>
        </div>

        <ProductGrid
          products={wishlist}
          emptyMessage="Your wishlist is empty. Explore our catalog and tap the heart icon to save products."
        />
      </div>
    </div>
  );
}
