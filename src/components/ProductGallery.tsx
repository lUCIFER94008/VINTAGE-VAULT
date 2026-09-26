'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const safeImages =
    images && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'];

  const [selectedImage, setSelectedImage] = useState(safeImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Active Image View */}
      <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shadow-sm">
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
          unoptimized
        />
      </div>

      {/* Gallery Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === img ? 'border-[#111111] scale-95 shadow-md' : 'border-[#EAEAEA] opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-cover object-center"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
