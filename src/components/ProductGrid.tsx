'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = 'NO PRODUCTS AVAILABLE',
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-[#EAEAEA] rounded-3xl p-12 text-center shadow-sm space-y-4 my-6">
        <div className="w-12 h-12 rounded-full bg-[#F8F8F8] text-[#111111] flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#111111] uppercase tracking-wide">
            {emptyMessage}
          </h3>
          <p className="text-xs text-[#666666]">
            New products are coming soon. Check back later or browse all collections.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-block bg-[#111111] text-white text-xs font-bold px-8 py-3.5 rounded-full hover:bg-zinc-800 transition-colors uppercase tracking-wider shadow-sm"
          >
            SHOP ALL PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => {
        const productKey =
          (product && (product._id?.toString() || (product as any).id || product.slug)) ||
          `product-${index}`;

        return <ProductCard key={productKey} product={product} />;
      })}
    </div>
  );
}
