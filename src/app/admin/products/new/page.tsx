'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, X } from 'lucide-react';
import ProductImageUpload from '@/components/admin/ProductImageUpload';

export default function AddProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('5-sleeve-jerseys');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<string[]>(['Black']);
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const availableCategories = [
    { label: '5-Sleeve Jerseys', value: '5-sleeve-jerseys' },
    { label: 'Baggy', value: 'baggy' },
    { label: 'Full-Sleeve Stripes', value: 'full-sleeve-stripes' },
    { label: 'Socks', value: 'socks' },
    { label: 'Headwear', value: 'headwear' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Track Pant', value: 'track-pant' },
  ];

  const allPossibleSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];

  const toggleSize = (sz: string) => {
    setSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleAddColor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault();
      const val = e.currentTarget.value.trim();
      if (val && !colors.includes(val)) {
        setColors([...colors, val]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeColor = (col: string) => {
    setColors(colors.filter((c) => c !== col));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadingImage) {
      showToast('Please wait for image uploads to complete.', 'error');
      return;
    }

    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    if (!price || isNaN(Number(price))) {
      showToast('Valid sale price is required.', 'error');
      return;
    }

    if (images.length === 0) {
      showToast('At least one product image is required.', 'error');
      return;
    }

    // Ensure no base64 strings accidentally slip in
    const hasBase64 = images.some(img => img.startsWith('data:image/'));
    if (hasBase64) {
      showToast('Base64 image data is not allowed. Please upload via Cloudinary or use image URLs.', 'error');
      return;
    }

    setLoading(true);
    try {
      const numPrice = Number(price);
      const numOriginal = originalPrice ? Number(originalPrice) : numPrice;

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          price: numPrice,
          originalPrice: numOriginal,
          stock: Number(stock || 0),
          sizes,
          colors,
          images,
          isFeatured,
          isNewArrival,
          isActive,
        }),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        if (res.status === 413 || text.includes('Request Entity Too Large')) {
          throw new Error('Product request is too large. Please upload smaller images or use image URLs.');
        }
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      if (res.ok && data.success) {
        showToast('PRODUCT CREATED SUCCESSFULLY', 'success');
        router.push('/admin/products');
      } else {
        const errorMsg = data.message || data.error || 'Failed to create product.';
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Network error while creating product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-6">
          <div>
            <button
              onClick={() => router.push('/admin/products')}
              className="text-xs font-bold text-[#666666] hover:text-[#111111] flex items-center gap-1.5 uppercase mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Products
            </button>
            <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
              ADD NEW PRODUCT
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                PRODUCT NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Argentina 5-Sleeve Retro Jersey"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                CATEGORY *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111] cursor-pointer"
              >
                {availableCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                STOCK QUANTITY *
              </label>
              <input
                type="number"
                placeholder="25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111] font-mono"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                SALE PRICE (₹) *
              </label>
              <input
                type="number"
                placeholder="699"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111] font-mono"
                required
              />
            </div>

            {/* Original Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                ORIGINAL PRICE (MRP ₹)
              </label>
              <input
                type="number"
                placeholder="1399"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111] font-mono"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                DESCRIPTION
              </label>
              <textarea
                rows={4}
                placeholder="Heavyweight 280 GSM cotton knit jersey with retro blue and white stripes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Sizes picker */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                AVAILABLE SIZES
              </label>
              <div className="flex flex-wrap gap-2">
                {allPossibleSizes.map((sz) => (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      sizes.includes(sz)
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white border-[#EAEAEA] text-[#666666]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors picker */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                COLORS (PRESS ENTER TO ADD)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colors.map((c) => (
                  <span
                    key={c}
                    className="bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    {c}
                    <button type="button" onClick={() => removeColor(c)}>
                      <X className="w-3 h-3 text-[#888888] hover:text-[#DC2626]" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type color name (e.g. Jet Black) and press Enter"
                onKeyDown={handleAddColor}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Images Section */}
            <div className="sm:col-span-2">
              <ProductImageUpload
                images={images}
                setImages={setImages}
                onUploadingChange={setUploadingImage}
              />
            </div>

            {/* Checkboxes */}
            <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2 border-t border-[#EAEAEA]">
              <label className="flex items-center gap-2 text-xs font-bold text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#111111] cursor-pointer"
                />
                <span>FEATURED (TRENDING)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#111111] cursor-pointer"
                />
                <span>NEW ARRIVAL</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#111111] cursor-pointer"
                />
                <span>IS ACTIVE</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
          >
            {uploadingImage
              ? 'Uploading images...'
              : loading
              ? 'SAVING PRODUCT TO MONGODB...'
              : 'SAVE PRODUCT'}
          </button>
        </form>
      </div>
    </div>
  );
}
