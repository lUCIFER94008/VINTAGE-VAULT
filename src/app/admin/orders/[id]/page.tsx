'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/whatsapp';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, MessageCircle, MapPin, User } from 'lucide-react';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Pending');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
          setSelectedStatus(data.order.orderStatus);
        }
      } catch (err) {
        console.error('Error fetching order', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  const handleStatusSave = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: selectedStatus }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        showToast(`Order status updated to "${selectedStatus}".`, 'success');
      } else {
        showToast(data.message || 'Failed to update status.', 'error');
      }
    } catch (err) {
      showToast('Error saving order status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-16 text-center text-[#666666]">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-16 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-[#111111]">Order Not Found</h2>
        <Link href="/admin/orders" className="text-xs text-[#111111] underline">
          Back to Order Management
        </Link>
      </div>
    );
  }

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#666666] hover:text-[#111111] flex items-center gap-1.5 uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders List
          </Link>
          <a
            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 uppercase tracking-wider transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" /> WHATSAPP CUSTOMER
          </a>
        </div>

        {/* Main Order Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
            <div>
              <span className="text-xs font-bold text-[#25D366] uppercase tracking-widest">
                ORDER MANAGEMENT
              </span>
              <h1 className="text-3xl font-black text-[#111111] font-mono uppercase mt-1">
                {order.orderId}
              </h1>
              <p className="text-xs text-[#666666] font-mono mt-1">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Status Change Selector Box */}
            <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-2">
              <label className="text-[11px] font-bold text-[#666666] uppercase block">
                UPDATE ORDER STATUS
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="bg-white border border-[#EAEAEA] text-[#111111] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusSave}
                  disabled={updating}
                  className="bg-[#111111] hover:bg-zinc-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl uppercase tracking-wider disabled:opacity-50"
                >
                  {updating ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </div>
          </div>

          {/* Customer & Address Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Customer Profile */}
            <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <User className="w-4 h-4 text-[#111111]" />
                <span>CUSTOMER INFO</span>
              </h3>
              <div className="text-xs text-[#666666] space-y-1 pt-1">
                <p className="font-bold text-[#111111] text-sm">{order.customerName}</p>
                <p className="font-mono text-[#666666]">Phone: {order.phone}</p>
                <p className="text-[#888888]">WhatsApp Status: {order.whatsappSent ? 'Message Generated' : 'Pending'}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#25D366]" />
                <span>DELIVERY ADDRESS</span>
              </h3>
              <div className="text-xs text-[#666666] space-y-1 pt-1">
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state} - {order.pincode}
                </p>
                {order.landmark && <p className="text-[#888888]">Landmark: {order.landmark}</p>}
              </div>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div className="space-y-4 pt-4 border-t border-[#EAEAEA]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
              ITEMS IN ORDER ({order.items.length})
            </h3>

            <div className="divide-y divide-[#EAEAEA] border border-[#EAEAEA] rounded-2xl overflow-hidden bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#111111]">{item.name}</h4>
                      <p className="text-[11px] text-[#666666] font-mono">
                        Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#111111]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <span className="block text-[10px] text-[#888888]">
                      ({formatCurrency(item.price)} each)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] flex justify-between items-center text-sm font-black text-[#111111]">
              <span>TOTAL ORDER VALUE</span>
              <span className="text-xl text-[#111111] font-mono">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
