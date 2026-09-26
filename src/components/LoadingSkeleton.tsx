'use client';

import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4 animate-pulse space-y-4">
      <div className="aspect-[4/5] bg-[#F8F8F8] rounded-xl w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-[#EAEAEA] rounded w-1/3" />
        <div className="h-4 bg-[#EAEAEA] rounded w-4/5" />
        <div className="h-5 bg-[#EAEAEA] rounded w-1/2 pt-2" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-[#F8F8F8] border border-[#EAEAEA] rounded-xl w-full" />
      ))}
    </div>
  );
}
