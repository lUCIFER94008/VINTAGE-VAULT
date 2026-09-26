'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/lib/whatsapp';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();
  const { showToast } = useToast();
  const [checkingAuth, setCheckingAuth] = useState(false);

  const total = subtotal;

  const handleProceedToAddress = async () => {
    if (items.length === 0) {
      showToast('Your cart is empty.', 'error');
      return;
    }

    setCheckingAuth(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          router.push('/address');
          return;
        }
      }

      if (res.status === 401) {
        router.push('/login?redirect=/address');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.user) {
        router.push('/address');
      } else {
        router.push('/login?redirect=/address');
      }
    } catch (err) {
      console.error('Auth check error:', err);
      showToast('Unable to verify your login. Please try again.', 'error');
    } finally {
      setCheckingAuth(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-[#F8F8F8] border border-[#EAEAEA] rounded-full flex items-center justify-center mx-auto text-[#111111]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
              YOUR CART IS EMPTY
            </h1>
            <p className="text-[#666666] text-sm">
              Discover heavyweight jerseys, raw denim & everyday streetwear.
            </p>
          </div>
          <div>
            <Link
              href="/products"
              className="inline-block bg-[#111111] text-white font-black text-xs px-8 py-4 rounded-2xl uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-md"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-[#EAEAEA] pb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-tight">
            SHOPPING CART ({itemCount})
          </h1>
          <p className="text-xs text-[#666666] mt-1">
            Review your items before adding your delivery address.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const image =
                item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

              const productId = item.product._id?.toString() || (item.product as any).id || item.product.slug;

              return (
                <div
                  key={`${productId}-${item.size}-${item.color}-${index}`}
                  className="p-4 sm:p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shrink-0">
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.product.slug || productId}`}
                        className="font-bold text-[#111111] text-sm hover:text-zinc-600 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex flex-wrap gap-2 text-xs text-[#666666] font-medium">
                        <span>Size: <strong className="text-[#111111]">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-[#111111]">{item.color}</strong></span>
                      </div>
                      <p className="text-sm font-black text-[#111111] pt-1">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAEAEA]">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-white border border-[#EAEAEA] rounded-xl">
                      <button
                        onClick={() =>
                          updateQuantity(productId, item.size, item.color, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#111111] font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(productId, item.size, item.color, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-[#111111] font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <span className="text-sm font-black text-[#111111] font-mono">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(productId, item.size, item.color)}
                      className="p-2 text-[#888888] hover:text-[#DC2626] transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div className="p-6 rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-6 lg:sticky top-24 shadow-sm">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#111111] border-b border-[#EAEAEA] pb-4">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 text-sm text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#111111]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="pt-3 border-t border-[#EAEAEA] flex justify-between items-center text-base font-black text-[#111111]">
                <span>TOTAL</span>
                <span className="text-xl text-[#111111]">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleProceedToAddress}
              disabled={checkingAuth}
              className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <span>{checkingAuth ? 'CHECKING...' : 'PROCEED TO ADDRESS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-xs text-[#888888] pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#111111]" />
                <span>Fast express dispatch all over India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#25D366]" />
                <span>Order saved securely on MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
