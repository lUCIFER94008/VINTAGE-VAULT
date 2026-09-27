'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { formatCurrency, formatPhoneNumber } from '@/lib/whatsapp';
import { MapPin, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Address } from '@/types';

export default function OrderSummaryPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    const savedAddr = localStorage.getItem('vv_checkout_address');
    if (savedAddr) {
      setAddress(JSON.parse(savedAddr));
    } else {
      router.push('/address');
    }
  }, [items, router]);

  if (!address || items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#666666] font-medium">
          Loading order details...
        </div>
      </div>
    );
  }

  const handleBookOnWhatsApp = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        image: item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          customerName: address.fullName,
          phone: address.phone,
          additionalPhone: address.additionalPhone || '',
          address: `${address.house}, ${address.street}, ${address.area}`,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark || '',
          userId: user?._id || '',
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        showToast('Order saved to MongoDB! Opening WhatsApp...', 'success');

        // Clear local storage cart
        clearCart();
        localStorage.removeItem('vv_checkout_address');

        // Open WhatsApp URL in new tab
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }

        // Navigate to Order Success page
        router.push(`/order-success?orderId=${data.order.orderId}`);
      } else {
        showToast(data.message || 'Failed to create order.', 'error');
      }
    } catch (err: any) {
      console.error('WhatsApp checkout error', err);
      showToast('Error creating order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Steps */}
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#888888] border-b border-[#EAEAEA] pb-4">
          <span className="text-[#888888]">1. Cart</span>
          <span className="text-[#888888]">2. Address</span>
          <span className="text-[#111111] border-b-2 border-[#111111] pb-4 -mb-4 font-extrabold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#25D366]" /> 3. Summary & WhatsApp
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            ORDER SUMMARY
          </h1>
          <p className="text-xs text-[#666666]">
            Review your items and shipping details before completing your order on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Items & Address */}
          <div className="md:col-span-2 space-y-6">
            {/* Items */}
            <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#111111] border-b border-[#EAEAEA] pb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#111111]" />
                <span>ORDERED ITEMS ({items.length})</span>
              </h2>

              <div className="divide-y divide-[#EAEAEA]">
                {items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111111] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#666666]">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#111111] font-mono">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Preview (Light Gray Background) */}
            <div className="p-6 rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-[#EAEAEA] pb-3">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#25D366]" />
                  <span>DELIVERY ADDRESS</span>
                </h2>
                <button
                  onClick={() => router.push('/address')}
                  className="text-xs text-[#666666] hover:text-[#111111] underline font-medium"
                >
                  Edit Address
                </button>
              </div>

              <div className="text-xs text-[#111111] space-y-1">
                <p className="font-bold text-[#111111] text-sm">{address.fullName}</p>
                <p className="text-[#666666] font-mono">{formatPhoneNumber(address.phone)}</p>
                {address.additionalPhone && (
                  <p className="text-[#666666] font-mono">
                    Additional: {formatPhoneNumber(address.additionalPhone)}
                  </p>
                )}
                <p className="pt-2 text-[#666666]">
                  {address.house}, {address.street}, {address.area}
                </p>
                <p className="text-[#666666]">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                {address.landmark && (
                  <p className="pt-1 text-[#888888]">{address.landmark}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Total & WhatsApp Trigger */}
          <div className="p-6 rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-6 h-fit shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#111111] border-b border-[#EAEAEA] pb-3">
              TOTAL AMOUNT
            </h2>

            <div className="space-y-3 text-xs text-[#666666]">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-bold text-[#111111]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-[#25D366] uppercase">FREE</span>
              </div>
              <div className="pt-3 border-t border-[#EAEAEA] flex justify-between items-center text-lg font-black text-[#111111]">
                <span>GRAND TOTAL</span>
                <span className="text-[#111111]">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <WhatsAppButton
              onClick={handleBookOnWhatsApp}
              loading={loading}
              text="BOOK ON WHATSAPP"
            />

            <div className="p-4 rounded-2xl bg-white border border-[#EAEAEA] text-[11px] text-[#666666] space-y-2">
              <div className="flex items-center gap-2 text-[#25D366] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>WhatsApp Direct Confirmation</span>
              </div>
              <p>
                Clicking Book on WhatsApp saves your order into our database and generates your order message automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
