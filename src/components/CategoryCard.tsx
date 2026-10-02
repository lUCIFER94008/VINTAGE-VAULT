'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export default function CategoryCard({ name, slug, image }: CategoryCardProps) {
  const hasValidImage = Boolean(
    image &&
      typeof image === 'string' &&
      image.trim() !== '' &&
      !image.includes('unsplash.com') &&
      !image.includes('pexels.com') &&
      !image.includes('placeholder')
  );

  return (
    <Link
      href={`/category/${slug}`}
      className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] flex flex-col justify-end p-6 transition-all duration-300 hover:border-zinc-400 hover:shadow-lg"
    >
      {/* Background Image or Neutral Minimal Empty Area */}
      {hasValidImage ? (
        <>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-[#F0F0F0] flex items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#EAEAEA] text-[#111111] font-black text-xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#888888] uppercase block">
              VINTAGE VAULT
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#666666] uppercase">
            COLLECTION
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight uppercase mt-0.5">
            {name}
          </h3>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
}
