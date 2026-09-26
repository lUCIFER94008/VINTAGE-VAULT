'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, X } from 'lucide-react';
import { Product } from '@/types';
import ProductImageUpload from '@/components/admin/ProductImageUpload';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const availableCategories = [
    { label: '5-Sleeve Jerseys', value: '5-sleeve-jerseys' },
    { label: 'Jeans', value: 'jeans' },
    { label: 'Full-Sleeve Shirts', value: 'full-sleeve-shirts' },
    { label: 'Socks', value: 'socks' },
    { label: 'Caps', value: 'caps' },
    { label: 'Glasses', value: 'glasses' },
  ];

  const allPossibleSizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          setProduct(p);
          setName(p.name);
          setCategory(p.category);
          setDescription(p.description);
          setPrice(p.price.toString());
          setOriginalPrice(p.originalPrice.toString());
          setStock(p.stock.toString());
          setSizes(p.sizes || []);
          setColors(p.colors || []);
          setImages(p.images || []);
          setIsFeatured(p.isFeatured);
          setIsNewArrival(p.isNewArrival);
          setIsActive(p.isActive);
        }
      } catch (err) {
        console.error('Failed to load product for edit', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

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

    if (!name || !price || images.length === 0) {
      showToast('Product name, price, and at least one image are required.', 'error');
      return;
    }

    // Ensure no base64 strings accidentally slip in
    const hasBase64 = images.some(img => img.startsWith('data:image/'));
    if (hasBase64) {
      showToast('Base64 image data is not allowed. Please upload via Cloudinary or use image URLs.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          description,
          price: Number(price),
          originalPrice: Number(originalPrice || Number(price) * 2),
          stock: Number(stock),
          sizes,
          colors,
          images,
          isFeatured,
          isNewArrival,
          isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Product updated successfully!', 'success');
        router.push('/admin/products');
      } else {
        showToast(data.message || 'Failed to update product.', 'error');
      }
    } catch (err) {
      showToast('Error updating product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-16 text-center text-[#666666]">Loading product details...</div>;
  }

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
              EDIT PRODUCT: {product?.name}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                PRODUCT NAME *
              </label>
              <input
                type="text"
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Sizes */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                SIZES
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

            {/* Colors */}
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
                placeholder="Type color name and press Enter"
                onKeyDown={handleAddColor}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Images */}
            <div className="sm:col-span-2">
              <ProductImageUpload
                images={images}
                setImages={setImages}
                onUploadingChange={setUploadingImage}
              />
            </div>

            {/* Flags */}
            <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2 border-t border-[#EAEAEA]">
              <label className="flex items-center gap-2 text-xs font-bold text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#111111] cursor-pointer"
                />
                <span>FEATURED</span>
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
            disabled={saving || uploadingImage}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
          >
            {uploadingImage
              ? 'Uploading images...'
              : saving
              ? 'SAVING CHANGES...'
              : 'SAVE CHANGES'}
          </button>
        </form>
      </div>
    </div>
  );
}
