'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import { formatCurrency, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { MapPin, MessageCircle, ArrowLeft, Truck } from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Error loading order', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-16 text-center text-[#666666]">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-16 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-[#111111]">Order Not Found</h2>
        <Link href="/account/orders" className="text-xs text-[#111111] underline font-semibold">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const timelineSteps = [
    { label: 'Order Placed', statusKey: 'Pending' },
    { label: 'Confirmed', statusKey: 'Confirmed' },
    { label: 'Packed', statusKey: 'Packed' },
    { label: 'Shipped', statusKey: 'Shipped' },
    { label: 'Out for Delivery', statusKey: 'Out for Delivery' },
    { label: 'Delivered', statusKey: 'Delivered' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    const idx = timelineSteps.findIndex((s) => s.statusKey === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
          <Link
            href="/account/orders"
            className="text-xs font-bold text-[#666666] hover:text-[#111111] flex items-center gap-1.5 uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi VINTAGE VAULT, regarding my order ${order.orderId}`)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 uppercase tracking-wider transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" /> CHAT ON WHATSAPP
          </a>
        </div>

        {/* Header Info */}
        <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#25D366] uppercase tracking-widest">
              ORDER DETAILS
            </span>
            <h1 className="text-2xl font-black text-[#111111] font-mono uppercase mt-1">
              {order.orderId}
            </h1>
            <p className="text-xs text-[#666666] font-mono mt-1">
              Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-[#666666] block uppercase">Status:</span>
            <span className="text-sm font-black uppercase text-[#111111] bg-[#F8F8F8] border border-[#EAEAEA] px-3 py-1 rounded-full inline-block mt-1">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* STATUS TIMELINE TRACKER */}
        {order.orderStatus !== 'Cancelled' ? (
          <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#25D366]" />
              <span>ORDER PROGRESS TIMELINE</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.statusKey} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-[#25D366] text-white shadow-sm'
                          : 'bg-[#F8F8F8] border border-[#EAEAEA] text-[#888888]'
                      } ${isCurrent ? 'ring-4 ring-[#25D366]/20 scale-110' : ''}`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        isPassed ? 'text-[#111111]' : 'text-[#888888]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-[#DC2626] text-xs space-y-1">
            <strong className="text-sm font-bold block uppercase">ORDER CANCELLED</strong>
            <p>This order has been marked as cancelled by the store administrator.</p>
          </div>
        )}

        {/* Items & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items Table */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] border-b border-[#EAEAEA] pb-3">
              PRODUCTS IN ORDER ({order.items.length})
            </h3>

            <div className="divide-y divide-[#EAEAEA] space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#111111] line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-[#666666]">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#111111] font-mono">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EAEAEA] flex justify-between items-center text-sm font-black">
              <span className="text-[#666666]">Total Paid</span>
              <span className="text-[#111111] text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] shadow-sm space-y-3 h-fit">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] border-b border-[#EAEAEA] pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#25D366]" />
              <span>SHIPPING ADDRESS</span>
            </h3>

            <div className="text-xs text-[#111111] space-y-1">
              <p className="font-bold text-[#111111] text-sm">{order.customerName}</p>
              <p className="text-[#666666] font-mono">{order.phone}</p>
              <p className="pt-2 text-[#666666]">{order.address}</p>
              <p className="text-[#666666]">
                {order.city}, {order.state} - {order.pincode}
              </p>
              {order.landmark && <p className="text-[#888888]">Landmark: {order.landmark}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
