'use client';

export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'VV10245';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        {/* Big Green Check Icon */}
        <div className="w-24 h-24 bg-[#25D366]/10 border-2 border-[#25D366] text-[#25D366] rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase bg-[#25D366]/10 border border-[#25D366]/30 px-3.5 py-1.5 rounded-full inline-block">
            ORDER SAVED & SENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] uppercase tracking-tight">
            ORDER REQUEST SENT
          </h1>
          <p className="text-[#666666] text-sm max-w-md mx-auto leading-relaxed">
            Your order details have been saved to VINTAGE VAULT database and sent on WhatsApp.
          </p>
        </div>

        {/* Order ID Card */}
        <div className="p-6 rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] max-w-sm mx-auto space-y-2 shadow-sm">
          <span className="text-xs text-[#888888] font-mono uppercase tracking-wider block">
            YOUR UNIQUE ORDER ID
          </span>
          <span className="text-2xl font-black text-[#111111] tracking-wider font-mono">
            {orderId}
          </span>
        </div>

        {/* Action Buttons (Black Buttons) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-2">
          <Link
            href="/account/orders"
            className="w-full sm:w-auto bg-[#111111] text-white font-black text-xs px-8 py-4 rounded-2xl uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>VIEW MY ORDERS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto bg-white border border-[#111111] text-[#111111] font-bold text-xs px-8 py-4 rounded-2xl uppercase tracking-wider hover:bg-[#F8F8F8] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        {/* Need Help WhatsApp Support */}
        <div className="pt-8 border-t border-[#EAEAEA] text-xs text-[#666666] space-y-3">
          <p>Need help or want to update your delivery address?</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] hover:underline font-bold uppercase tracking-wider"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>CHAT WITH US ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto p-12 text-center text-[#666666]">Loading order status...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
